import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT = "/ProdData";

const SYNC_TO_FF = process.env.NEXT_PUBLIC_ENV === "staging"; // false;
console.log("SYNC_TO_FF:", SYNC_TO_FF);
/*
  /ProdData/Sync_AB_WindowMakerByWorkOrderAsync
  /ProdData/Sync_BC_WindowMakerByWorkOrderAsync
  /ProdData/GetProdAllByWorkOrderAsync


  /ProdData/GetProdMasterAsync
  /ProdData/GetProdWindowsAsync
  /ProdData/GetProdDoorsAsync

  UpdateStatusByGuidAsync
  /ProdData/GetAttachmentsByRecordIdAsync
  DeleteUploadFileByIdAsync
*/

// files
const getUploadFileByRecordIdAsync = async (params) => {
  const api = `GetUploadFileByRecordIdAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT);
  return data;
};

const uploadFileAsync = async (body) => {
  const api = `UploadFileAsync?${utils.paramToString({ updateOldFF: SYNC_TO_FF }, true)}`;

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
  return data;
};
const deleteUploadFileByIdAsync = async (params) => {
  const api = `DeleteUploadFileByIdAsync?${utils.paramToString({ ...params, updateOldFF: SYNC_TO_FF }, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
  });
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
const uploadImageAsync = async (params) => {
  const api = `UploadImageAsync?${utils.paramToString({ updateOldFF: SYNC_TO_FF }, true)}`;

  // Create a FormData object to include both the file and other parameters
  const formData = new FormData();
  _.keys(params)?.map((k) => {
    if (params[k]) {
      formData.append(k, params[k]);
    }
  });

  // Make the POST request with the FormData
  const data = await fetcher(api, ROOT, {
    method: "POST",
    body: formData,
  });
  return data;
};
const deleteUploadImageByIdAsync = async (params) => {
  const api = `DeleteUploadImageByIdAsync?${utils.paramToString({ ...params, updateOldFF: SYNC_TO_FF }, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
  });
  return data;
};

// when create from WindowMaker
const sync_AB_WindowMakerByWorkOrderAsync = async (params, body) => {
  const api = `Sync_AB_WindowMakerByWorkOrderAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return data;
};

const sync_BC_WindowMakerByWorkOrderAsync = async (params, body) => {
  const api = `Sync_BC_WindowMakerByWorkOrderAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return data;
};

const sync_AB_Order_FF_Async = async (params, body) => {
  const api = `Sync_AB_Order_FF_Async?${utils.paramToString(params, true)}`;  const data = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return data;
};

const sync_BC_Order_FF_Async = async (params, body) => {
  const api = `Sync_BC_Order_FF_Async?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return data;
};

// when update from WindowMaker
const updateOnly_AB_WMByWorkOrderAsync = async (params, body) => {
  const api = `UpdateOnly_AB_WMByWorkOrderAsync?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return data;
};

const updateOnly_BC_WMByWorkOrderAsync = async (params, body) => {
  const api = `UpdateOnly_BC_WMByWorkOrderAsync?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
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

const initQueryWorkOrderHeaderWithPrefixAsync = (params) => [
  `QueryWorkOrderHeaderWithPrefixAsync`,
  ROOT,
  {
    method: "POST",
    body: params,
  },
];

const updateAnyTableAsync = async (params, body) => {
  const api = `UpdateAnyTableAsync?${utils.paramToString({ ...params, updateOldFF: SYNC_TO_FF }, true)}`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return res?.data;
};

const batchUpdateTableAsync = async (params, body) => {
  const api = `BatchUpdateTableAsync?${utils.paramToString({ ...params, updateOldFF: SYNC_TO_FF }, true)}`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return res?.data;
};

const updateWorkOrderHeaderWithPrefixAsync = async (
  params,
  { keyValue, masterId, fields },
) => {
  const api = `UpdateWorkOrderHeaderWithPrefixAsync?${utils.paramToString({ ...params, updateOldFF: SYNC_TO_FF }, true)}`;
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
  return res?.data;
};

const softDeleteProductionsWorkOrder = async ({
  m_WorkOrderNo,
  m_MasterId,
}) => {
  const api = `SoftDeleteProductionsWorkOrder`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      workOrderNumber: m_WorkOrderNo,
      masterId: m_MasterId,
    },
  });
  return res?.data;
};

const hardDeleteProductionsWorkOrder = async ({
  m_WorkOrderNo,
  m_MasterId,
}) => {
  const api = `HardDeleteProductionsWorkOrder`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      workOrderNumber: m_WorkOrderNo,
      masterId: m_MasterId,
    },
  });
  return res?.data;
};

const updateWorkOrderStatus = async ({
  m_WorkOrderNo,
  m_MasterId,
  oldStatus,
  newStatus,
  isWindow,
  transferredDate,
  transferredLocation,
  shippedDate,
  notes,
}) => {
  const api = `UpdateWorkOrderStatus?${utils.paramToString({ updateOldFF: SYNC_TO_FF }, true)}`;

  const _uploadingValues = {
    workOrderNumber: m_WorkOrderNo,
    masterId: m_MasterId,
    oldStatus,
    newStatus,
    isWindow,
    transferredDate,
    transferredLocation,
    shippedDate,
    notes,
  };

  // prevent override existing value
  _.keys(_uploadingValues)?.map((k) => {
    // exclude boolean, empty string
    if (_uploadingValues[k] === null || _uploadingValues[k] === undefined) {
      delete _uploadingValues[k];
    }
  });

  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      listUpdateStatusDto: [_uploadingValues],
    },
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
  sync_AB_WindowMakerByWorkOrderAsync,
  sync_BC_WindowMakerByWorkOrderAsync,
  sync_AB_Order_FF_Async,
  sync_BC_Order_FF_Async,
  updateOnly_AB_WMByWorkOrderAsync,
  updateOnly_BC_WMByWorkOrderAsync,
  updateWorkOrderHeaderWithPrefixAsync,
  softDeleteProductionsWorkOrder,
  updateWorkOrderStatus,
  hardDeleteProductionsWorkOrder,
  queryWorkOrderHistoryAsync,
  getIsExistByWOAsync,

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
