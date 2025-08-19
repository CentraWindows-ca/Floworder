import utils from "lib/utils";
import _ from "lodash";
import { fetcher, SERVER } from "lib/api/SERVER";

import Prod2FFApi from "./Prod2FFApi";
import ProdHistoryApi from "./ProdHistoryApi";

const ROOT = "/ProdData";

// ==================== get METHODS
const getWorkOrderNoByMasterIdAsync = async (params, body) => {
  const api = `GetWorkOrderNoByMasterIdAsync?${utils.paramToString(params, true)}`;

  const res = await fetcher(api, "/CWProdData");
  return res;
};


// files
const getUploadFileByRecordIdAsync = async (params) => {
  const api = `GetUploadFileMetadataByRecordIdAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT);
  return data;
};

const urlGetFile = (params) => {
  const api = `${SERVER}${ROOT}/GetUploadFileStreamByIdAsync?${utils.paramToString(params, true)}`;
  return api;
};

// ========
const getIsExistByWOAsync = async (params) => {
  //workOrderNo
  const api = `IsExistByWOAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT);
  return data;
};

const getUploadImageByRecordIdAsync = async (params) => {
  const api = `GetUploadImageByRecordIdAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT);
  return data;
};

// ============== addon order ==============
const initGetOMFieldMetadata = () => [
  `GetUIOMFieldMetadata`,
  ROOT,
  {
    method: "GET",
  },
];

const getAddsOnGroupByMasterId = async (params, body) => {
  const api = `GetAddsOnGroupByMasterId?${utils.paramToString(params, true)}`;

  const res = await fetcher(api, ROOT);
  return res?.data;
};

// query
const queryAnyTableAsync = async (params, body) => {
  const api = `QueryAnyTableAsync?${utils.paramToString(params, true)}`;

  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return res?.data;
};

const queryWorkOrderHistoryAsync = async (params, body) => {
  const api = `QueryWorkOrderHistoryAsync?${utils.paramToString(params, true)}`;

  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return res?.data;
};

const queryWorkOrderHeaderWithPrefixAsync = async (params, body) => {
  const api = `QueryWorkOrderHeaderWithPrefixAsync?${utils.paramToString(params, true)}`;

  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return res?.data;
};

const getWorkOrdersInstallationStatusAsync = async (params, body) => {
  // body: {"workOrderNos": ["string"]}
  const api = `GetWorkOrdersInstallationStatusAsync?${utils.paramToString(params, true)}`;

  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return res?.data;
};

const getWorkOrdersInstallationInfoAsync = async (params, body) => {
  // body: {"workOrderNos": ["string"]}
  const api = `GetWorkOrdersInstallationInfoAsync?${utils.paramToString(params, true)}`;

  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return res?.data;
};

const initQueryWorkOrderHeaderWithPrefixAsync = (params, body) => [
  `QueryWorkOrderHeaderWithPrefixAsync`,
  ROOT,
  {
    method: "POST",
    body,
  },
];

// ==================== update METHODS
const uploadFileAsync = async (params, body, ref) => {
  const api = `UploadFileAsync?${utils.paramToString({}, true)}`;

  // Create a FormData object to include both the file and other parameters
  const formData = new FormData();

  _.keys(body)?.map((k) => {
    if (body[k]) {
      formData.append(k, body[k]);
    }
  });

  let res, error;
  try {
    // Make the POST request with the FormData
    res = await fetcher(api, ROOT, {
      method: "POST",
      body: formData,
    });

    // sync back to FF
    Prod2FFApi.updateFiles2FFAsync(ref);
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync back to history
    ProdHistoryApi.insertWorkOrderHistoryWhenUploadAttachmentsAsync({
      masterId: ref?.m_MasterId,
      type: "file",
      attachments: [
        {
          id: body?.prodTypeId?.toString(),
          notes: body?.notes,
        },
      ],
    });
  }

  return res;
};
const deleteUploadFileByIdAsync = async (params, body, ref) => {
  const api = `DeleteUploadFileByIdAsync?${utils.paramToString({ ...params }, true)}`;

  let res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
    });

    // sync back to FF
    Prod2FFApi.updateFiles2FFAsync(ref);
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync back to history
    ProdHistoryApi.insertWorkOrderHistoryWhenDeleteAttachmentsAsync({
      masterId: ref?.m_MasterId,
      type: "file",
      ids: [params?.id?.toString()],
    });
  }

  return res;
};

const uploadImageAsync = async (params, body, ref) => {
  const api = `UploadImageAsync?${utils.paramToString({}, true)}`;

  // Create a FormData object to include both the file and other parameters
  const formData = new FormData();
  _.keys(body)?.map((k) => {
    if (body[k]) {
      formData.append(k, body[k]);
    }
  });

  let res, error;
  try {
    // Make the POST request with the FormData
    res = await fetcher(api, ROOT, {
      method: "POST",
      body: formData,
    });

    // sync back to FF
    Prod2FFApi.updateImages2FFAsync(ref);
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync back to history
    ProdHistoryApi.insertWorkOrderHistoryWhenUploadAttachmentsAsync({
      masterId: ref?.m_MasterId,
      type: "image",
      attachments: [
        {
          id: body?.prodTypeId?.toString(),
          notes: body?.notes,
        },
      ],
    });
  }

  return res;
};
const deleteUploadImageByIdAsync = async (params, body, ref) => {
  const api = `DeleteUploadImageByIdAsync?${utils.paramToString({ ...params }, true)}`;

  let res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
    });

    // sync back to FF
    Prod2FFApi.updateImages2FFAsync(ref);
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync back to history
    ProdHistoryApi.insertWorkOrderHistoryWhenDeleteAttachmentsAsync({
      masterId: ref?.m_MasterId,
      type: "image",
      ids: [params?.id?.toString()],
    });
  }

  return res;
};

const batchUpdateTableAsync = async (params, body, ref, refItems) => {
  const api = `BatchUpdateTableAsync?${utils.paramToString({ ...params }, true)}`;

  let res, error;

  const { table, masterId } = body;

  switch (table) {
    case "ProdWindowItems":
      try {
        res = await fetcher(api, ROOT, {
          method: "POST",
          body,
        });
        // sync back to FF
        Prod2FFApi.updateWinItems2FFAsync(ref);
      } catch (err) {
        error = err;
        throw err;
      } finally {
        ProdHistoryApi.insertWorkOrderHistoryWhenUpdateItemAsync({
          masterId,
          items: body.updates,
          refItems,
        });
      }

      break;
    case "ProdDoorItems":
      try {
        res = await fetcher(api, ROOT, {
          method: "POST",
          body,
        });
        Prod2FFApi.updateDoorItems2FFAsync(ref);
      } catch (err) {
        error = err;
        throw err;
      } finally {
        ProdHistoryApi.insertWorkOrderHistoryWhenUpdateItemAsync({
          masterId,
          items: body.updates,
          refItems,
        });
      }

      break;
    default:
      break;
  }

  return res?.data;
};

const updateWorkOrderHeaderWithPrefixAsync = async (
  params,
  { keyValue, masterId, fields },
  ref,
  refItems,
) => {
  const api = `UpdateWorkOrderHeaderWithPrefixAsync?${utils.paramToString({ ...params }, true)}`;
  const parsedObj = converToString(fields);
  if (_.isEmpty(parsedObj)) return null;

  let res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body: {
        keyValue,
        masterId,
        fields: parsedObj,
      },
    });
    // sync back to FF
    Prod2FFApi.updateHeaderData2FFAsync(ref, { fields: parsedObj });
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync to history
    ProdHistoryApi.insertWorkOrderHistoryWhenUpdateAsync({
      masterId,
      fields: parsedObj,
      ref,
    });
  }

  return res?.data;
};

const softDeleteProductionsWorkOrder = async (params, body, ref) => {
  const { m_WorkOrderNo, m_MasterId } = ref;
  const api = `SoftDeleteProductionsWorkOrder`;

  let res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body: {
        workOrderNo: m_WorkOrderNo,
        masterId: m_MasterId,
      },
    });
    // sync back to FF
    Prod2FFApi.pendingDelete2FFAsync(ref);
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync to history
    ProdHistoryApi.insertWorkOrderHistoryWhenSoftDeleteAsync({
      masterId: m_MasterId,
    });
  }

  return res?.data;
};

const undoSoftDeleteProductionsWorkOrder = async (params, body, ref) => {
  const { m_WorkOrderNo, m_MasterId } = ref;
  const api = `UndoSoftDeleteProductionsWorkOrder`;

  let res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body: {
        workOrderNo: m_WorkOrderNo,
        masterId: m_MasterId,
      },
    });

    // sync back to FF
    Prod2FFApi.pendingDelete2FFAsync(ref);
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync to history
    ProdHistoryApi.insertWorkOrderHistoryWhenUndoSoftDeleteAsync({
      masterId: m_MasterId,
    });
  }

  return res?.data;
};

const hardDeleteProductionsWorkOrder = async (
  params,
  { m_WorkOrderNo, m_MasterId },
  ref,
) => {
  // sync back to FF (need to run first. because once record delete there is no MasterId)
  Prod2FFApi.delete2FFAsync(ref);
  // sync inventory
  Prod2FFApi.deleteInventoryAsync(ref);

  const api = `HardDeleteProductionsWorkOrder`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      workOrderNo: m_WorkOrderNo,
      masterId: m_MasterId,
    },
  });

  return res?.data;
};

const updateWorkOrderStatus = async (
  params,
  {
    m_WorkOrderNo,
    m_MasterId,
    oldStatus,
    newStatus,
    isWindow,
    transferredDate,
    transferredLocation,
    shippedDate,
    notes,
  },
  ref,
) => {
  let api = `UpdateWorkOrderStatus?${utils.paramToString({}, true)}`;

  // ========== temporary solution: @250423_handle_reservation ===========
  if (
    (oldStatus === "Draft Work Order" && newStatus === "Draft Reservations") ||
    (oldStatus === "Scheduled Work Order" &&
      newStatus === "Confirmed Reservations") ||
    (newStatus === "Draft Work Order" && oldStatus === "Draft Reservations") ||
    (newStatus === "Scheduled Work Order" &&
      oldStatus === "Confirmed Reservations")
  ) {
    api = `TemporarySetWorkOrderStatus?${utils.paramToString({}, true)}`;
  }
  // ========== temporary solution: @250423_handle_reservation ===========

  const _uploadingValues = {
    workOrderNo: m_WorkOrderNo,
    masterId: m_MasterId,
    oldStatus,
    newStatus,
    isWindow,
  };

  const fields = {
    transferredDate,
    transferredLocation,
    shippedDate,
    notes,
  };

  // prevent override existing value
  _.keys(fields)?.map((k) => {
    // exclude boolean, empty string
    if (fields[k] === null || fields[k] === undefined) {
      delete fields[k];
    }
  });

  let res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body: {
        listUpdateStatusDto: [{ ..._uploadingValues, ...fields }],
      },
    });

    // sync back to FF
    Prod2FFApi.updateStatus2FFAsync(ref, {
      oldStatus,
      newStatus,
      fields,
    });
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync to history
    ProdHistoryApi.insertWorkOrderHistoryWhenTransitAsync({
      masterId: m_MasterId,
      isWindow,
      oldStatus,
      newStatus,
      fields,
      ref,
    });
  }

  return res?.data;
};

// ============== return trips ==============
const getProductionsReturnTripByID = async (params, body, ref) => {
  const api = `GetProductionsReturnTripByID?${utils.paramToString({ ...params }, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "GET",
  });
  return data;
};
const updateProductionsReturnTrip = async (params, body, ref, refRt) => {
  const api = `UpdateProductionsReturnTrip?${utils.paramToString({ ...params }, true)}`;

  const fields = {
    workOrderNo: ref.m_WorkOrderNo,
    masterId: ref.m_MasterId,
    recordId: refRt?.id,
    oldReturnTripNotes: refRt?.returnTripNotes,
    oldReturnTripDate: refRt?.returnTripDate,
    returnTripNotes: body.returnTripNotes,
    returnTripDate: body.returnTripDate,
  };

  let res, error;
  try {
    res = await fetcher(api, ROOT, { method: "POST", body: fields });

    // sync back to FF
    Prod2FFApi.updateReturnTrip2FFAsync(ref);
  } catch (err) {
    error = err;
    throw err;
  } finally {
    ProdHistoryApi.insertWorkOrderHistoryWhenUpdateReturnTripAsync({
      masterId: ref.m_MasterId,
      fields,
    });
  }

  // sync back to history

  return res;
};

