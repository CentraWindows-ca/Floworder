import utils from "lib/utils";
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

  /ProdData/UpdateStatusByGuidAsync


  /ProdData/GetAttachmentsByRecordIdAsync
  /ProdData/UploadAttachmentsAsync
  /ProdData/DeleteAttachmentsByIdAsync
*/

// files
const getAttachmentsByRecordIdAsync = async (params) => {
  const api = `GetAttachmentsByRecordIdAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT);
  return data;
};

const uploadAttachmentsAsync = async (params, file) => {
  const api = `UploadAttachmentsAsync`;

  // Create a FormData object to include both the file and other parameters
  const formData = new FormData();
  formData.append("recordId", params.recordId);
  formData.append("prodTypeId", params.prodTypeId);
  formData.append("kind", params.kind);
  formData.append("uploadingFile", file); // Add the binary file
  formData.append("notes", params.notes);

  // Make the POST request with the FormData
  const data = await fetcher(api, ROOT, {
    method: "POST",
    body: formData,
  });
  return data;
};

const deleteAttachmentsByIdAsync = async (params) => {
  const api = `DeleteAttachmentsByIdAsync?${utils.paramToString(params, true)}`;

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

/*
  {
    "pageNumber": 0,
    "pageSize": 0,
    "searchText": "string",
    "sortOrder": {
      "columnName": "string",
      "descending": true
    },
    "branchId": "string",
    "prodStartDate": "string",
    "prodEndDate": "string"
  }
*/
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

export default {
  getProdAllByWorkOrderAsync,
  initGetProdMasterAsync,
  initGetProdWindowsAsync,
  initGetProdDoorsAsync,
  updateStatusByGuidAsync,
  sync_AB_WindowMakerByWorkOrderAsync,
  sync_BC_WindowMakerByWorkOrderAsync,

  // files
  getAttachmentsByRecordIdAsync,
  uploadAttachmentsAsync,
  deleteAttachmentsByIdAsync
};
