import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT = "/WMCommonQuery";

// ==================== get METHODS
// files

const initGetItemSystemCategories = (params, body) => [
  `GetItemSystemCategories?clearCache=false`,
  ROOT,
  {
    method: "GET",
  },
];

const initGetUIItemLablesByKey = (params, body) => [
  `GetUIItemLablesByKey?clearCache=false`,
  ROOT,
  {
    method: "GET",
  },
];

export default {
  initGetItemSystemCategories,
  initGetUIItemLablesByKey
};
