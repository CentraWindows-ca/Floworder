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
  const data = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });

  const masterId = data.masterId

  // sync back to FF
  await Prod2FFApi.sync_AB_Order_FF_Async({
    m_MasterId: masterId,
  });

  // sync to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenCreateAsync({
    masterId,
  });

  return data;
};

const sync_BC_WindowMakerByWorkOrderAsync = async (params, body, ref) => {
  const api = `Sync_BC_WindowMakerByWorkOrderAsync?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });

  const masterId = data.masterId
  // sync back to FF
  await Prod2FFApi.sync_BC_Order_FF_Async({
    m_MasterId: masterId,
  });

  // sync to history
  await ProdHistoryApi.insertWorkOrderHistoryWhenCreateAsync({
    masterId,
  });

  return data;
};

// when update from WindowMaker
const updateOnly_AB_WMByWorkOrderAsync = async (params, body, ref) => {
  const api = `UpdateOnly_AB_WMByWorkOrderAsync?${utils.paramToString(params, true)}`;

  const masterId = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });

  // sync back to FF
  await Prod2FFApi.updateHeaderAndItems2FFAsync(ref);

  return masterId;
};

const updateOnly_BC_WMByWorkOrderAsync = async (params, body, ref) => {
  const api = `UpdateOnly_BC_WMByWorkOrderAsync?${utils.paramToString(params, true)}`;

  const masterId = await fetcher(api, ROOT, {
    method: "POST",
    body,
  });

  // sync back to FF
  await Prod2FFApi.updateHeaderAndItems2FFAsync(ref);

  return masterId;
};

export default {
  sync_AB_WindowMakerByWorkOrderAsync,
  sync_BC_WindowMakerByWorkOrderAsync,
  updateOnly_AB_WMByWorkOrderAsync,
  updateOnly_BC_WMByWorkOrderAsync,
};
