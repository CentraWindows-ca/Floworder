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
import InvoiceApi from "lib/api/InvoiceApi";

import useLoadingBar from "lib/hooks/useLoadingBar";
import constants, {
  INVOICE_TRANSFER_FIELDS,
  ORDER_STATUS,
  ORDER_TRANSFER_FIELDS,
} from "lib/constants";
import { uiWoFieldEditGroupMapping } from "lib/constants/invoice_constants_labelMapping";
import { getOrderKind } from "lib/utils";

import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";

import { checkEditableById, checkEditableByGroup } from "./Com";
import useLocalValidation from "./hooks/useLocalValidation";
import invoice_utils, { flattenObjWithPrefix } from "lib/utils/invoice_utils";

export const LocalDataContext = createContext(null);

export const LocalDataProvider = ({
  children,
  initInvoiceHeaderId,

  // the tab we are open from. we need some logic rely on the path they open the modal
  facility,
  onSave,
  onHide,
  onRestore,
  initIsEditable = true,
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

  // only display. upload/delete will directly call function
  const [existingAttachments, setExistingAttachments] = useState(null);
  const [newAttachments, setNewAttachments] = useState(null);

  const [salesAttachments, setSalesAttachments] = useState(null)

  const [invoiceNotes, setInvoiceNotes] = useState(null);
  const [invoiceCallLogs, setInvoiceCallLogs] = useState(null);

  const [uiOrderType, setUiOrderType] = useState({});
  const [uiShowMore, setUiShowMore] = useState(true);
  const [validationResult, setValidationResult] = useState(null);

  const [initData, setInitData] = useState(null);

  // UI purpose
  const [expands, setExpands] = useState({});

  useEffect(() => {
    if (initInvoiceHeaderId) {
      console.log(initInvoiceHeaderId, isDeleted);

      doInit(initInvoiceHeaderId);
    }
  }, [initInvoiceHeaderId, isDeleted]);

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
    onHide();
    clear();
  };

  // ====== api calls
  const clear = () => {
    setData(null);
    setInvoiceNotes(null);
    setInvoiceCallLogs(null);
    setExistingAttachments(null);
    setNewAttachments(null);
    setInitData(null);
    setEditedGroup({});
    setValidationResult(null);
  };

  const doInit = async (initInvoiceHeaderId) => {
    setIsLoading(true);
    setData(null);
    setEditedGroup({});
    setIsEditable(initIsEditable);
    setValidationResult(null);

    const mergedData = await doInitInvoice(initInvoiceHeaderId);

    if (mergedData) {
      initAttachmentList(mergedData?.inv_invoiceId);
      await initInvoiceNotes(mergedData?.inv_invoiceId);
      await initInvoiceCallLogs(mergedData?.inv_invoiceId);
    }

    setIsLoading(false);
  };

  const doInitInvoice = useLoadingBar(
    async (initInvoiceHeaderId, stillEditingData = {}) => {
      const res = await InvoiceApi.getInvoiceOrderDetails(initInvoiceHeaderId);

      let mergedData = {};
      if (typeof res === "object") {
        // ==== assemble, add prefix
        mergedData = invoice_utils.flattenResWithPrefix(res);

        // set init fields from newest wo
        setInitData(JSON.parse(JSON.stringify(mergedData)));

        // if use has pending edits
        setData({ ...mergedData, ...stillEditingData });
      }

      console.log(mergedData);

      return mergedData;
    },
  );

  const initInvoiceNotes = useLoadingBar(async (_invoiceId) => {
    let _list = await InvoiceApi.getInvoiceNotes(_invoiceId);
    _list = _.orderBy(_list, ["submittedAt"], ["DESC"]);
    setInvoiceNotes(_list);
  });

  const initInvoiceCallLogs = useLoadingBar(async (_invoiceId) => {
    let _list = await InvoiceApi.getInvoiceCallLogs(_invoiceId);
    _list = _list?.map((a) => ({
      ...a,
      dateCalled: utils.formatDateForMorganLegacy(a.dateCalled),
    }));

    _list = _.orderBy(_list, ["dateCalled"], ["DESC"]);
    setInvoiceCallLogs(_list);
  });

  const initAttachmentList = useLoadingBar(async (_invoiceId) => {
    const res = await InvoiceApi.getInvoiceUploadFiles(_invoiceId);
    setExistingAttachments(res);


    const resSalesAttachments = await InvoiceApi.getSalesUploadFiles(initInvoiceHeaderId)
    setSalesAttachments(resSalesAttachments)
  });

  //
  const doUpdateStatus = async (newStatus) => {
    const payload = await invoice_utils.getStatusPayload(
      data,
      newStatus,
      initData,
      requestData,
    );
    if (payload === null) return null;

    await InvoiceApi.wrapper_updateInvoiceStatus(payload, initData);

    toast("Status updated", { type: "success" });
    await doInit(initInvoiceHeaderId);
    onSave();
  };

  const doRestore = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to delete [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    await OrdersApi.undoSoftDeleteProductionsWorkOrder(null, null, initData);
    // change url string to delete isDelete

    toast("Work order restored", { type: "success" });
    onRestore();
  });

  const doUploadAttachment = useLoadingBar(async (_files) => {
    const awaitList = _files?.map((_f) => {
      const { file, notes } = _f;
      return InvoiceApi.uploadFileAsync(
        null,
        {
          invoiceId: data?.inv_invoiceId,
          uploadingFile: file,
          notes,
        },
        initData,
      );
    });

    await Promise.all(awaitList);
    toast("Attachment updated", { type: "success" });
    await initAttachmentList(data?.inv_invoiceId);
  });

  const doDeleteAttachment = useLoadingBar(async (_file) => {
    if (!confirm(`Delete ${_file.fileName}?`)) return null;
    await OrdersApi.deleteUploadFileByIdAsync(
      {
        id: _file.id,
        masterId: data?.inv_invoiceId,
      },
      null,
      initData,
    );

    toast("File deleted", { type: "success" });
    await initAttachmentList(data?.inv_invoiceId);
  });

  const doDeleteInvoiceNotes = useLoadingBar(async (_rt) => {
    if (!confirm(`Delete the notes?`)) return null;
    await InvoiceApi.deleteNotesById(_rt);
    await initInvoiceNotes(data?.inv_invoiceId);
  });
  const doAddInvoiceNotes = useLoadingBar(async (_rt) => {
    await InvoiceApi.addInvoiceNotes({}, _rt, initData);
    await initInvoiceNotes(data?.inv_invoiceId);
  });
  const doEditInvoiceNotes = useLoadingBar(async (_rt) => {
    await InvoiceApi.updateInvoiceNotes({}, _rt, initData);
    await initInvoiceNotes(data?.inv_invoiceId);
  });

  const doDeleteInvoiceCallLogs = useLoadingBar(async (_rt) => {
    await InvoiceApi.deleteCallLogsById(_rt);
    await initInvoiceCallLogs(data?.inv_invoiceId);
  });
  const doAddInvoiceCallLogs = useLoadingBar(async (_rt) => {
    await InvoiceApi.addInvoiceCallLog({}, _rt, initData);
    await initInvoiceCallLogs(data?.inv_invoiceId);
  });
  const doEditInvoiceCallLogs = useLoadingBar(async (_rt) => {
    await InvoiceApi.updateInvoiceCallLog({}, _rt, initData);
    await initInvoiceCallLogs(data?.inv_invoiceId);
  });

  const doSave = useLoadingBar(
    async (group) => {
      const validateResult = onValidate({ initData, data, uiOrderType });
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

      const _payload = invoice_utils.assemblePrefixedObjToPayload(
        _changedData,
        initData,
      );

      await InvoiceApi.updateInvoiceById({}, _payload, initData);
      toast("Invoice saved", { type: "success" });
      await doInitInvoice(initInvoiceHeaderId, stillEditingData);
      onSave();
    },
    () => setIsSaving(false), // callback function
  );

  // calculations

  const uIstatusObj = {};

  // called by each single input
  const checkEditable = useCallback(
    (params = {}) => {
      /*
        id: if editable of fields (order level)
        -- for permission or status

        group: usually for external tables that cant be identified by id. Like files. 
        -- mostly for permission purpose
      */
      const { id, group } = params;
      let _pass = isEditable;
      if (id) {
        _pass = _pass && checkEditableById({ id, data, permissions });
      }
      if (group) {
        _pass = _pass && checkEditableByGroup({ group, data, permissions });
      }

      return _pass;
    },
    [isEditable, initInvoiceHeaderId, data?.m_Status, permissions, dictionary],
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
    initInvoiceHeaderId,
    data,
    facility,
    setData,
    newAttachments,
    setNewAttachments,
    existingAttachments,
    setExistingAttachments,
    salesAttachments,
    onChange: handleChange,
    onUpdateStatus: doUpdateStatus,
    onAnchor: handleAnchor,
    onUploadAttachment: doUploadAttachment,
    onDeleteAttachment: doDeleteAttachment,

    onDeleteInvoiceNotes: doDeleteInvoiceNotes,
    onAddInvoiceNotes: doAddInvoiceNotes,
    onEditInvoiceNotes: doEditInvoiceNotes,

    onDeleteInvoiceCallLogs: doDeleteInvoiceCallLogs,
    onAddInvoiceCallLogs: doAddInvoiceCallLogs,
    onEditInvoiceCallLogs: doEditInvoiceCallLogs,

    onHide: handleHide,
    onSave: doSave,
    onRestore: doRestore,
    editedGroup,
    setEditedGroup,

    LbrBreakDowns,
    invoiceNotes,
    invoiceCallLogs,
    expands,
    setExpands,
    isEditable,
    setIsEditable,
    checkEditable,
    uiOrderType,
    uiShowMore,
    setUiShowMore,
    uIstatusObj,
    initData,
    isDeleted: initData?.m_IsActive === false,
    validationResult,
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

// ======= utils

export default LocalDataProvider;
