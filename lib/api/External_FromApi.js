import utils from "lib/utils";
import { fetcher, FORM_API } from "lib/api/SERVER";

export async function getWindowMakerWorkerOrder(workOrderNo, WM) {
  // WM_AB, WM_BC
  const api = `/estimator/coversheet/Fetch_WMWO_SalesHeader?wo=${workOrderNo}&dbSource=${WM}`;
  const data = await fetcher(api, '', null, FORM_API);
  return { data, DBSource: WM };
}

export async function getAllCWBPCommunityAsync() {
  const api = `/CWBPCommunitys/GetAllCWBPCommunityAsync`;
  const data = await fetcher(api, '', null, 'https://centraportalapi.centra.ca');
  return data;
}

export default {
  getWindowMakerWorkerOrder,
  getAllCWBPCommunityAsync  
};
