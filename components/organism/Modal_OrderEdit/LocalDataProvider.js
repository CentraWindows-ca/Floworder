import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import _ from "lodash";
import { useRouter } from "next/router";
import { GeneralContext } from "lib/provider/GeneralProvider";
import { useInterrupt } from "lib/provider/InterruptProvider";

import utils from "lib/utils";

import OrdersApi from "lib/api/OrdersApi";
import WM2CWProdApi from "lib/api/WM2CWProdApi";
import GlassApi from "lib/api/GlassApi";

import useLoadingBar from "lib/hooks/useLoadingBar";
import constants, { ORDER_STATUS, ORDER_TRANSFER_FIELDS } from "lib/constants";
import { uiWoFieldEditGroupMapping } from "lib/constants/constants_labelMapping";
import { getOrderKind } from "lib/utils";

import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";
import { checkEditableById, checkEditableByGroup } from "./Com";

export const LocalDataContext = createContext(null);

const STATUS = {
  m: "m_Status",
  w: "w_Status",
  d: "d_Status",
};

export const LocalDataProvider = ({
  children,
  initMasterId,
  kind: initKind,
  facility,
  onSave,
  onHide,
  onRestore,
  initIsEditable,
  isDeleted,
  ...props
}) => {
  const generalContext = useContext(GeneralContext);
  const { toast, permissions } = generalContext;
  const { requestData } = useInterrupt();
  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(false); // hide the entire modal
  const [isSaving, setIsSaving] = useState(false) // still show modal, but disable save button

  const [isEditable, setIsEditable] = useState(false);

  // only display. upload/delete will directly call function
  const [existingAttachments, setExistingAttachments] = useState(null);
  const [existingImages, setExistingImages] = useState(null);

  const [newAttachments, setNewAttachments] = useState(null);
  const [newImages, setNewImages] = useState(null);

  const [windowItems, setWindowItems] = useState(null);
  const [doorItems, setDoorItems] = useState(null);
  const [glassItems, setGlassItems] = useState(null);

  const [uiOrderType, setUiOrderType] = useState({});
  const [uiShowMore, setUiShowMore] = useState(true);

  const [initData, setInitData] = useState(null);
  const [initDataItems, setInitDataItems] = useState(null);

  const [kind, setKind] = useState(initKind || "m");

  // UI purpose
  const [expands, setExpands] = useState({});

  useEffect(() => {
    if (initMasterId) {
      doInit(initMasterId);
    }
  }, [initMasterId, isDeleted]);

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
    setExistingImages(null);
    setNewImages(null);
    setGlassItems(null);
    setInitData(null);
    setInitDataItems(null);
  };

  const doInit = async (initMasterId) => {
    setIsLoading(true);
    setData(null);
    setIsEditable(initIsEditable);

    const mergedData = await doInitWo(initMasterId);

    if (mergedData) {
      if (initKind === "w" || getOrderKind(mergedData) === "w") {
        setKind("w");
      } else if (initKind === "d" || getOrderKind(mergedData) === "d") {
        setKind("d");
      } else {
        setKind("m");
      }

      await initItems(initMasterId);
      initAttachmentList(mergedData?.m_MasterId);
      initImageList(mergedData?.m_MasterId);

      const resGlassItems = await GlassApi.getGlassItems(
        mergedData.m_WorkOrderNo,
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

    setIsLoading(false);
  };

  const doInitWo = useLoadingBar(async (initMasterId, stillEditingData = {}) => {
    const [res] = await Wrapper_OrdersApi.getWorkOrder(
      initMasterId,
      isDeleted ? 0 : 1,
    );
    let mergedData = {};
    if (typeof res === "object") {
      // re-assemble data to easier to edit

      const { value } = res;

      mergedData = { ...value?.d, ...value?.m, ...value?.w };

      // set init fields from newest wo
      setInitData(JSON.parse(JSON.stringify(mergedData)));

      // if use has pending edits
      setData({...mergedData, ...stillEditingData});

      // save button for groups
      
      setUiOrderType({
        m: !!value?.m,
        d: !!value?.d,
        w: !!value?.w,
      });
    }

    return mergedData;
  });

  const initItems = useLoadingBar(async (initMasterId) => {
    const doorItems = await Wrapper_OrdersApi.getDoorItems(initMasterId);
    const windowItems = await Wrapper_OrdersApi.getWindowItems(initMasterId);

    setDoorItems(_.orderBy(doorItems, ["Item"]));
    setWindowItems(_.orderBy(windowItems, ["Item"]));

    setInitDataItems([
      ...doorItems?.map((a) => ({
        ...a,
        itemType: "di",
      })),
      ...windowItems?.map((a) => ({
        ...a,
        itemType: "wi",
      })),
    ]);
  });

  const initAttachmentList = useLoadingBar(async (masterId) => {
    // const res = await Wrapper_OrdersApi.getFiles(masterId)

    const res = await OrdersApi.getUploadFileByRecordIdAsync({
      MasterId: masterId,
      ProdTypeId: constants.PROD_TYPES.m,
    });

    setExistingAttachments(res);
  });

  const initImageList = useLoadingBar(async (masterId) => {
    // const res = await Wrapper_OrdersApi.getImages(masterId)

    const res = await OrdersApi.getUploadImageByRecordIdAsync({
      MasterId: masterId,
      ProdTypeId: constants.PROD_TYPES.m,
    });
    setExistingImages(res);
  });

  //
  const doUpdateStatus = async (newStatus, _kind) => {
    const payload = await getStatusPayload(data, newStatus, _kind);
    if (payload === null) return null;
    await doMove(payload);

    toast("Status updated", { type: "success" });
    await doInit(initMasterId);
    onSave();
  };

  const getStatusPayload = async (data, newStatus, _kind) => {
    const { m_WorkOrderNo, m_MasterId } = data;
    const payload = {
      m_WorkOrderNo,
      m_MasterId,
      newStatus,
    };
    const updatingStatusField = `${_kind}_Status`;
    payload["oldStatus"] = data[updatingStatusField];
    payload["isWindow"] = _kind === "w";

    // different target has different required fields
    const missingFields = ORDER_TRANSFER_FIELDS?.[newStatus] || {};

    if (!_.isEmpty(missingFields)) {
      const moreFields = await requestData(missingFields);
      // cancel
      if (moreFields === null) return null;
      payload = { ...payload, ...moreFields };
    }
    return payload;
  };

  const doMove = useLoadingBar(async (payload) => {
    await OrdersApi.updateWorkOrderStatus(null, payload, initData);
  });

  const doRestore = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to delete [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    await OrdersApi.undoSoftDeleteProductionsWorkOrder(null, null, initData);
    // change url string to delete isDelete

    toast("Work order restored", { type: "success" });
    onRestore();
  });

  const doGetWindowMaker = useLoadingBar(async () => {
    if (
      !window.confirm(
        `Are you sure to get WindowMaker data for [${data?.m_WorkOrderNo}]?`,
      )
    ) {
      return null;
    }

    const dbSource = data.m_DBSource;
    // fetch from WM
    if (dbSource === "WM_AB") {
      await WM2CWProdApi.updateOnly_AB_WMByWorkOrderAsync(
        null,
        {
          workOrderNo: data?.m_WorkOrderNo,
        },
        initData,
      );
    } else {
      await WM2CWProdApi.updateOnly_BC_WMByWorkOrderAsync(
        null,
        {
          workOrderNo: data?.m_WorkOrderNo,
        },
        initData,
      );
    }

    await doInit(initMasterId);
    toast("Work order updated from WindowMaker", { type: "success" });
    onSave();
  });

  const doUpdateTransferredLocation = useLoadingBar(async () => {
    const m_TransferredLocation = data?.m_TransferredLocation;
    await Wrapper_OrdersApi.updateWorkOrder(
      data,
      {
        m_TransferredLocation,
      },
      initData,
    );

    await doInit(initMasterId);
    toast("Transferred location saved", { type: "success" });
    onSave();
  });

  const doUploadAttachment = useLoadingBar(async (_files) => {
    const awaitList = _files?.map((_f) => {
      const { file, notes } = _f;
      return OrdersApi.uploadFileAsync(
        null,
        {
          masterId: data?.m_MasterId,
          prodTypeId: constants.PROD_TYPES.m,
          uploadingFile: file,
          notes,
        },
        initData,
      );
    });

    await Promise.all(awaitList);
    toast("Attachment updated", { type: "success" });
    await initAttachmentList(data?.m_MasterId);
  });

  const doDeleteAttachment = useLoadingBar(async (_file) => {
    if (!confirm(`Delete ${_file.fileName}?`)) return null;
    await OrdersApi.deleteUploadFileByIdAsync(
      {
        id: _file.id,
        masterId: data?.m_MasterId,
      },
      null,
      initData,
    );

    toast("File deleted", { type: "success" });
    await initAttachmentList(data?.m_MasterId);
  });

  const doUploadImage = useLoadingBar(async (_files) => {
    const awaitList = _files?.map((_f) => {
      const { file, notes } = _f;
      return OrdersApi.uploadImageAsync(
        null,
        {
          masterId: data?.m_MasterId,
          prodTypeId: constants.PROD_TYPES.m,
          uploadingFile: file,
          notes,
        },
        initData,
      );
    });

    await Promise.all(awaitList);

    toast("Image updated", { type: "success" });
    await initImageList(data?.m_MasterId);
  });

  const doDeleteImage = useLoadingBar(async (_file) => {
    if (!confirm(`Delete ${_file.fileName}?`)) return null;
    await OrdersApi.deleteUploadImageByIdAsync(
      {
        id: _file.id,
        masterId: data?.m_MasterId,
      },
      null,
      initData,
    );

    toast("Image deleted", { type: "success" });
    await initImageList(data?.m_MasterId);
  });

  const doSave = useLoadingBar(async (group) => {
    setIsSaving(true)
    // identify changed data:
    const changedData = utils.findChanges(initData, data);

    // process customized
    if (changedData.w_ProductionStartDate) {
      changedData.w_ProductionEndDate = changedData.w_ProductionStartDate;
    }

    if (changedData.d_ProductionStartDate) {
      changedData.d_ProductionEndDate = changedData.d_ProductionStartDate;
    }

    let stillEditingData = {}
    if (group && uiWoFieldEditGroupMapping?.[group]) {
      // only save group fields
      const allFieldsFromGroup = uiWoFieldEditGroupMapping[group]
      _.keys(changedData)?.map(k => {
        if(!allFieldsFromGroup[k]) {
          stillEditingData[k] = changedData[k]
        }
      })      
    }

    await Wrapper_OrdersApi.updateWorkOrder(data, changedData, initData);
    toast("Work order saved", { type: "success" });
    await doInitWo(initMasterId, stillEditingData);
    onSave();
    setIsSaving(false)
  });

  const doBatchUpdateItems = useLoadingBar(async (updateList, kind) => {
    if (_.isEmpty(updateList)) return null;
    await Wrapper_OrdersApi.updateItemList(
      data?.m_MasterId,
      updateList,
      kind,
      initData,
      initDataItems,
    );
    toast("Items saved", { type: "success" });
    await initItems(initMasterId);
    return;
  });

  // calculations
  const glassTotal =
    glassItems?.reduce(
      (prev, curr) => {
        return {
          qty: prev.qty + parseInt(curr.qty) || 0,
          glassQty: prev.glassQty + parseInt(curr.glassQty) || 0,
        };
      },
      {
        qty: 0,
        glassQty: 0,
      },
    ) || {};

  const uIstatusObj =
    ORDER_STATUS?.find((a) => a.key === data?.[STATUS[kind]]) || {};

  const checkEditable = useCallback(
    (params = {}) => {
      const { id, group } = params;
      return isEditable && checkEditableById({ id, group, data, permissions });
    },
    [isEditable, initMasterId, data?.m_Status, permissions],
  );
  
  const checkEditableForSave = useCallback(
    (params = {}) => {
      const { group } = params;
      return isEditable && checkEditableByGroup({group, data, permissions})
    },
    [isEditable, initMasterId, data?.m_Status, permissions],
  );

  const context = {
    ...generalContext,
    ...props,
    isLoading,
    isSaving,
    initMasterId,
    data,
    kind,
    facility,
    setData,
    newAttachments,
    setNewAttachments,
    existingAttachments,
    setExistingAttachments,
    newImages,
    setNewImages,
    existingImages,
    setExistingImages,
    onChange: handleChange,
    onUpdateStatus: doUpdateStatus,
    onUpdateTransferredLocation: doUpdateTransferredLocation,
    onAnchor: handleAnchor,
    onUploadAttachment: doUploadAttachment,
    onDeleteAttachment: doDeleteAttachment,
    onUploadImage: doUploadImage,
    onDeleteImage: doDeleteImage,
    onBatchUpdateItems: doBatchUpdateItems,
    onHide: handleHide,
    onSave: doSave,
    onRestore: doRestore,
    onGetWindowMaker: doGetWindowMaker,

    windowItems,
    doorItems,
    glassItems,
    expands,
    setExpands,
    isEditable,
    setIsEditable,
    checkEditable,
    checkEditableForSave,
    uiOrderType,
    uiShowMore,
    setUiShowMore,
    glassTotal,
    uIstatusObj,
    initData,
    isDeleted: initData?.m_IsActive === false,
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
