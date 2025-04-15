import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

import Prod2FFApi from "./Prod2FFApi";
import ProdHistoryApi from "./ProdHistoryApi";

const ROOT = "/ProdData";

// ==================== get METHODS
// files
const getUploadFileByRecordIdAsync = async (params) => {
  const api = `GetUploadFileByRecordIdAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT);
  return data;
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

  // Make the POST request with the FormData
  const data = await fetcher(api, ROOT, {
    method: "POST",
    body: formData,
  });

  // sync back to FF
  await Prod2FFApi.updateFiles2FFAsync(ref);

  // sync back to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenUploadAttachmentsAsync({
    masterId: ref?.m_MasterId,
    type: "file",
    attachments: [
      {
        id: body?.prodTypeId?.toString(),
        notes: body?.notes,
      },
    ],
  });

  return data;
};
const deleteUploadFileByIdAsync = async (params, body, ref) => {
  const api = `DeleteUploadFileByIdAsync?${utils.paramToString({ ...params }, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
  });

  // sync back to FF
  await Prod2FFApi.updateFiles2FFAsync(ref);

  // sync back to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenDeleteAttachmentsAsync({
    masterId: ref?.m_MasterId,
    type: "file",
    ids: [params?.id?.toString()],
  });

  return data;
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

  // Make the POST request with the FormData
  const data = await fetcher(api, ROOT, {
    method: "POST",
    body: formData,
  });

  // sync back to FF
  await Prod2FFApi.updateImages2FFAsync(ref);

  // sync back to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenUploadAttachmentsAsync({
    masterId: ref?.m_MasterId,
    type: "image",
    attachments: [
      {
        id: body?.prodTypeId?.toString(),
        notes: body?.notes,
      },
    ],
  });

  return data;
};
const deleteUploadImageByIdAsync = async (params, body, ref) => {
  const api = `DeleteUploadImageByIdAsync?${utils.paramToString({ ...params }, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
  });

  // sync back to FF
  await Prod2FFApi.updateImages2FFAsync(ref);

  // sync back to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenDeleteAttachmentsAsync({
    masterId: ref?.m_MasterId,
    type: "image",
    ids: [params?.id?.toString()],
  });

  return data;
};

const updateAnyTableAsync = async (params, body, ref) => {
  const api = `UpdateAnyTableAsync?${utils.paramToString({ ...params }, true)}`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });

  switch (table) {
    case "ProdWindowItems":
      // sync back to FF
      await Prod2FFApi.updateWinItems2FFAsync(ref);

      // sync back to history
      await ProdHistoryApi.insertItemHistoryWhenUpdateAsync({
        fields: body.fields,
        masterId: body.masterId,
        itemId: body.keyValue,
      });

      break;
    case "ProdDoorItems":
      await Prod2FFApi.updateDoorItems2FFAsync(ref);

      // sync back to history
      await ProdHistoryApi.insertItemHistoryWhenUpdateAsync({
        fields: body.fields,
        masterId: body.masterId,
        itemId: body.keyValue,
      });

      break;
    default:
      break;
  }

  return res?.data;
};

const batchUpdateTableAsync = async (params, body, ref, refItems) => {
  const api = `BatchUpdateTableAsync?${utils.paramToString({ ...params }, true)}`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });

  const { table, masterId } = body;

  switch (table) {
    case "ProdWindowItems":
      // sync back to FF
      await Prod2FFApi.updateWinItems2FFAsync(ref);
      await ProdHistoryApi.insertWorkOrderHistoryWhenUpdateItemAsync({
        masterId,
        items: body.updates,
        refItems,
      });

      break;
    case "ProdDoorItems":
      await Prod2FFApi.updateDoorItems2FFAsync(ref);
      await ProdHistoryApi.insertWorkOrderHistoryWhenUpdateItemAsync({
        masterId,
        items: body.updates,
        refItems,
      });
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

  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      keyValue,
      masterId,
      fields: parsedObj,
    },
  });

  // sync back to FF
  await Prod2FFApi.updateHeaderData2FFAsync(ref, { fields: parsedObj });

  // sync to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenUpdateAsync({
    masterId,
    fields: parsedObj,
    ref,
  });

  return res?.data;
};

const softDeleteProductionsWorkOrder = async (params, body, ref) => {
  const { m_WorkOrderNo, m_MasterId } = ref;
  const api = `SoftDeleteProductionsWorkOrder`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      workOrderNo: m_WorkOrderNo,
      masterId: m_MasterId,
    },
  });

  // sync back to FF
  await Prod2FFApi.pendingDelete2FFAsync(ref);

  // sync to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenSoftDeleteAsync({
    masterId: m_MasterId,
  });

  return res?.data;
};

const undoSoftDeleteProductionsWorkOrder = async (params, body, ref) => {
  const { m_WorkOrderNo, m_MasterId } = ref;
  const api = `UndoSoftDeleteProductionsWorkOrder`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      workOrderNo: m_WorkOrderNo,
      masterId: m_MasterId,
    },
  });

  // sync back to FF
  await Prod2FFApi.pendingDelete2FFAsync(ref);

  // sync to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenUndoSoftDeleteAsync({
    masterId: m_MasterId,
  });

  return res?.data;
};

const hardDeleteProductionsWorkOrder = async (
  params,
  { m_WorkOrderNo, m_MasterId },
  ref,
) => {
  // sync back to FF (need to run first. because once record delete there is no MasterId)
  await Prod2FFApi.delete2FFAsync(ref);

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
  const api = `UpdateWorkOrderStatus?${utils.paramToString({}, true)}`;

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

  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      listUpdateStatusDto: [{ ..._uploadingValues, ...fields }],
    },
  });

  // sync back to FF
  await Prod2FFApi.updateStatus2FFAsync(ref, {
    oldStatus,
    newStatus,
    fields,
  });

  // sync to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenTransitAsync({
    masterId: m_MasterId,
    isWindow,
    oldStatus,
    newStatus,
    fields,
    ref,
  });

  return res?.data;
};

const converToString = (fields) => {
  return Object.entries(fields).reduce((acc, [key, value]) => {
    acc[key] = value == null ? "" : String(value); // Leave null/undefined as-is
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

  // files
  getUploadFileByRecordIdAsync,
  uploadFileAsync,
  deleteUploadFileByIdAsync,

  getUploadImageByRecordIdAsync,
  uploadImageAsync,
  deleteUploadImageByIdAsync,

  queryAnyTableAsync,
  updateAnyTableAsync,
  batchUpdateTableAsync,
};
