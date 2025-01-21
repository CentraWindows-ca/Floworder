import utils from "lib/utils";
import { fetcher, FORM_API } from "lib/api/SERVER";

const ROOT = "/estimator/coversheet";

export async function getWindowMakerWorkerOrder(workOrderNo, manufacturingFacility) {
  const dbSource =
    manufacturingFacility?.toLowerCase() === "calgary" ? "WM_AB" : "WM_BC";

  const api = `/Fetch_WMWO_SalesHeader?wo=${workOrderNo}&dbSource=${dbSource}`;
  const data = await fetcher(api, ROOT, null, FORM_API);
  return data;
}

export default {
  getWindowMakerWorkerOrder,
};

