import utils from "lib/utils";
import { fetcher, DRAGONFLY_API } from "lib/api/SERVER";

const ROOT = "/api/Inventory";

const getReportCleanBC = async (workOrderNo, branch) => {
  const params = {workOrderNo, branch}
  const api = `GetCleanBCData?${utils.paramToString(params, true)}`;
  const data = await fetcher(api, ROOT, null, DRAGONFLY_API);
  return data;
};

export default {
  getReportCleanBC,
};
