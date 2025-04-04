import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT_FF = "/CWProd2FF";

const SYNC_TO_FF = true//process.env.NEXT_PUBLIC_ENV === "staging"; // false;
console.log("SYNC_TO_FF:", SYNC_TO_FF);

const initGetOptimizedBarAsync = ({ workOrderNo }) => [
  `GetOptimizedBarAsync?${utils.paramToString({ workOrderNo })}`,
  ROOT_FF,
  {
    method: "GET",
  },
];

const sync_BC_Order_FF_Async = async ({ workOrderNo, masterId }) => {
  if (!SYNC_TO_FF) return;
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
  if (!SYNC_TO_FF) return;
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

const sync_optimized_Bar_Async = async ({ workOrderNo, masterId }) => {
  // if (!SYNC_TO_FF) return;
  if (masterId) {
    const apiLog = `Sync_optimized_Bar_Async?${utils.paramToString(
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
  if (!SYNC_TO_FF) return;
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
  if (!SYNC_TO_FF) return;
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
  if (!SYNC_TO_FF) return;
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
  if (!SYNC_TO_FF) return;
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
  if (!SYNC_TO_FF) return;
  if (masterId) {
    const apiLog = `UpdateImages2FFAsync`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body: { masterId },
    });
  }

  return true;
};

const pendingDelete2FFAsync = async ({ masterId }) => {
  if (!SYNC_TO_FF) return;
  if (masterId) {
    const apiLog = `PendingDelete2FFAsync`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body: { masterId },
    });
  }

  return true;
};

const delete2FFAsync = async ({ masterId, actionItemId }) => {
  if (!SYNC_TO_FF) return;
  if (masterId && actionItemId) {
    const apiLog = `delete2FFAsync`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body: { masterId, actionItemId },
    });
  }

  return true;
};

// NOTE: not used now
const updateCallLogs2FFAsync = async ({ masterId }) => {
  if (!SYNC_TO_FF) return;
  if (masterId) {
    const apiLog = `UpdateCallLogs2FFAsync`;
    await fetcher(apiLog, ROOT_FF, {
      method: "POST",
      body: { masterId },
    });
  }

  return true;
};

export default {
  sync_BC_Order_FF_Async,
  sync_AB_Order_FF_Async,
  sync_optimized_Bar_Async,
  updateHeaderData2FFAsync,
  updateWinItems2FFAsync,
  updateDoorItems2FFAsync,
  updateFiles2FFAsync,
  updateImages2FFAsync,
  pendingDelete2FFAsync,
  delete2FFAsync,

  initGetOptimizedBarAsync,
};
