import utils from "lib/utils";
import { fetcher } from "lib/api/SERVER";

const ROOT = "/Orders";

const initGetOrders = (params) => {
  return [`GetOrders?${utils.paramToString(params, true)}`, ROOT];
};


const getOrders = async (params) => {
  const api = `GetOrders?${utils.paramToString(params, true)}`;

  const data = await fetcher(api, ROOT);
  return data;
};

export default {
  getOrders,
  initGetOrders
};
