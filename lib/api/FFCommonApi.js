import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT = "/FFCommonQuery";

// ==================== get METHODS
// files

const initGetSalesReps = (params, body) => [
  `GetSalesReps`,
  ROOT,
  {
    method: "GET",
  },
];

const initGetProjectManagers = (params, body) => [
  `GetProjectManagers`,
  ROOT,
  {
    method: "GET",
  },
];

const initGetFFGlassSuppliers = (params, body) => [
  `GetFFGlassSuppliers`,
  ROOT,
  {
    method: "GET",
  },
];

const initGetFFGlassOptions = (params, body) => [
  `GetFFGlassOptions`,
  ROOT,
  {
    method: "GET",
  },
];

export default {
  initGetSalesReps,
  initGetProjectManagers,
  initGetFFGlassSuppliers,
  initGetFFGlassOptions,
};
