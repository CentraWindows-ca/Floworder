import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT = "/WMCommonQuery";

// ==================== get METHODS
// files

const initGetItemSystemCatgories = (params, body) => [
  `GetItemSystemCatgories`,
  ROOT,
  {
    method: "GET",
  },
];

export default {
  initGetItemSystemCatgories,
};
