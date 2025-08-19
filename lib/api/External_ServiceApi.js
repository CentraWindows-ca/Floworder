import utils from "lib/utils";
import { fetcher, SERVICE_API } from "lib/api/SERVER";

const getSiteLockoutByMasterId = async (params, body) => {
  try {
    const api = `GetSiteLockoutByMasterId?${utils.paramToString(params, true)}`;
    const res = await fetcher(api, "/SiteLockout", null, SERVICE_API);

    if (res?.message) {
      console.log(res?.message);
    }

    return res?.data;
  } catch (error) {
    console.log(error)
  }
};

export default {
  getSiteLockoutByMasterId,
};
