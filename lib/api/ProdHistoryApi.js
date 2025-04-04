import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT = "/ProdHistory";

const queryWorkOrderHistoryAsync = async ({ masterId, page, pageSize }) => {
  if (masterId) {
    const apiLog = `QueryWorkOrderHistoryAsync`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        page,
        pageSize,
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenCreateAsync = async ({ masterId }) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenCreateAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenSoftDeleteAsync = async ({ masterId }) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenSoftDeleteAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenUndoSoftDeleteAsync = async (
  { masterId },
) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenUndoSoftDeleteAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenTransitAsync = async (
  { masterId, isWindow, newStatus },
) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenTransitAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        isWindow,
        newStatus,
      },
    });
  }
  return true;
};


const insertWorkOrderHistoryWhenUpdateAsync = async ({ 
  masterId,
  fields,
}) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenUpdateAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        fields,
      },
    });
  }
  return true;
};

const insertItemHistoryWhenUpdateAsync = async ({}, { 
  masterId,
  fields,
  itemId
}) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenUpdateAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        fields,
        itemId
      },
    });
  }
  return true;
};

const deleteLastWorkOrderHistoryAsync = async ({}, { masterId }) => {
  if (masterId) {
    const apiLog = `DeleteLastWorkOrderHistoryAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
      },
    });
  }
  return true;
};

export default {
  queryWorkOrderHistoryAsync,
  insertWorkOrderHistoryWhenCreateAsync,
  insertWorkOrderHistoryWhenSoftDeleteAsync,
  insertWorkOrderHistoryWhenUndoSoftDeleteAsync,
  insertWorkOrderHistoryWhenTransitAsync,
  insertWorkOrderHistoryWhenUpdateAsync,
  insertItemHistoryWhenUpdateAsync,
  deleteLastWorkOrderHistoryAsync,
};
