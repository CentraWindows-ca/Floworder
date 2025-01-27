import utils from "lib/utils";
import _ from 'lodash'
import { fetcher } from "lib/api/SERVER";

const ROOT = "/ProdData";

const initGetOrders = (params) => {
  return [`GetOrders?${utils.paramToString(params, true)}`, ROOT];
};

const getOrders = async (params) => {
  const api = `GetOrders?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT);
  return data;
};

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

  _.keys(params)?.map(k => {
    if (params[k]) {
      formData.append(k, params[k])
    }
  })

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
  _.keys(params)?.map(k => {
    if (params[k]) {
      formData.append(k, params[k])
    }
  })

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

const getProdAllByWorkOrderAsync = async (params) => {
  const api = `GetProdAllByWorkOrderAsync?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT);
  return data;
};

const updateStatusByGuidAsync = async (params) => {
  const api = `UpdateStatusByGuidAsync?${utils.paramToString(params, true)}`;

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

const initGetProdMasterAsync = (params) => [
  `GetHeaderProdMasterAsync`,
  ROOT,
  {
    method: "POST",
    body: params,
  },
];

const initGetProdWindowsAsync = (params) => [
  `GetHeaderProdWinAsync`,
  ROOT,
  {
    method: "POST",
    body: params,
  },
];

const initGetProdDoorsAsync = (params) => [
  `GetHeaderProdDoorAsync`,
  ROOT,
  {
    method: "POST",
    body: params,
  },
];

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

const updateWorkOrderHeaderWithPrefixAsync = async (
  params,
  { keyValue, masterId, fields },
) => {
  const api = `UpdateWorkOrderHeaderWithPrefixAsync?${utils.paramToString(params, true)}`;
  const parsedObj = converToString(fields);
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

const converToString = (fields) => {
  return Object.entries(fields).reduce((acc, [key, value]) => {
    acc[key] = value == null ? "" : String(value); // Leave null/undefined as-is
    return acc;
  }, {});
};

export default {
  getProdAllByWorkOrderAsync,
  initQueryWorkOrderHeaderWithPrefixAsync,
  queryWorkOrderHeaderWithPrefixAsync,
  initGetProdMasterAsync,
  initGetProdWindowsAsync,
  initGetProdDoorsAsync,
  updateStatusByGuidAsync,
  sync_AB_WindowMakerByWorkOrderAsync,
  sync_BC_WindowMakerByWorkOrderAsync,
  updateWorkOrderHeaderWithPrefixAsync,

  // files
  queryAnyTableAsync,
  getUploadFileByRecordIdAsync,
  uploadFileAsync,
  deleteUploadFileByIdAsync,

  getUploadImageByRecordIdAsync,
  uploadImageAsync,
  deleteUploadImageByIdAsync,
};