const addProductionsReturnTrip = async (params, body, ref, refRt) => {
  const api = `AddProductionsReturnTrip?${utils.paramToString({ ...params }, true)}`;

  const fields = {
    workOrderNo: ref.m_WorkOrderNo,
    masterId: ref.m_MasterId,
    returnTripNotes: body.returnTripNotes,
    returnTripDate: body.returnTripDate,
  };

  let res, error;
  try {
    res = await fetcher(api, ROOT, { method: "POST", body: fields });
    // sync back to FF
    Prod2FFApi.updateReturnTrip2FFAsync(ref);
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync back to history
    ProdHistoryApi.insertWorkOrderHistoryWhenAddReturnTrip({
      masterId: ref.m_MasterId,
      fields: { ...fields, id: res?.recordId },
    });
  }

  return res;
};

const hardDeleteProductionsReturnTrip = async (params, body, ref) => {
  const api = `HardDeleteProductionsReturnTrip?${utils.paramToString({ ...params }, true)}`;
  const fields = {
    workOrderNo: ref.m_WorkOrderNo,
    masterId: ref.m_MasterId,
    recordId: body.id,
    returnTripNotes: body.returnTripNotes,
    returnTripDate: body.returnTripDate,
    deleteAll: false,
  };

  let res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body: fields,
    });

    // sync back to FF
    Prod2FFApi.updateReturnTrip2FFAsync(ref);
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync back to history
    ProdHistoryApi.insertWorkOrderHistoryWhenDeleteReturnTripAsync({
      masterId: ref?.m_MasterId,
      fields,
    });
  }

  return res;
};

