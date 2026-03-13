import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
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
import External_ServiceApi from "lib/api/External_ServiceApi";

import useLoadingBar from "lib/hooks/useLoadingBar";
import constants, {
  ADDON_STATUS,
  ORDER_STATUS,
  ORDER_TRANSFER_FIELDS,
  SOURCE_OF_UI,
} from "lib/constants";
import {
  getFieldCode,
  parseFieldsByfieldCode,
  uiWoFieldEditGroupMapping,
} from "lib/constants/production_constants_labelMapping";
import { getOrderKind } from "lib/utils";

import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";

import {
  checkEditableByFieldCode,
  checkEditableByGroup,
  checkAddOnFieldById,
  treateGlassItems,
} from "./Com";
import useLocalValidation from "./hooks/useLocalValidation";
import { TEMPORARY_DISPLAY_FILTER } from "../Production_PrimaryList/_constants";
import { getVConfig } from "./hooks/vconfig";

const LocalDataContext = createContext(null);
const LocalDataContext_items = createContext(null);
const LocalDataContext_data = createContext(null);
export {
  GeneralContext,
  LocalDataContext,
  LocalDataContext_data,
  LocalDataContext_items,
};

const STATUS = {
  m: "m_Status",
  w: "m_WinStatus",
  d: "m_DoorStatus",
};

