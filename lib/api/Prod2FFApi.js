import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT_FF = "/CWProd2FF";

const SYNC_TO_FF = process.env.NEXT_PUBLIC_ENV === "staging" || process.env.NEXT_PUBLIC_ENV === "deployment" || ; // false;
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
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;
  const apiLog = `Sync_BC_Order_FF_Async`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });
  return true;
};

const sync_AB_Order_FF_Async = async (ref) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;
  const apiLog = `Sync_AB_Order_FF_Async`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });
  return true;
};

const sync_optimized_Bar_Async = async (ref) => {
  const refBody = getFFParams(ref);
  console.log("ref:", ref, refBody);
  if (!SYNC_TO_FF) return;

  const apiLog = `Sync_optimized_Bar_Async`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateHeaderAndItems2FFAsync = async (ref) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;
  const apiLog = `UpdateHeaderAndItems2FFAsync`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });
  return true;
};

const updateHeaderData2FFAsync = async (ref, body) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;

  const apiLog = `UpdateHeaderData2FFAsync`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: {
      ...refBody,
      ...body,
    },
  });

  return true;
};

const updateWinItems2FFAsync = async (ref) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;
  const apiLog = `UpdateWinItems2FFAsync`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateDoorItems2FFAsync = async (ref) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;

  const apiLog = `UpdateDoorItems2FFAsync`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateFiles2FFAsync = async (ref) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;

  const apiLog = `UpdateFiles2FFAsync`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateImages2FFAsync = async (ref) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;

  const apiLog = `UpdateImages2FFAsync`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const pendingDelete2FFAsync = async (ref) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;

  const apiLog = `PendingDelete2FFAsync`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const delete2FFAsync = async (ref) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;

  const apiLog = `delete2FFAsync`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: refBody,
  });

  return true;
};

const updateStatus2FFAsync = async (ref, body) => {
  const refBody = getFFParams(ref);
  console.log("ref:", refBody);
  if (!SYNC_TO_FF) return;
  const apiLog = `UpdateStatus2FFAsync`;
  await fetcher(apiLog, ROOT_FF, {
    method: "POST",
    body: {
      ...refBody,
      ...body,
    },
  });

  return true;
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

  initGetOptimizedBarAsync,
};
