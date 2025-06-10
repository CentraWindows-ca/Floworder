import utils from "lib/utils";
import { fetcher, CAL_API } from "lib/api/SERVER";

const ROOT = "/GlassLogistic";

export async function getGlassItems(wo, m_DBSource) {
  const province =
    m_DBSource === "WM_AB" ? "AB" : "BC";
  const api = `/GetGlassItems?wo=${wo}&province=${province}`;
  const data = await fetcher(api, ROOT, null, CAL_API);
  return data;
}

export default {
  getGlassItems,
};
