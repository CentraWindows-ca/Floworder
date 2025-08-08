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
import External_WebCalApi from "lib/api/External_WebCalApi";

import useLoadingBar from "lib/hooks/useLoadingBar";
import constants, { ORDER_STATUS, ORDER_TRANSFER_FIELDS } from "lib/constants";
import { uiWoFieldEditGroupMapping } from "lib/constants/constants_labelMapping";
import { getOrderKind } from "lib/utils";

import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";
import {
  checkEditableById,
  checkEditableByGroup,
  checkAddonFieldById,
  treateGlassItems,
} from "./Com";
import useLocalValidation from "./hooks/useLocalValidation";
import useAddonFields from "./hooks/useAddonFields";
import { TEMPORARY_DISPLAY_FILTER } from "../OrderList/_constants";

export const LocalDataContext = createContext(null);

const STATUS = {
  m: "m_Status",
  w: "w_Status",
  d: "d_Status",
};

export const LocalDataProvider = ({
  children,
  initMasterId,

  // the tab we are open from. we need some logic rely on the path they open the modal
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
  const { toast, permissions, dictionary } = generalContext;
  const { requestData } = useInterrupt();
  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(false); // hide the entire modal
  const [isSaving, setIsSaving] = useState(false); // still show modal, but disable save button

  const [isEditable, setIsEditable] = useState(false);
  const [editedGroup, setEditedGroup] = useState({});

  const [LbrBreakDowns, setLbrBreakDowns] = useState([]);

  // addon
  const [addonGroup, setAddonGroup] = useState({});
  const [isInAddonGroup, setIsInAddonGroup] = useState(false);

  // only display. upload/delete will directly call function
  const [existingAttachments, setExistingAttachments] = useState(null);
  const [existingImages, setExistingImages] = useState(null);

  const [newAttachments, setNewAttachments] = useState(null);
  const [newImages, setNewImages] = useState(null);

  const [windowItems, setWindowItems] = useState(null);
  const [doorItems, setDoorItems] = useState(null);
  const [returnTrips, setReturnTrips] = useState(null);
  const [glassItems, setGlassItems] = useState(null);

  const [uiOrderType, setUiOrderType] = useState({});
  const [uiShowMore, setUiShowMore] = useState(true);
  const [validationResult, setValidationResult] = useState(null);

  const [initData, setInitData] = useState(null);
  const [initDataItems, setInitDataItems] = useState(null);
  const [initDataReturnTrips, setInitDataReturnTrips] = useState(null);

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

    const _groups = {};
    _.keys(uiWoFieldEditGroupMapping)?.map((group) => {
      if (uiWoFieldEditGroupMapping[group][k]) _groups[group] = true;
    });

    setEditedGroup((prev) => ({
      ...prev,
      ..._groups,
    }));

    // remove validation of key
    setValidationResult((prev) => {
      try {
        const _v = JSON.parse(JSON.stringify(prev));
        _.unset(_v, k);
        return _v;
      } catch (error) {
        return prev;
      }
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
    if (!_.isEmpty(editedGroup)) {
      if (
        !window.confirm(
          "You have unsaved changes. Are you sure you want to exit without saving?",
        )
      ) {
        return null;
      }
    }
    clear();
    onHide();
  };

  // ====== api calls
  const clear = () => {
    setData(null);
    setDoorItems(null);
    setWindowItems(null);
    setReturnTrips(null);
    setExistingAttachments(null);
    setNewAttachments(null);
    setExistingImages(null);
    setNewImages(null);
    setGlassItems(null);
    setInitData(null);
    setInitDataItems(null);
    setInitDataReturnTrips(null);
    setEditedGroup({});
    setValidationResult(null);
  };

  const doInit = async (initMasterId) => {
    setIsLoading(true);
    setData(null);
    setEditedGroup({});
    setIsEditable(initIsEditable);
    setValidationResult(null);

    const mergedData = await doInitWo(initMasterId);

    await doInitAddon(initMasterId);

    // TODO: ADDON - get addon parent

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
      await initReturnTrips(mergedData?.m_MasterId);

      // skip if error out
      initGlassItems(mergedData);
    }

    setIsLoading(false);
  };

  const doInitWo = useLoadingBar(
    async (initMasterId, stillEditingData = {}) => {
      setEditedGroup({});
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
        setData({ ...mergedData, ...stillEditingData });

        // if we need to keep saveButton available for groups
        const _editingGroup = {};
        _.keys(uiWoFieldEditGroupMapping)?.map((group) => {
          _.keys(stillEditingData)?.map((k) => {
            if (uiWoFieldEditGroupMapping[group]?.[k]) {
              _editingGroup[group] = true;
            }
          });
        });
        setEditedGroup(_editingGroup);

        setUiOrderType({
          m: !!value?.m,
          d: !!value?.d,
          w: !!value?.w,
        });

        // search lbr breakdowns
        const _lbrs = [];
        _.keys(mergedData)?.map((k) => {
          // matches "<n>__"
          if (/^[a-zA-Z]__.*$/.test(k) && k?.endsWith("Min")) {
            const lbr_title = k.split("__")?.[1]?.replace("Min", "");
            const lbr_qty = mergedData[k?.replace("Min", "")];
            const lbr_min = mergedData[k];

            _lbrs.push({
              title: lbr_title,
              qty: lbr_qty,
              lbr: lbr_min,
            });
          }
        });
        setLbrBreakDowns(_lbrs);
      }

      return mergedData;
    },
  );

  const doInitAddon = useLoadingBar(async (initMasterId) => {
    const _addonGroup = await OrdersApi.getAddsOnGroupByMasterId({
      masterId: initMasterId,
    });

    const parent = _addonGroup?.find((a) => a.isParent);
    const addons = _addonGroup?.filter((a) => !a.isParent);

    // if there is only a parent
    const _isInAddonGroup = !_.isEmpty(addons);
    setAddonGroup({
      parent,
      addons
    });
    // setIsInAddonGroup(_isInAddonGroup);
    setIsInAddonGroup(true);
  });

  const initItems = useLoadingBar(async (initMasterId) => {
    // NOTE: if user open from window tab, eventhough its door order, we dont show doors
    let windowItems = [];

    windowItems = await Wrapper_OrdersApi.getWindowItems(initMasterId);
    windowItems = windowItems.filter(
      (a) => !TEMPORARY_DISPLAY_FILTER[a.System],
    );
    setWindowItems(_.orderBy(windowItems, ["Item"]));

    let doorItems = [];

    doorItems = await Wrapper_OrdersApi.getDoorItems(initMasterId);
    doorItems = doorItems.filter((a) => !TEMPORARY_DISPLAY_FILTER[a.System]);
    setDoorItems(_.orderBy(doorItems, ["Item"]));

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

  const initGlassItems = async (mergedData) => {
    const resGlassItems = await GlassApi.getGlassItems(
      mergedData.m_WorkOrderNo,
      mergedData.m_DBSource,
    );

    if (resGlassItems) {
      setGlassItems(treateGlassItems(resGlassItems));
    }
  };

  const initReturnTrips = useLoadingBar(async (initMasterId) => {
    let _returnTrips = await OrdersApi.getProductionsReturnTripByID({
      MasterId: initMasterId,
    });
    _returnTrips = _returnTrips?.map((a) => ({
      ...a,
      returnTripDate: utils.formatDateForMorganLegacy(a.returnTripDate),
    }));

    _returnTrips = _.orderBy(_returnTrips, ["returnTripDate"], ["ASC"]);

    setReturnTrips(_returnTrips);
    setInitDataReturnTrips(JSON.parse(JSON.stringify(_returnTrips)));
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
          masterId: data?.m_MasterId,
          workOrderNo: data?.m_WorkOrderNo,
        },
        initData,
      );
    } else {
      await WM2CWProdApi.updateOnly_BC_WMByWorkOrderAsync(
        null,
        {
          masterId: data?.m_MasterId,
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

  const doDeleteReturnTrip = useLoadingBar(async (_rt) => {
    await OrdersApi.hardDeleteProductionsReturnTrip({}, _rt, initData);
    await initReturnTrips(data?.m_MasterId);
  });
  const doAddReturnTrip = useLoadingBar(async (_rt) => {
    await OrdersApi.addProductionsReturnTrip({}, _rt, initData);
    await initReturnTrips(data?.m_MasterId);
  });
  const doEditReturnTrip = useLoadingBar(async (_rt) => {
    await OrdersApi.updateProductionsReturnTrip(
      {},
      _rt,
      initData,
      initDataReturnTrips?.find((a) => a.id === _rt?.id),
    );
    await initReturnTrips(data?.m_MasterId);
  });

  const doSave = useLoadingBar(
    async (group) => {
      const validateResult = onValidate({ initData, data, kind, uiOrderType });
      if (!_.isEmpty(validateResult)) {
        const _errorMessages = _.uniq(_.values(validateResult));
        toast(
          <div>
            {_errorMessages?.map((msg) => (
              <div key={`error_${msg}`} className="text-red-500">
                {msg}
              </div>
            ))}
          </div>,
          { type: "warning" },
        );
        return;
      }

      setIsSaving(true);
      // identify changed data:
      const changedData = utils.findChanges(initData, data);

      // process customized
      if (changedData.w_ProductionStartDate) {
        changedData.w_ProductionEndDate = changedData.w_ProductionStartDate;
      }

      if (changedData.d_ProductionStartDate) {
        changedData.d_ProductionEndDate = changedData.d_ProductionStartDate;
      }

      let stillEditingData = {};
      if (group && uiWoFieldEditGroupMapping?.[group]) {
        // only save group fields
        const allFieldsFromGroup = uiWoFieldEditGroupMapping[group];
        _.keys(changedData)?.map((k) => {
          if (!allFieldsFromGroup[k]) {
            stillEditingData[k] = changedData[k];
          }
        });
      }

      await Wrapper_OrdersApi.updateWorkOrder(data, changedData, initData);
      toast("Work order saved", { type: "success" });
      await doInitWo(initMasterId, stillEditingData);
      onSave();
    },
    () => setIsSaving(false),
  );

  const doBatchUpdateItems = useLoadingBar(async (updateList, kind) => {
    if (_.isEmpty(updateList)) return null;
    await Wrapper_OrdersApi.updateItemList(
      data?.m_MasterId,
      updateList,
      kind,
      initData,
      initDataItems,
    );

    await External_WebCalApi.bulkUpdateItemTrackingList(
      updateList,
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
      let _pass = isEditable;
      if (id) {
        _pass = _pass && checkEditableById({ id, data, permissions, initKind });
      }
      if (group) {
        _pass =
          _pass && checkEditableByGroup({ group, data, permissions, initKind });
      }

      // if its addon workorder, check if field is addonField
      // logic to check if split addon
      const { isAddonEditable } = checkAddonField(params) || {};
      _pass = _pass && isAddonEditable;

      return _pass;
    },
    [
      isEditable,
      initMasterId,
      data?.m_Status,
      data?.w_Status,
      data?.d_Status,
      permissions,
      dictionary,
    ],
  );

  const checkEditableForSectionSaveButton = useCallback(
    (params = {}) => {
      const { group } = params;
      return (
        isEditable &&
        checkEditableByGroup({ group, data, permissions, initKind })
      );
    },
    [isEditable, initMasterId, data?.m_Status, permissions],
  );

  // called by each single input
  const checkAddonField = useCallback(
    (params = {}) => {
      let result = {
        isAddonEditable: true,
        isSyncParent: false,
      };
      if (!isInAddonGroup) {
        return result;
      }
      // if split(dettached)
      const { id } = params;
      if (id) {
        const { workOrderFields } = dictionary;
        return checkAddonFieldById({ id, data, workOrderFields, initKind });
      }
      return result;
    },
    [
      isEditable,
      initMasterId,
      data?.m_Status,
      data?.w_Status,
      data?.d_Status,
      dictionary?.workOrderFields,
      isInAddonGroup,
    ],
  );

  const { onValidate } = useLocalValidation({
    validationResult,
    setValidationResult,
    checkEditable,
  });

  const context = {
    ...generalContext,
    ...props,
    isLoading,
    isSaving,
    initMasterId,
    data,
    kind,
    initKind,
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
    setReturnTrips,
    onChange: handleChange,
    onUpdateStatus: doUpdateStatus,
    onUpdateTransferredLocation: doUpdateTransferredLocation,
    onAnchor: handleAnchor,
    onUploadAttachment: doUploadAttachment,
    onDeleteAttachment: doDeleteAttachment,
    onUploadImage: doUploadImage,
    onDeleteImage: doDeleteImage,
    onDeleteReturnTrip: doDeleteReturnTrip,
    onAddReturnTrip: doAddReturnTrip,
    onEditReturnTrip: doEditReturnTrip,
    onBatchUpdateItems: doBatchUpdateItems,
    onHide: handleHide,
    onSave: doSave,
    onRestore: doRestore,
    onGetWindowMaker: doGetWindowMaker,
    editedGroup,
    setEditedGroup,

    LbrBreakDowns,
    windowItems,
    doorItems,
    returnTrips,
    glassItems,
    expands,
    setExpands,
    isEditable,
    setIsEditable,
    checkEditable,
    checkEditableForSectionSaveButton,
    checkAddonField,
    uiOrderType,
    uiShowMore,
    setUiShowMore,
    glassTotal,
    uIstatusObj,
    initData,
    isDeleted: initData?.m_IsActive === false,
    validationResult,
    addonGroup,
    isInAddonGroup,
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