const converToString = (fields) => {
  return Object.entries(fields).reduce((acc, [key, value]) => {
    acc[key] = value === null ? null : String(value); // Leave null/undefined as-is
    return acc;
  }, {});
};

export default {
  initQueryWorkOrderHeaderWithPrefixAsync,
  queryWorkOrderHeaderWithPrefixAsync,
  updateWorkOrderHeaderWithPrefixAsync,
  softDeleteProductionsWorkOrder,
  undoSoftDeleteProductionsWorkOrder,
  updateWorkOrderStatus,
  hardDeleteProductionsWorkOrder,
  queryWorkOrderHistoryAsync,
  getIsExistByWOAsync,
  getWorkOrdersInstallationStatusAsync,
  getWorkOrdersInstallationInfoAsync,
  getWorkOrderNoByMasterIdAsync,

  // addon
  initGetOMFieldMetadata,
  getAddsOnGroupByMasterId,

  // files
  getUploadFileByRecordIdAsync,
  uploadFileAsync,
  deleteUploadFileByIdAsync,

  getUploadImageByRecordIdAsync,
  uploadImageAsync,
  deleteUploadImageByIdAsync,

  queryAnyTableAsync,
  // updateAnyTableAsync,
  batchUpdateTableAsync,

  // return trip
  getProductionsReturnTripByID,
  updateProductionsReturnTrip,
  addProductionsReturnTrip,
  hardDeleteProductionsReturnTrip,

  urlGetFile,
};
