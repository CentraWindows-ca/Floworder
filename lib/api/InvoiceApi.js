import utils from "lib/utils";
import _ from "lodash";
import { fetcher, INVOICE_API } from "lib/api/SERVER";

const ROOT = "/Invoice";

// query
const queryReadInvoicesByPage = async (params, body) => {
  const api = `ReadInvoicesByPage?${utils.paramToString(params, true)}`;

  const res = await fetcher(
    api,
    ROOT,
    {
      method: "POST",
      body,
    },
    INVOICE_API,
  );
  return res?.data;
};

const initReadInvoicesByPage = (params, body) => [
  `ReadInvoicesByPage`,
  ROOT,
  {
    method: "POST",
    body,
  },
  INVOICE_API,
];

const createInvoice = async (
  params,
  { source, masterId, serviceId, actionItemId, fields },
  ref,
) => {
  const api = `CreateInvoice?${utils.paramToString({ ...params }, true)}`;
  const parsedObj = converToString(fields);
  if (_.isEmpty(parsedObj)) return null;

  const orderJSON = JSON.stringify(parsedObj);

  let res, error;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body: {
          source,
          masterId,
          serviceId,
          actionItemId,
          orderJSON,
        },
      },
      INVOICE_API,
    );
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

const updateInvoiceById = async (params, { fields }, ref) => {
  const api = `CreateInvoice?${utils.paramToString({ ...params }, true)}`;
  const parsedObj = converToString(fields);
  if (_.isEmpty(parsedObj)) return null;

  const orderJSON = JSON.stringify(parsedObj);

  let res, error;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body: orderJSON,
      },
      INVOICE_API,
    );
  } catch (err) {
    error = err;
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

const softDeleteInvoice = async (params, body, ref) => {
  const { invoiceId } = ref;
  const api = `DeleteInvoice?invoiceId=${invoiceId}`;
  let res, error;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
      },
      INVOICE_API,
    );
  } catch (err) {
    error = err;
    throw err;
  } finally {
  }

  return res?.data;
};

const hardDeleteInvoice = async (params, body, ref) => {
  const { invoiceId } = ref;
  const api = `DeleteInvoice?invoiceId=${invoiceId}force=true`;
  let res, error;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
      },
      INVOICE_API,
    );
  } catch (err) {
    error = err;
    throw err;
  } finally {
  }

  return res?.data;
};

/*
  UploadFileAsync
  AddCallLogs
  UpdateCallLogsById
  DeleteCallLogs_Notes_FilesById
  AddNotes
  UpdateNotesById;
*/

const converToString = (fields) => {
  return Object.entries(fields).reduce((acc, [key, value]) => {
    acc[key] = value === null ? null : String(value); // Leave null/undefined as-is
    return acc;
  }, {});
};

export default {
  initReadInvoicesByPage,
  queryReadInvoicesByPage,
  createInvoice,
  updateInvoiceById,
  softDeleteInvoice,
  hardDeleteInvoice,
};
