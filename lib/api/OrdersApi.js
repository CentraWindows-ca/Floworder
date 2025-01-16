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
*/

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
  `GetProdMasterAsync`,
  ROOT,
  {
    method: "POST",
    body: params,
  },
];

const initGetProdWindowsAsync = (params) => [
  `GetProdWindowsAsync`,
  ROOT,
  {
    method: "POST",
    body: params,
  },
];

const initGetProdDoorsAsync = (params) => [
  `GetProdDoorsAsync`,
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
  sync_BC_WindowMakerByWorkOrderAsync
};
