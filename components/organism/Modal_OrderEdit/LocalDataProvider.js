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
import constants, { ORDER_STATUS } from "lib/constants";

import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";

export const LocalDataContext = createContext(null);

const STATUS = {
  m: "m_Status",
  w: "w_Status",
  d: "d_Status",
};

export const LocalDataProvider = ({
  children,
  initWorkOrder,
  kind = "m",
  facility,
  onSave,
  onHide,
  initIsEditable,
  ...props
}) => {
  const generalContext = useContext(GeneralContext);
  const [data, setData] = useState(null);

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
  const [uiShowMore, setUiShowMore] = useState(false);

  const [initData, setInitData] = useState(null);

  // UI purpose
  const [expands, setExpands] = useState({});

  useEffect(() => {
    if (initWorkOrder) {
      init(initWorkOrder);
    }
  }, [initWorkOrder]);

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
  };

  const init = async (initWorkOrderNo) => {
    setData(null);

    setIsEditable(initIsEditable);

    // fetch data
    const [res] = await Wrapper_OrdersApi.getWorkOrder(initWorkOrderNo);

    if (typeof res === "object") {
      // re-assemble data to easier to edit

      const { value } = res;

      const mergedData = {};
      mergedData = { ...value?.d, ...value?.m, ...value?.w };
      setData(mergedData);
      setInitData(JSON.parse(JSON.stringify(mergedData)));

      // if it has door or window or master info (should always has master. here just for consistency)
      setUiOrderType({
        m: !!value?.m,
        d: !!value?.d,
        w: !!value?.w,
      });

      await initItems(initWorkOrderNo);
      initAttachmentList(mergedData?.m_MasterId);
      initImageList(mergedData?.m_MasterId);

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
  };

  const initItems = useLoadingBar(async (initWorkOrderNo) => {
    const doorItems = await Wrapper_OrdersApi.getDoorItems(initWorkOrderNo);
    const windowItems = await Wrapper_OrdersApi.getWindowItems(initWorkOrderNo);
    setDoorItems(doorItems);
    setWindowItems(windowItems);
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
  const doUpdateStatus = useLoadingBar(async (v) => {
    await Wrapper_OrdersApi.updateWorkOrder(data?.m_MasterId, {
      [`${kind}_Status`]: v,
    });

    await init(initWorkOrder);
    onSave();
  });

  const doUpdateTransferredLocation = useLoadingBar(async () => {
    const m_TransferredLocation = data?.m_TransferredLocation
    await Wrapper_OrdersApi.updateWorkOrder(data?.m_MasterId, {
      m_TransferredLocation
    });

    await init(initWorkOrder);
    onSave();
  });

  const doUploadAttachment = useLoadingBar(async (_files) => {
    const { file, notes } = _files[0];
    await OrdersApi.uploadFileAsync({
      masterId: data?.m_MasterId,
      prodTypeId: constants.PROD_TYPES.m,
      uploadingFile: file,
      notes,
    });

    await initAttachmentList(data?.m_MasterId);
  });

  const doDeleteAttachment = useLoadingBar(async (_file) => {
    await OrdersApi.deleteUploadFileByIdAsync({
      id: _file.id,
    });

    await initAttachmentList(data?.m_MasterId);
  });

  const doUploadImage = useLoadingBar(async (_files) => {
    const { file, notes } = _files[0];
    await OrdersApi.uploadImageAsync({
      masterId: data?.m_MasterId,
      prodTypeId: constants.PROD_TYPES.m,
      uploadingFile: file,
      notes,
    });

    await initImageList(data?.m_MasterId);
  });

  const doDeleteImage = useLoadingBar(async (_file) => {
    await OrdersApi.deleteUploadImageByIdAsync({
      id: _file.id,
    });

    await initImageList(data?.m_MasterId);
  });

  const doSave = useLoadingBar(async () => {
    // identify changed data:
    const changedData = utils.findChanges(initData, data);

    // process customized
    if (changedData.w_ProductionStartDate) {
      changedData.w_ProductionEndDate = changedData.w_ProductionStartDate
    }

    if (changedData.d_ProductionStartDate) {
      changedData.d_ProductionEndDate = changedData.d_ProductionStartDate
    }

    await Wrapper_OrdersApi.updateWorkOrder(data?.m_MasterId, changedData);
    onSave();
  });

  const doUpdateWindowItem = useLoadingBar(async (Id, item) => {
    if (_.isEmpty(item)) return null;
    await Wrapper_OrdersApi.updateWindowItem(item?.MasterId, Id, item);
    await initItems(initWorkOrder);
  });

  const doUpdateDoorItem = useLoadingBar(async (Id, item) => {
    if (_.isEmpty(item)) return null;
    await Wrapper_OrdersApi.updateDoorItem(item?.MasterId, Id, item);
    await initItems(initWorkOrder);
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
    newImages,
    setNewImages,
    existingImages,
    setExistingImages,
    onChange: handleChange,
    onUpdateStatus: doUpdateStatus,
    onUpdateTransferredLocation: doUpdateTransferredLocation ,
    onAnchor: handleAnchor,
    onUploadAttachment: doUploadAttachment,
    onDeleteAttachment: doDeleteAttachment,
    onUploadImage: doUploadImage,
    onDeleteImage: doDeleteImage,
    onUpdateWindowItem: doUpdateWindowItem,
    onUpdateDoorItem: doUpdateDoorItem,
    onHide: handleHide,
    onSave: doSave,

    windowItems,
    doorItems,
    glassItems,
    expands,
    setExpands,
    isEditable,
    uiOrderType,
    uiShowMore, 
    setUiShowMore,
    glassTotal,
    uIstatusObj,
    initData
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
