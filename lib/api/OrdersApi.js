import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT = "/ProdData";

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

const uploadFileAsync = async (params) => {
  const api = `UploadFileAsync`;

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
const deleteUploadFileByIdAsync = async (params) => {
  const api = `DeleteUploadFileByIdAsync?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
  });
  return data;
};

// ========
const getUploadImageByRecordIdAsync = async (params) => {
  const api = `GetUploadImageByRecordIdAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT);
  return data;
};
const uploadImageAsync = async (params) => {
  const api = `UploadImageAsync`;

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
  const api = `DeleteUploadImageByIdAsync?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
  });
  return data;
};

const sync_AB_WindowMakerByWorkOrderAsync = async (params) => {
  const api = `Sync_AB_WindowMakerByWorkOrderAsync?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
  });
  return data;
};

const sync_BC_WindowMakerByWorkOrderAsync = async (params) => {
  const api = `Sync_BC_WindowMakerByWorkOrderAsync?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT, {
    method: "POST",
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
  const api = `UpdateAnyTableAsync?${utils.paramToString(params, true)}`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });
  return res?.data;
};

const batchUpdateTableAsync = async (params, body) => {
  const api = `BatchUpdateTableAsync?${utils.paramToString(params, true)}`;
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
  const api = `UpdateWorkOrderHeaderWithPrefixAsync?${utils.paramToString(params, true)}`;
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
  d_Id,
  w_Id,
}) => {
  const api = `SoftDeleteProductionsWorkOrder`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      workOrderNumber: m_WorkOrderNo,
      masterId: m_MasterId,
      d_RecordId: d_Id,
      w_RecordId: w_Id,
    },
  });
  return res?.data;
};

const updateWorkOrderStatus = async ({
  m_WorkOrderNo,
  m_MasterId,
  d_Id,
  w_Id,
  oldStatus,
  newStatus,
}) => {
  const api = `UpdateWorkOrderStatus`;
  const res = await fetcher(api, ROOT, {
    method: "POST",
    body: {
      listUpdateStatusDto: [
        {
          workOrderNumber: m_WorkOrderNo,
          masterId: m_MasterId,
          d_RecordId: d_Id,
          w_RecordId: w_Id,
          oldStatus,
          newStatus,
        },
      ],
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
  updateWorkOrderHeaderWithPrefixAsync,
  softDeleteProductionsWorkOrder,
  updateWorkOrderStatus,

  // files
  getUploadFileByRecordIdAsync,
  uploadFileAsync,
  deleteUploadFileByIdAsync,

  getUploadImageByRecordIdAsync,
  uploadImageAsync,
  deleteUploadImageByIdAsync,
  
  queryAnyTableAsync,
  updateAnyTableAsync,
  batchUpdateTableAsync
};

