import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";

import utils from "lib/utils";

import OrdersApi from "lib/api/OrdersApi";
import GlassApi from "lib/api/GlassApi";

import useLoadingBar from "lib/hooks/useLoadingBar";
import constants from "lib/constants";

import { localApi } from "./Com";

export const LocalDataContext = createContext(null);

export const LocalDataProvider = ({
  children,
  initWorkOrder,
  kind = "m",
  facility,
  onSave,
  onHide,
  ...props
}) => {
  const generalContext = useContext(GeneralContext);
  const [data, setData] = useState(null);

  const [isEditable, setIsEditable] = useState(false);

  // only display. upload/delete will directly call function
  const [existingAttachments, setExistingAttachments] = useState(null);
  
  const [newAttachments, setNewAttachments] = useState(null);

  const [windowItems, setWindowItems] = useState(null);
  const [doorItems, setDoorItems] = useState(null);
  const [glassItems, setGlassItems] = useState(null);

  const [uiOrderType, setUiOrderType] = useState({})

  // UI purpose
  const [expands, setExpands] = useState({});

  useEffect(() => {
    if (initWorkOrder?.m_WorkOrderNo) {
      init(initWorkOrder?.m_WorkOrderNo);
    }
  }, [initWorkOrder?.m_WorkOrderNo]);

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

  const handleHide = () => {
    clear();
    onHide();
  };

  // ====== api calls
  const clear = () => {
    setData(null);
    setDoorItems(null);
    setWindowItems(null);
    setExistingAttachments(null);
    setNewAttachments(null);
    setGlassItems(null);
  };

  const init = useLoadingBar(async (initWorkOrderNo) => {
    setData(null);
    // get data by initWorkOrder
    setIsEditable(!!initWorkOrderNo);

    // fetch data
    const [res] = await localApi.getWorkOrder(initWorkOrderNo)

    if (typeof res === "object") {
      // re-assemble data to easier to edit

      const {keyValue, value} = res

      const mergedData = {}
      mergedData = { ...value?.d, ...value?.m, ...value?.w }

      // if it has door or window or master info (should always has master. here just for consistency)
      setUiOrderType({
        m: !!value?.m,
        d: !!value?.d,
        w: !!value?.w,
      })
    
      const doorItems = await localApi.getDoorItems(initWorkOrderNo);
      const windowItems = await localApi.getWindowItems(initWorkOrderNo);
      initAttachmentList(keyValue);

      setData(mergedData);
      setDoorItems(doorItems);
      setWindowItems(windowItems);

      const resGlassItems = await GlassApi.getGlassItems(
        initWorkOrderNo,
        mergedData.m_ManufacturingFacility,
      );

      if (resGlassItems) {
        const getStatus = (glassItem) => {
          let result = "Not Ordered";

          if (glassItem?.qty === glassItem?.glassQty) {
            result = "Received";
          } else if (glassItem?.orderDate) {
            result = "Ordered";
          }

          return result;
        };

        setGlassItems((x) => {
          let _glassItems = [...resGlassItems];

          _glassItems?.forEach((g) => {
            g.status = getStatus(g);
            g.receivedExpected = `${g.qty} / ${g.glassQty}`;
            g.shipDate = g.shipDate;
            g.orderDate = g.orderDate;
          });

          return _glassItems;
        });
      }
    }
  });

  const initAttachmentList = useLoadingBar(async (masterId) => {
    // prodTypeId, recordId
    // const res = await OrdersApi.getAttachmentsByRecordIdAsync({
    //   prodTypeId: constants.PROD_TYPES.m,
    //   recordId: masterId,
    // });

    const res = await localApi.getAttachments(masterId)
    setExistingAttachments(res);
  });

  //
  const doUpdateStatus = useLoadingBar(async (v) => {
    await localApi.updateWorkOrder(data?.m_MasterId, {
      [`${kind}_Status`]: v
    })

    await init(initWorkOrder?.m_WorkOrderNo);
  });

  const doUploadAttachment = useLoadingBar(async (_files) => {
    const { file, notes } = _files[0];
    await OrdersApi.uploadAttachmentsAsync(
      {
        recordId: data?.m_MasterId,
        prodTypeId: constants.PROD_TYPES.m,
        kind: "MASTER",
        uploadingFile: file,
        notes,
      },
      file,
    );

    await initAttachmentList(data?.m_MasterId);
  });

  const doDeleteAttachment = useLoadingBar(async (_file) => {
    await OrdersApi.deleteAttachmentsByIdAsync({
      guid: _file.id,
    });

    await initAttachmentList(data?.m_MasterId);
  });

  const doSave = useLoadingBar(async () => {



    await localApi.updateWorkOrder(data?.m_MasterId, data)
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
    onUpdateStatus: doUpdateStatus,
    onAnchor: handleAnchor,
    onUploadAttachment: doUploadAttachment,
    onDeleteAttachment: doDeleteAttachment,
    onHide: handleHide,
    onSave: doSave,
    windowItems,
    doorItems,
    glassItems,
    expands,
    setExpands,
    isEditable,
    uiOrderType
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
