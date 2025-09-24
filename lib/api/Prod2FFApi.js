import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";
import { WORKORDER_MAPPING } from "lib/constants";

const ROOT_FF = "/CWProd2FF";

const SYNC_TO_FF = false; // process.env.NEXT_PUBLIC_ENV === "staging" || process.env.NEXT_PUBLIC_ENV === "deployment" ; // false;
console.log("SYNC_TO_FF:", SYNC_TO_FF);

// ============== GETs
const initGetOptimizedBarAsync = ({ workOrderNo }) => [
  `GetOptimizedBarAsync?${utils.paramToString({ workOrderNo })}`,
  ROOT_FF,
  {
    method: "GET",
  },
];

// ============== UPDATEs
const sync_BC_Order_FF_Async = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;
  const apiLog = `Sync_BC_Order_FF_Async`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });
  return true;
};

const sync_AB_Order_FF_Async = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;
  const apiLog = `Sync_AB_Order_FF_Async`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });
  return true;
};

const sync_optimized_Bar_Async = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);
  console.log("ref:", ref, refBody);
  if (!SYNC_TO_FF) return;

  const apiLog = `Sync_optimized_Bar_Async`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateHeaderAndItems2FFAsync = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);
  if (!SYNC_TO_FF) return;
  const apiLog = `UpdateHeaderAndItems2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });
  return true;
};

const updateHeaderData2FFAsync = async (ref, body) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);
  if (!SYNC_TO_FF) return;

  const apiLog = `UpdateHeaderData2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: {
      ...refBody,
      ...body,
    },
  });

  return true;
};

const updateWinItems2FFAsync = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;
  const apiLog = `UpdateWinItems2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateDoorItems2FFAsync = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;

  const apiLog = `UpdateDoorItems2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateFiles2FFAsync = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;

  const apiLog = `UpdateFiles2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateImages2FFAsync = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;

  const apiLog = `UpdateImages2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const pendingDelete2FFAsync = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;

  const apiLog = `PendingDelete2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const delete2FFAsync = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;

  const apiLog = `Delete2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateStatus2FFAsync = async (ref, body) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;
  const apiLog = `UpdateStatus2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: [
      {
        ...refBody,
        ...body,
      },
    ],
  });

  return true;
};

const updateReturnTrip2FFAsync = async (ref) => {
  if (!isNeedSync(ref)) return true;
  const refBody = getFFParams(ref);

  if (!SYNC_TO_FF) return;

  const apiLog = `UpdateReturnTrip2FFAsync`;
  fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};


const syncInventoryAsync = async (body) => {
  const api = `SyncInventoryAsync`;
  return await fetcher(api, ROOT_FF, {
    method: "POST",
    body,
  });
};

const deleteInventoryAsync = async (ref) => {
  const api = `DeleteInventoryAsync`;
  const refBody = getFFParams(ref);
  return await fetcher(api, ROOT_FF, {
    method: "POST",
    body: refBody,
  });
};

const getFFParams = (ref) => {
  const fields = {
    masterId: ref.m_MasterId,
    actionItemId: ref.m_ActionItemId,
    workOrderNo: ref.m_WorkOrderNo,
    dbSource: ref.m_DBSource,
  };

  _.keys(fields).map((k) => {
    if (!fields[k]) delete fields[k];
  });

  return fields;
};

const isNeedSync = (ref) => {
  const { m_Status } = ref;
  if (m_Status === WORKORDER_MAPPING.Pending.key) {
    return false;
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
  updateStatus2FFAsync,
  updateHeaderAndItems2FFAsync,
  updateReturnTrip2FFAsync,
  syncInventoryAsync,
  deleteInventoryAsync,

  initGetOptimizedBarAsync,
};
