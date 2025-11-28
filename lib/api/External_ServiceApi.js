import utils from "lib/utils";
import { fetcher, SERVICE_API } from "lib/api/SERVER";

const getSiteLockoutByMasterId = async (params, body) => {
  try {
    const api = `GetSiteLockoutByMasterId?${utils.paramToString(params, true)}`;
    const res = await fetcher(api, "/SiteLockout", null, SERVICE_API);
    return res?.data;
  } catch (error) {
    console.log(error)
  }
};

const getServicesByMasterId = async (params, body) => {
  try {
    const api = `GetLinkedServiceByMasterId?${utils.paramToString(params, true)}`;
    const res = await fetcher(api, "/Service", null, SERVICE_API);
    return res?.data;
  } catch (error) {
    console.log(error)
  }
};

const getServicesPaginated = async (params, body) => {
  try {
    const api = `GetServicesPaginated?${utils.paramToString(params, true)}`;
    const res = await fetcher(api, "/Service", null, SERVICE_API);

    if (res?.message) {
      console.log(res?.message);
    }

    return res;
  } catch (error) {
    console.log(error)
  }
};

const dynamicQuerySiteLockoutByPages = async (params, body) => {
  try {
    const api = `DynamicQuerySiteLockoutByPages?${utils.paramToString(params, true)}`;
    const res = await fetcher(api, "/SiteLockout", {
      method: "POST",
      body
    }, SERVICE_API);

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
  getServicesPaginated,
  getServicesByMasterId,
  dynamicQuerySiteLockoutByPages
};
