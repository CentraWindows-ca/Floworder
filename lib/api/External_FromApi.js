import utils from "lib/utils";
import { fetcher, FORM_API } from "lib/api/SERVER";

export async function getWindowMakerWorkerOrder(workOrderNo, WM) {
  // WM_AB, WM_BC
  const api = `/estimator/coversheet/Fetch_WMWO_SalesHeader?wo=${workOrderNo}&dbSource=${WM}`;
  const data = await fetcher(api, '', null, FORM_API);
  return { data, dbSource: WM };
}

export async function getMFSOPart3andPart9() {
  // WM_AB, WM_BC
  const api = `/estimator/coversheet/Fetch_Forms_MFSOPart3AndPart9_Paginated`;
  const res = await fetcher(api, '', null, FORM_API);
  return res?.data;
}

export async function getAllCWBPCommunityAsync() {
  const api = `/CWBPCommunitys/GetAllCWBPCommunityAsync`;
  const data = await fetcher(api, '', null, FORM_API);
  return data;
}

export default {
  getWindowMakerWorkerOrder,
  getAllCWBPCommunityAsync,
  getMFSOPart3andPart9
};
