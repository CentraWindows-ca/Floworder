import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT_FF = "/CWProd2FF";

const SYNC_TO_FF = process.env.NEXT_PUBLIC_ENV === "staging"; // false;
console.log("SYNC_TO_FF:", SYNC_TO_FF);

// delete WO
/*
    /CWProd2FF/Sync_BC_Order_FF_Async
    /CWProd2FF/Sync_AB_Order_FF_Async
    /CWProd2FF/UpdateHeaderData2FFAsync
    /CWProd2FF/UpdateWinItems2FFAsync
    /CWProd2FF/UpdateDoorItems2FFAsync
    /CWProd2FF/UpdateFiles2FFAsync
    /CWProd2FF/UpdateImages2FFAsync
    /CWProd2FF/UpdateCallLogs2FFAsync
*/

const sync_BC_Order_FF_Async = async ({ workOrderNo, masterId }) => {
  if (masterId) {
    const apiLog = `Sync_BC_Order_FF_Async?${utils.paramToString(
      {
        workOrderNo,
        masterId,
      },
      true,
    )}`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
    });
  }

  return true;
};

const sync_AB_Order_FF_Async = async ({ workOrderNo, masterId }) => {
  if (masterId) {
    const apiLog = `Sync_AB_Order_FF_Async?${utils.paramToString(
      {
        workOrderNo,
        masterId,
      },
      true,
    )}`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
    });
  }

  return true;
};

const updateHeaderData2FFAsync = async ({ workOrderNo, masterId }, body) => {
  if (masterId) {
    const apiLog = `UpdateHeaderData2FFAsync?${utils.paramToString(
      {
        workOrderNo,
        masterId,
      },
      true,
    )}`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body,
    });
  }

  return true;
};

const updateWinItems2FFAsync = async ({ masterId }) => {
  if (masterId) {
    const apiLog = `UpdateWinItems2FFAsync`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body: { masterId },
    });
  }

  return true;
};

const updateDoorItems2FFAsync = async ({ masterId }) => {
  if (masterId) {
    const apiLog = `UpdateDoorItems2FFAsync`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body: { masterId },
    });
  }

  return true;
};

const updateFiles2FFAsync = async ({ masterId }) => {
  if (masterId) {
    const apiLog = `UpdateFiles2FFAsync`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body: { masterId },
    });
  }

  return true;
};

const updateImages2FFAsync = async ({ masterId }) => {
  if (masterId) {
    const apiLog = `UpdateImages2FFAsync`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body: { masterId },
    });
  }

  return true;
};

// NOTE: not used now
const updateCallLogs2FFAsync = async ({ masterId }) => {
  if (masterId) {
    const apiLog = `UpdateCallLogs2FFAsync`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body: { masterId },
    });
  }

  return true;
};

const converToString = (fields) => {
  return Object.entries(fields).reduce((acc, [key, value]) => {
    acc[key] = value == null ? "" : String(value); // Leave null/undefined as-is
    return acc;
  }, {});
};

export default {
  sync_BC_Order_FF_Async,
  sync_AB_Order_FF_Async,
  updateHeaderData2FFAsync,
  updateWinItems2FFAsync,
  updateDoorItems2FFAsync,
  updateFiles2FFAsync,
  updateImages2FFAsync
};
