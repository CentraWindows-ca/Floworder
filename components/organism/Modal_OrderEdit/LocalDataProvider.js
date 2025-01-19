import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";
import OrdersApi from "lib/api/OrdersApi";
import useLoadingBar from "lib/hooks/useLoadingBar";
import constants from "lib/constants";

export const LocalDataContext = createContext(null);

export const LocalDataProvider = ({
  children,
  initWorkOrder,
  kind = "MASTER",
  facility,
  onSave,
  ...props
}) => {
  const generalContext = useContext(GeneralContext);
  const [data, setData] = useState(null);

  const [isEditable, setIsEditable] = useState(false);

  // only display. upload/delete will directly call function
  const [existingAttachments, setExistingAttachments] = useState(null);
  const [newAttachments, setNewAttachments] = useState(null);

  // UI purpose
  const [expands, setExpands] = useState({});

  useEffect(() => {
    if (initWorkOrder?.workOrderNo) {
      init(initWorkOrder?.workOrderNo);
    }
  }, [initWorkOrder?.workOrderNo]);

  const handleFetchFromWindowMaker = () => {
    // TODO: fetch from window maker
    doFetchFromWindowMaker();
  };

  const handleUpdateStatus = (k) => {
    doUpdateStatus(k);
  };

  const handleChange = (v, k) => {
    setData((prev) => {
      const _newV = JSON.parse(JSON.stringify(prev || {}));
      _.set(_newV, k, v);
      return _newV;
    });
  };

  const handleAnchor = (id, closeOthers) => {
    if (closeOthers) {
      setExpands(() => ({
        [id]: true,
      }));
    } else {
      setExpands((prev) => ({
        ...prev,
        [id]: true,
      }));
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  // ====== api calls
  const init = useLoadingBar(async (initWorkOrderNo) => {
    setData(null);
    // get data by initWorkOrder
    setIsEditable(!!initWorkOrderNo);
    // fetch data
    const res = await OrdersApi.getProdAllByWorkOrderAsync({
      workOrderNo: initWorkOrderNo,
    });

    if (typeof res === "object") {
      // re-assemble data to easier to edit
      const { prodDoorsSubOrders, prodWindowsSubOrders, ...master } = res;
      console.log(res);

      initAttachmentList(constants.PROD_TYPES.MASTER, res.masterId);

      const _orderData = {
        WIN: prodWindowsSubOrders,
        DOOR: prodDoorsSubOrders,
        MASTER: master,
      };

      setData(_orderData);
    }
  });

  const initAttachmentList = useLoadingBar(async () => {
    // prodTypeId, recordId
    const res = await OrdersApi.getAttachmentsByRecordIdAsync({
      prodTypeId: constants.PROD_TYPES.MASTER,
      recordId: data?.MASTER?.masterId,
    });
    setExistingAttachments(res);
  });

  const doUpdateStatus = useLoadingBar(async (k) => {
    const _m = {
      MASTER: "masterId",
      DOOR: "id",
      WIN: "id",
    };

    await OrdersApi.updateStatusByGuidAsync({
      kind,
      Id: data[kind][_m[kind]],
      data: k, //data[kind][_m[kind]], // master and sub has different column name for guid
    });

    await init(initWorkOrder?.workOrderNo);
  });

  const doFetchFromWindowMaker = useLoadingBar(async () => {
    const _newWorkOrderNo = data?.MASTER?.workOrderNo;
    if (facility === "Langley") {
      await OrdersApi.sync_BC_WindowMakerByWorkOrderAsync({
        workOrderNo: _newWorkOrderNo,
      });
    } else if (facility === "Calgary") {
      await OrdersApi.sync_AB_WindowMakerByWorkOrderAsync({
        workOrderNo: _newWorkOrderNo,
      });
    }

    await init(_newWorkOrderNo);
  });

  const doUploadAttachment = useLoadingBar(async (_files) => {
    const { file, notes } = _files[0];
    const res = await OrdersApi.uploadAttachmentsAsync(
      {
        recordId: data?.MASTER?.masterId,
        prodTypeId: constants.PROD_TYPES.MASTER,
        kind: "MASTER",
        uploadingFile: file,
        notes,
      },
      file,
    );

    await initAttachmentList();
  });
  const doDeleteAttachment = useLoadingBar(async (_file) => {
    const res = await OrdersApi.deleteAttachmentsByIdAsync({
      guid: _file.id,
    });

    await initAttachmentList();
  });
  const doSave = useLoadingBar(async () => {
    // save master
    // save window
    // save door
  });

  const context = {
    ...generalContext,
    ...props,
    initWorkOrder,
    data,
    kind,
    facility,
    setData,
    newAttachments,
    setNewAttachments,
    existingAttachments,
    setExistingAttachments,
    onChange: handleChange,
    onUpdateStatus: handleUpdateStatus,
    onAnchor: handleAnchor,
    onFetchFromWindowMaker: handleFetchFromWindowMaker,
    onUploadAttachment: doUploadAttachment,
    onDeleteAttachment: doDeleteAttachment,

    expands,
    setExpands,
    isEditable,
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
