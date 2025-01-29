import utils from "lib/utils";
import { fetcher, FORM_API } from "lib/api/SERVER";

const ROOT = "/estimator/coversheet";

export async function getWindowMakerWorkerOrder(workOrderNo, WM) {
// WM_AB, WM_BC
  const api = `/Fetch_WMWO_SalesHeader?wo=${workOrderNo}&dbSource=${WM}`;
  const data = await fetcher(api, ROOT, null, FORM_API);
  return data;
}

export default {
  getWindowMakerWorkerOrder,
};

