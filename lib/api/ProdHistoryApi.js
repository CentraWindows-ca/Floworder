import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT = "/ProdHistory";

export const withHistory = (fn, { logSuccess, logError }) => {
  return async (...args) => {
      try {
          const result = await fn(...args);
          await logSuccess(result, ...args);
          return result;
      } catch (error) {
          await logError(error, ...args);
          throw error; 
      }
  };
}

// =========================== APIs ===========================
const queryWorkOrderHistoryAsync = async ({ masterId, page, pageSize }) => {
  if (masterId) {
    const apiLog = `QueryWorkOrderHistoryAsync`;
    return await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        page,
        pageSize,
      },
    });
  }
  return false;
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

const insertWorkOrderHistoryWhenGetWindowMakerAsync = async ({ masterId }) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenGetWindowMakerAsync?${utils.paramToString(
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

const insertWorkOrderHistoryWhenUploadAttachmentsAsync = async ({
  masterId,
  type,
  attachments,
}) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenUploadAttachmentsAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        type,
        attachments,
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenDeleteAttachmentsAsync = async ({
  masterId,
  type,
  ids,
}) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenDeleteAttachmentsAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        type,
        ids,
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenUndoSoftDeleteAsync = async ({ masterId }) => {
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

const insertWorkOrderHistoryWhenTransitAsync = async ({
  masterId,
  isWindow,
  oldStatus,
  newStatus,
  fields,
  ref,
}) => {
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
        oldStatus,
        newStatus,
        oldTransferredDate: ref?.m_TransferredDate,
        oldTransferredLocation: ref?.m_TransferredLocation,
        oldShippedDate: ref?.m_ShippedDate,
        newTransferredDate: fields?.transferredDate,
        newTransferredLocation: fields?.transferredLocation,
        newShippedDate: fields?.shippedDate,
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenUpdateAsync = async ({
  masterId,
  fields,
  ref,
}) => {
  const workOrderLevelChanges = _.keys(fields)?.map((afKey) => ({
    field: afKey,
    oldValue: ref[afKey]?.toString(),
    newValue: fields[afKey]?.toString(),
  }));

  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenUpdateAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        workOrderLevelChanges,
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenUpdateItemAsync = async ({
  masterId,
  items,
  refItems,
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

        // track all changed fields; record basic fields from existingItem
        itemLevelChanges: items?.map((a) => {
          const existingItem = refItems?.find((it) => it.Id === a.keyValue);
          const { Id, Item, System, SubQty, itemType } = existingItem;

          return {
            itemId: Id,
            itemNo: Item,
            system: System,
            subQty: SubQty,
            itemType,
            fields: _.keys(a.fields)?.map((afKey) => ({
              field: afKey,
              oldValue: existingItem[afKey]?.toString(),
              newValue: a.fields[afKey]?.toString(),
            })),
          };
        }),
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenAddReturnTrip = async ({
  masterId,
  fields,
  refRt,
}) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenAddReturnTrip?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        id: fields.id,
        returnTripDate: fields.returnTripDate,
        returnTripNotes: fields.returnTripNotes,
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenUpdateReturnTripAsync = async ({
  masterId,
  fields,
  refRt,
}) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenUpdateReturnTripAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        updates: [
          {
            id: fields?.recordId,
            newReturnTripNotes: fields?.returnTripNotes,
            newReturnTripDate: fields.returnTripDate,
            oldReturnTripNotes: fields?.oldReturnTripNotes,
            oldReturnTripDate: fields?.oldReturnTripDate,
          },
        ],
      },
    });
  }
  return true;
};

const insertWorkOrderHistoryWhenDeleteReturnTripAsync = async ({
  masterId,
  fields,
  refRt,
}) => {
  if (masterId) {
    const apiLog = `InsertWorkOrderHistoryWhenDeleteReturnTripAsync?${utils.paramToString(
      {},
      true,
    )}`;
    await fetcher(apiLog, ROOT, {
      method: "POST",
      body: {
        masterId,
        ids: [fields.recordId],
      },
    });
  }
  return true;
};

// const deleteLastWorkOrderHistoryAsync = async ({ masterId }) => {
//   if (masterId) {
//     const apiLog = `DeleteLastWorkOrderHistoryAsync?${utils.paramToString(
//       {},
//       true,
//     )}`;
//     await fetcher(apiLog, ROOT, {
//       method: "POST",
//       body: {
//         masterId,
//       },
//     });
//   }
//   return true;
// };

export default {
  queryWorkOrderHistoryAsync,
  insertWorkOrderHistoryWhenCreateAsync,
  insertWorkOrderHistoryWhenGetWindowMakerAsync,
  insertWorkOrderHistoryWhenSoftDeleteAsync,
  insertWorkOrderHistoryWhenUploadAttachmentsAsync,
  insertWorkOrderHistoryWhenDeleteAttachmentsAsync,
  insertWorkOrderHistoryWhenUndoSoftDeleteAsync,
  insertWorkOrderHistoryWhenTransitAsync,
  insertWorkOrderHistoryWhenUpdateAsync,
  insertWorkOrderHistoryWhenUpdateItemAsync,
  // deleteLastWorkOrderHistoryAsync,

  insertWorkOrderHistoryWhenAddReturnTrip,
  insertWorkOrderHistoryWhenUpdateReturnTripAsync,
  insertWorkOrderHistoryWhenDeleteReturnTripAsync
};