// NOTE: UI toggles originally for embed iframe that doesnt need that many functionalities
const DISPLAY_SECTIONS = {
  addons: true,
  basic: true,
  summary: true,
  notes: true,
  returnTrips: true,
  images: true,
  files: true,
  productionItems: true,
  glassItems: true,
  history: true,
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
  isPassToIframe = false,
  isUiAllowHeader = true,
  isUiAllowEdit = true,
  sourceOfUI = SOURCE_OF_UI.modal_production,
  display_sections,
  ...props
}) => {
  const generalContext = useContext(GeneralContext);

  // iframe data passing purpose
  const latestDataRef = useRef(null);
  const initDataRef = useRef(null);

  const { toast, permissions, dictionary } = generalContext;
  const { requestData } = useInterrupt();
  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(false); // hide the entire modal
  const [isSaving, setIsSaving] = useState(false); // still show modal, but disable save button

  const [isEditable, setIsEditable] = useState(false);
  const [editedGroup, setEditedGroup] = useState({});

  const [LbrBreakDowns, setLbrBreakDowns] = useState([]);

  // addon
  const [addonGroup, setAddOnGroup] = useState({});
  const isInAddOnGroup = !_.isEmpty(addonGroup?.addons);

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
  const [initWithOriginalStructure, setInitWithOriginalStructure] =
    useState(null);
  const [initDataItems, setInitDataItems] = useState(null);
  const [initDataReturnTrips, setInitDataReturnTrips] = useState(null);
  const [initDataSiteLockout, setInitDataSiteLockout] = useState(null);
  const [initDataService, setInitDataService] = useState(null);

  const [kind, setKind] = useState(initKind || "m");

  // UI purpose
  const [expands, setExpands] = useState({});

  // Iframe purpose start =======
  useEffect(() => {
    let handleMessage = () => {};
    if (isPassToIframe) {
      handleMessage = (event) => {
        if (event.data?.type === "GET_DATA") {
          console.log("event from outside", event);
          window.parent.postMessage(
            {
              type: "DATA",
              payload: {
                fieldConfig: getVConfig(initDataRef?.current),
                initData: initDataRef?.current,
                data: latestDataRef?.current,
              },
            },
            "*",
          );
        }
      };

      window.addEventListener("message", handleMessage);
    }

    return () => {
      if (isPassToIframe) {
        window.removeEventListener("message", handleMessage);
      }
    };
  }, []);

  useEffect(() => {
    if (isPassToIframe) {
      latestDataRef.current = data;
    }
  }, [data]);
  useEffect(() => {
    if (isPassToIframe) {
      initDataRef.current = initData;
    }
  }, [initData]);
  // Iframe purpose end =======

  // Initiate
  useEffect(() => {
    if (initMasterId) {
      doInit(initMasterId);
    }
  }, [initMasterId, isDeleted]);

  const handleChange = (v, field) => {
    const fieldCode = getFieldCode(field);
    setData((prev) => {
      const _newV = {...prev};
      _.set(_newV, field, v);
      return _newV;
    });

    const _groups = {};
    _.keys(uiWoFieldEditGroupMapping)?.map((group) => {
      if (uiWoFieldEditGroupMapping[group][fieldCode]) _groups[group] = true;
    });

    setEditedGroup((prev) => ({
      ...prev,
      ..._groups,
    }));

    // remove validation of key
    setValidationResult((prev) => {
      try {
        const _v = {...prev}
        _.unset(_v, field);
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
    setEditedGroup({});
    setValidationResult(null);
    setAddOnGroup({});

    setInitData(null);
    setInitWithOriginalStructure(null);
    setInitDataItems(null);
    setInitDataReturnTrips(null);
    setInitDataSiteLockout(null);
    setInitDataService(null);
  };

  const doInit = async (initMasterId) => {
    setIsLoading(true);
    setData(null);
    setEditedGroup({});
    setIsEditable(initIsEditable);
    setValidationResult(null);
    setAddOnGroup({});

    const mergedData = await doInitWo(initMasterId);
    await doInitAddOn(initMasterId);

    if (mergedData) {
      if (initKind === "w" || getOrderKind(mergedData) === "w") {
        setKind("w");
      } else if (initKind === "d" || getOrderKind(mergedData) === "d") {
        setKind("d");
      } else {
        setKind("m");
      }

      // === no async for first load ===
      initItems(initMasterId);
      initAttachmentList(initMasterId);
      initImageList(initMasterId);
      initReturnTrips(initMasterId);
      // === no async for first load===

      // === no async aways ===
      // skip if error out
      doInitGlassItems_NoAsync(mergedData);
      // === no async aways ===

      // because its in main section, we share the loading
      await doInitSiteLockOut_NotAsync(initMasterId);
      await doInitService_NotAsync(initMasterId);
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
        setInitWithOriginalStructure(value);

        // m_, w_1, w_2, ...
        mergedData = _.assign({}, ..._.values(value));
        // set init fields from newest wo
        setInitData(JSON.parse(JSON.stringify(mergedData)));

        // if use has pending edits
        setData({ ...mergedData, ...stillEditingData });

        // if we need to keep saveButton available for groups
        const _editingGroup = {};
        _.keys(uiWoFieldEditGroupMapping)?.map((group) => {
          _.keys(stillEditingData)?.map((field) => {
            const fieldCode = getFieldCode(field);
            if (uiWoFieldEditGroupMapping[group]?.[fieldCode]) {
              _editingGroup[group] = true;
            }
          });
        });
        setEditedGroup(_editingGroup);

        setUiOrderType({
          m: !!value?.m,
          d: !!mergedData?.m_DoorStatus,
          w: !!mergedData?.m_WinStatus,
        });

        // search lbr breakdowns
        const _lbrs = [];

        _.keys(value)?.forEach((kindFac) => {
          const _kindFacObj = value[kindFac];
          const [kind, facilityCode] = kindFac;
          if (!_.isPlainObject(_kindFacObj)) return;

          _.keys(_kindFacObj)?.forEach((field) => {
            const prefix = `${kindFac}__`;
            if (!field.startsWith(prefix) || !field.endsWith("Min")) return;

            _lbrs.push({
              title: field.slice(prefix.length, -3),
              qty: _kindFacObj[field.slice(0, -3)],
              lbr: _kindFacObj[field],
              facility: constants.FACILITY_FROM_CODE[facilityCode] || "",
            });
          });
        });
        const mergedLbrs = _(_lbrs)
          .groupBy("title")
          .map((items, title) => ({
            title,
            qty: _.sumBy(items, (a) => a.qty || 0),
            lbr: _.sumBy(items, (a) => a.lbr || 0),
          }))
          .value();
        setLbrBreakDowns(mergedLbrs);
      }

      return mergedData;
    },
  );

  const doInitAddOn = useLoadingBar(async (initMasterId) => {
    const _addonGroup = await OrdersApi.getAddsOnGroupByMasterId({
      masterId: initMasterId,
    });

    const parent = _addonGroup?.find((a) => a.isParent);
    const addons = _addonGroup
      ?.map((a) => {
        const { m_AddOnLinked } = a;
        return {
          ...a,
          isUnlinked: m_AddOnLinked === ADDON_STATUS.detached,
        };
      })
      ?.filter((a) => !a.isParent);

    // if there is only a parent
    setAddOnGroup({
      parent,
      addons,
    });
  });

  const doInitSiteLockOut_NotAsync = useLoadingBar(async (initMasterId) => {
    const _siteLockOut = await External_ServiceApi.getSiteLockoutByMasterId({
      masterId: initMasterId,
    });

    // if there is only a parent
    setInitDataSiteLockout(_siteLockOut);
  });

  const doInitService_NotAsync = useLoadingBar(async (initMasterId) => {
    if (constants.DEV_HOLDING_FEATURES.v20251127_service) return;
    const _service = await External_ServiceApi.getServicesByMasterId({
      masterId: initMasterId,
    });

    if (!_.isEmpty(_service)) {
      setInitDataService(_service);
    }
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

  const doInitGlassItems_NoAsync = async (mergedData) => {
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
    const res = await OrdersApi.getUploadFileByRecordIdAsync({
      MasterId: masterId,
      ProdTypeId: constants.PROD_TYPES.m,
    });

    setExistingAttachments(res);
  });

  const initImageList = useLoadingBar(async (masterId) => {
    const res = await OrdersApi.getUploadImageByRecordIdAsync({
      MasterId: masterId,
      ProdTypeId: constants.PROD_TYPES.m,
    });
    setExistingImages(res);
  });

  //
  const doUpdateStatus = async (newStatus, _kind, facilityCode) => {
    const payload = await getStatusPayload(data, newStatus, _kind, facilityCode);
    if (payload === null) return null;
    await doMove(payload);

    toast("Status updated", { type: "success" });
    await doInit(initMasterId);
    onSave();
  };

  const getStatusPayload = async (data, newStatus, _kind, facilityCode) => {
    const { m_WorkOrderNo, m_MasterId } = data;
    const payload = {
      m_WorkOrderNo,
      m_MasterId,
      newStatus,
    };
    const updatingStatusField = `${_kind}_${facilityCode}_Status`;
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
  const doGetWindowMaker_comment = useLoadingBar(async () => {
    // fetch from WM
    const _res = await WM2CWProdApi.fetchWMComment(null, {
      masterId: data?.m_MasterId,
    });

    if (_res?.comment) {
      const v = _res?.comment;
      const k = "m_Comment_1";
      handleChange(v, k);
    } else {
      toast("Comment Not found", { type: "warning" });
    }
  });
  const doGetWindowMaker_batchNo = useLoadingBar(async (kind = "w") => {
    // fetch from WM
    const _res = await WM2CWProdApi.fetchWMBatchNos(null, {
      masterId: data?.m_MasterId,
      kind, // w,d
    });

    if (_res?.batchNo) {
      const v = _res?.batchNo;
      const k = `${kind}_BatchNo`;
      handleChange(v, k);
    } else {
      toast("Batch No. Not found", { type: "warning" });
    }
  });

  const doUpdateTransferredLocation = useLoadingBar(async () => {
    const m_TransferredLocation = data?.m_TransferredLocation;
    await Wrapper_OrdersApi.updateWorkOrder(
      data,
      {
        m_TransferredLocation,
      },
      initData,
      initWithOriginalStructure
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
      const validateResult = onValidate({
        initWithOriginalStructure,
        initData,
        data,
        kind,
        uiOrderType,
      });
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
      const _changedData = utils.findChanges(initData, data);

      // process customized
      if (_changedData.w_ProductionStartDate) {
        _changedData.w_ProductionEndDate = _changedData.w_ProductionStartDate;
      }

      if (_changedData.d_ProductionStartDate) {
        _changedData.d_ProductionEndDate = _changedData.d_ProductionStartDate;
      }

      let stillEditingData = {};
      if (group && uiWoFieldEditGroupMapping?.[group]) {
        // only save group fields
        const allFieldsFromGroup = uiWoFieldEditGroupMapping[group];
        _.keys(_changedData)?.map((k) => {
          if (!allFieldsFromGroup[k]) {
            stillEditingData[k] = _changedData[k];
          }
        });
      }

      const res = await Wrapper_OrdersApi.updateWorkOrder(
        data,
        _changedData,
        initData,
        initWithOriginalStructure
      );

      if (res?.message) {
        // log hidden message for devs
        console.log(res?.message);
      }

      toast("Work order saved", { type: "success" });

      await doInitWo(initMasterId, stillEditingData);
      onSave();
    },
    () => setIsSaving(false), // callback function
  );

  const doUnlinkAddOn = useLoadingBar(
    async () => {
      const _parentWorkOrder = addonGroup?.parent?.m_WorkOrderNo;
      // note: to prevent accdentally detach
      if (
        !window.confirm(
          `Do you want to unlink ${initData.m_WorkOrderNo} from ${_parentWorkOrder}?`,
        )
      ) {
        return null;
      }

      // return
      setIsSaving(true);

      const _changedData = {
        m_AddOnLinked: ADDON_STATUS.detached,
      };

      await Wrapper_OrdersApi.updateWorkOrder(data, _changedData, initData, initWithOriginalStructure);

      toast(`Add-on Work order unlinked from ${_parentWorkOrder}`, {
        type: "success",
      });

      await doInit(initMasterId);
      onSave();
    },
    () => setIsSaving(false), // callback function
  );

  const doLinkAddOn = useLoadingBar(
    async () => {
      const _parentWorkOrder = addonGroup?.parent?.m_WorkOrderNo;
      // note: to prevent accdentally detach
      if (
        !window.confirm(
          `Do you want to link ${initData.m_WorkOrderNo} with ${_parentWorkOrder}?`,
        )
      ) {
        return null;
      }

      // return
      setIsSaving(true);

      const _changedData = {
        m_AddOnLinked: ADDON_STATUS.attached,
      };

      await Wrapper_OrdersApi.updateWorkOrder(data, _changedData, initData, initWithOriginalStructure);

      toast(`Add-on Work order linked from ${_parentWorkOrder}`, {
        type: "success",
      });

      await doInit(initMasterId);
      onSave();
    },
    () => setIsSaving(false), // callback function
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

  // called by each single input
  const checkEditable = useCallback(
    (params = {}) => {
      /*
        id: if editable of fields (order level)
        -- for permission or status

        group: usually for external tables that cant be identified by id. Like files, items. 
        -- mostly for permission purpose
      */
      const { fieldCode, group } = params;
      let _pass = isEditable;
      if (fieldCode) {
        _pass =
          _pass &&
          checkEditableByFieldCode({
            fieldCode,
            data,
            permissions,
            initKind,
            sourceOfUI,
          });
      }
      if (group) {
        _pass =
          _pass &&
          checkEditableByGroup({
            group,
            data,
            permissions,
            initKind,
            sourceOfUI,
          });
      }

      /* if its addon workorder, check if field is addonField
          logic to check if split addon*/
      const { isAddOnEditable } = checkAddOnField(params) || {};
      _pass = _pass && isAddOnEditable;

      return _pass;
    },
    [
      isEditable,
      initMasterId,
      data?.m_Status,
      data?.m_WinStatus,
      data?.m_DoorStatus,
      permissions,
      dictionary,
      isInAddOnGroup,
      addonGroup?.parent?.m_MasterId,
    ],
  );

  // called by each single input
  const checkAddOnField = useCallback(
    (params = {}) => {
      let result = {
        isAddOnEditable: true,
        isSyncedFromParent: false,
      };

      // if not addon or its addon parent
      if (!isInAddOnGroup) return result;
      if (addonGroup?.parent?.m_MasterId === initMasterId) return result;

      // if split(dettached)
      const { id } = params;
      if (id) {
        const { workOrderFields } = dictionary;
        return checkAddOnFieldById({ id, data, workOrderFields, initKind });
      }
      return result;
    },
    [
      isEditable,
      initMasterId,
      data?.m_Status,
      data?.m_WinStatus,
      data?.m_DoorStatus,
      dictionary?.workOrderFields,
      isInAddOnGroup,
      addonGroup?.parent?.m_MasterId,
    ],
  );

  const { onValidate } = useLocalValidation({
    validationResult,
    setValidationResult,
    checkEditable,
  });

  const _tabCounts = {
    returnTrips: returnTrips?.length || 0,
    existingImages: existingImages?.length || 0,
    existingAttachments: existingAttachments?.length || 0,
    items: (windowItems?.length || 0) + (doorItems?.length || 0),
    glass: `${glassTotal?.qty || 0}/${glassTotal?.glassQty || 0}`,
  };

  // =============================== split context for UI performance ===============================
  // 1. context for order
  const context = {
    // ...generalContext,
    ...props,
    isLoading,
    isSaving,
    display_sections: { ...DISPLAY_SECTIONS, ...display_sections },
    isUiAllowHeader,
    isUiAllowEdit,
    initMasterId,
    kind,
    initKind,
    facility,
    sourceOfUI,
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
    onHide: handleHide,
    onSave: doSave,
    onUnlinkAddOn: doUnlinkAddOn,
    onLinkAddOn: doLinkAddOn,
    onRestore: doRestore,
    onGetWindowMaker: doGetWindowMaker,
    onGetWindowMaker_comment: doGetWindowMaker_comment,
    onGetWindowMaker_batchNo: doGetWindowMaker_batchNo,

    tabCounts: _tabCounts,
    LbrBreakDowns,
    returnTrips,
    glassItems,
    expands,
    setExpands,
    isEditable,
    setIsEditable,
    checkEditable,
    checkAddOnField,
    uiOrderType,
    uiShowMore,
    setUiShowMore,
    glassTotal,
    uIstatusObj,
    initData,
    initWithOriginalStructure,
    initDataSiteLockout,
    initDataService,
    isDeleted: initData?.m_IsActive === false,
    validationResult,
    addonGroup,
    isInAddOnGroup,
    dictionary,
    permissions,
  };

  const context_data = {
    editedGroup,
    validationResult,
    data,
  };

  // 2. context for items
  const context_items = useMemo(
    () => ({
      onBatchUpdateItems: doBatchUpdateItems,
      windowItems,
      doorItems,
      permissions,

      //=== redundant for UI performance
      checkEditable,
      setExpands,
      uiOrderType,
      dictionary,
    }),
    [
      doBatchUpdateItems,
      windowItems,
      doorItems,
      permissions,

      //
      checkEditable,
      setExpands,
      uiOrderType,
      dictionary,
    ],
  );

  return (
    <LocalDataContext.Provider value={context}>
      <LocalDataContext_data.Provider value={context_data}>
        <LocalDataContext_items.Provider value={context_items}>
          {children}
        </LocalDataContext_items.Provider>
      </LocalDataContext_data.Provider>
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
