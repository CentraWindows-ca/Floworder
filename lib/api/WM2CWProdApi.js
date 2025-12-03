import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

import Prod2FFApi from "./Prod2FFApi";
import ProdHistoryApi from "./ProdHistoryApi";

const ROOT = "/WM2CWProd";

// ==================== get METHODS
// when create from WindowMaker
const sync_AB_WindowMakerByWorkOrderAsync = async (params, body, ref) => {
  const api = `Sync_AB_WindowMakerByWorkOrderAsync?${utils.paramToString(params, true)}`;

  let masterId, res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body,
    });

    masterId = res.masterId;

    // sync back to FF
    Prod2FFApi.sync_AB_Order_FF_Async({
      m_MasterId: masterId,
    });
    Prod2FFApi.syncInventoryAsync({
      masterId,
      workOrderNo: body.workOrderNo
    })
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync to history
    ProdHistoryApi.insertWorkOrderHistoryWhenCreateAsync({
      masterId,
    });
  }

  return res;
};

const sync_BC_WindowMakerByWorkOrderAsync = async (params, body, ref) => {
  const api = `Sync_BC_WindowMakerByWorkOrderAsync?${utils.paramToString(params, true)}`;

  let masterId, res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body,
    });

    masterId = res.masterId;
    // sync back to FF
    Prod2FFApi.sync_BC_Order_FF_Async({
      m_MasterId: masterId,
    });
    Prod2FFApi.syncInventoryAsync({
      masterId,
      workOrderNo: body.workOrderNo
    })
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync to history
    ProdHistoryApi.insertWorkOrderHistoryWhenCreateAsync({
      masterId,
    });
  }

  return res;
};

// when update from WindowMaker
const updateOnly_AB_WMByWorkOrderAsync = async (params, body, ref) => {
  const api = `UpdateOnly_AB_WMByWorkOrderAsync?${utils.paramToString(params, true)}`;

  let masterId, res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body,
    });
    masterId = res.masterId;

    // sync back to FF
    Prod2FFApi.updateHeaderAndItems2FFAsync(ref);
    Prod2FFApi.syncInventoryAsync({
      masterId,
      workOrderNo: body.workOrderNo
    })
  } catch (err) {
    error = err;
    throw err;
  } finally {
    ProdHistoryApi.insertWorkOrderHistoryWhenGetWindowMakerAsync({
      masterId,
    });
  }

  return masterId;
};

const updateOnly_BC_WMByWorkOrderAsync = async (params, body, ref) => {
  const api = `UpdateOnly_BC_WMByWorkOrderAsync?${utils.paramToString(params, true)}`;

  let masterId, res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body,
    });
    masterId = res.masterId;

    // sync back to FF
    Prod2FFApi.updateHeaderAndItems2FFAsync(ref);
    Prod2FFApi.syncInventoryAsync({
      masterId,
      workOrderNo: body.workOrderNo
    })
  } catch (err) {
    error = err;
    throw err;
  } finally {
    ProdHistoryApi.insertWorkOrderHistoryWhenGetWindowMakerAsync({
      masterId,
    });
  }

  return masterId;
};

const fetchWMComment = async (params, body, ref) => {
  const api = `FetchWMComment?${utils.paramToString(params, true)}`;
  let res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body,
    });
  } catch (err) {
    error = err;
    throw err;
  } 
  return res;
};

const fetchWMBatchNos = async (params, body, ref) => {
  const api = `FetchWMBatchNos?${utils.paramToString(params, true)}`;
  let res, error;
  try {
    res = await fetcher(api, ROOT, {
      method: "POST",
      body,
    });
  } catch (err) {
    error = err;
    throw err;
  } 
  return res;
};

export default {
  sync_AB_WindowMakerByWorkOrderAsync,
  sync_BC_WindowMakerByWorkOrderAsync,
  updateOnly_AB_WMByWorkOrderAsync,
  updateOnly_BC_WMByWorkOrderAsync,
  fetchWMComment,
  fetchWMBatchNos
};
