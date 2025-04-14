import utils from "lib/utils";
import _ from "lodash";
import { fetcher } from "lib/api/SERVER";

const ROOT = "/ProdHistory";

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
    oldValue: ref[afKey],
    newValue: fields[afKey],
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
              oldValue: existingItem[afKey],
              newValue: a.fields[afKey],
            })),
          };
        }),
      },
    });
  }
  return true;
};

const insertItemHistoryWhenUpdateAsync = async (
  {},
  { masterId, fields, itemId },
) => {
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
        itemId,
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
  insertWorkOrderHistoryWhenUploadAttachmentsAsync,
  insertWorkOrderHistoryWhenDeleteAttachmentsAsync,
  insertWorkOrderHistoryWhenUndoSoftDeleteAsync,
  insertWorkOrderHistoryWhenTransitAsync,
  insertWorkOrderHistoryWhenUpdateAsync,
  insertWorkOrderHistoryWhenUpdateItemAsync,
  insertItemHistoryWhenUpdateAsync,
  deleteLastWorkOrderHistoryAsync,
};
