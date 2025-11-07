import utils from "lib/utils";
import _ from "lodash";
import { fetcher, SERVER, INVOICE_API } from "lib/api/SERVER";

const ROOT = "/Invoice";

// =============================== invoice
const queryReadInvoicesByPage = async (params, body) => {
  const api = `ReadInvoiceOrdersByPage?${utils.paramToString(params, true)}`;

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

const getInvoiceOrderDetails = async (invoiceHeaderId) => {
  const api = `GetInvoiceHeaderDetails?${utils.paramToString(
    {
      invoiceHeaderId,
    },
    true,
  )}`;

  const res = await fetcher(api, ROOT, null, INVOICE_API);

  return res?.data;
};

const initReadInvoicesByPage = (params, body) => [
  `ReadInvoiceOrdersByPage`,
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

  let res;
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
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

const updateInvoiceById = async (params, { invoice, header }, ref) => {
  const api = `UpdateInvoiceById?${utils.paramToString({ ...params }, true)}`;

  const body = {};
  if (invoice) {
    body.invoice = converToString(invoice);
    body.invoice.InvoiceId = ref.inv_invoiceId;
  }

  if (header) {
    body.header = converToString(header);
    body.header.InvoiceHeaderId = ref.invh_invoiceHeaderId;
  }

  let res;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body,
      },
      INVOICE_API,
    );
  } catch (err) {
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

const wrapper_updateInvoiceStatus = async (payload, ref) => {
  return await updateInvoiceById({}, payload, ref);
};

const softDeleteInvoice = async (params, body, ref) => {
  const api = `DeleteInvoice`;
  let res;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body: {
          invoiceId: ref.inv_invoiceId,
          invoiceHeaderId: ref.invh_invoiceHeaderId,
          force: false
        }
      },
      INVOICE_API,
    );
  } catch (err) {
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

const hardDeleteInvoice = async (params, body, ref) => {
  const api = `DeleteInvoice`;
  let res;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body: {
          invoiceId: ref.inv_invoiceId,
          invoiceHeaderId: ref.invh_invoiceHeaderId,
          force: true
        }
      },
      INVOICE_API,
    );
  } catch (err) {
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

// =============================== call logs
//GetCallLogs
const getInvoiceCallLogs = async (invoiceHeaderId) => {
  const body = {
    filters: [
      {
        field: "invoiceHeaderId",
        operator: "=",
        values: [invoiceHeaderId.toString()],
      },
    ],
  };
  const api = `GetCallLogs`;
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

//AddCallLogs
const addInvoiceCallLog = async (params, body, ref) => {
  const api = `AddCallLogs`;
  let res;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body: {
          ...body,
          invoiceHeaderId: ref.invh_invoiceHeaderId,
        },
      },
      INVOICE_API,
    );
  } catch (err) {
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

//UpdateCallLogsById
const updateInvoiceCallLog = async (params, body, ref) => {
  const api = `UpdateCallLogsById`;
  let res;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body,
      },
      INVOICE_API,
    );
  } catch (err) {
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

//DeleteCallLogsById
const deleteCallLogsById = async ({ id }) => {
  const api = `DeleteCallLogsById`;
  let res;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body: {
          id,
        },
      },
      INVOICE_API,
    );
  } catch (err) {
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

// =============================== notes
// GetNotes
const getInvoiceNotes = async (invoiceHeaderId) => {
  const body = {
    filters: [
      {
        field: "invoiceHeaderId",
        operator: "=",
        values: [invoiceHeaderId.toString()],
      },
    ],
  };
  const api = `GetNotes`;
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

// AddNotes
const addInvoiceNotes = async (params, body, ref) => {
  const api = `AddNotes`;
  const res = await fetcher(
    api,
    ROOT,
    {
      method: "POST",
      body: {
        ...body,
        invoiceHeaderId: ref.invh_invoiceHeaderId,
      },
    },
    INVOICE_API,
  );
  return res?.data;
};

// UpdateNotesById
const updateInvoiceNotes = async (params, body, ref) => {
  const api = `UpdateNotesById`;
  let res;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body,
      },
      INVOICE_API,
    );
  } catch (err) {
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};

// DeleteNotesById
const deleteNotesById = async ({ id }) => {
  const api = `DeleteNotesById`;
  let res;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body: {
          id,
        },
      },
      INVOICE_API,
    );
  } catch (err) {
    throw err;
  } finally {
    // sync to history
  }

  return res?.data;
};
// =============================== files
// Invoice/GetInvoiceUploadFiles
const getInvoiceUploadFiles = async (invoiceHeaderId) => {
  const body = {
    filters: [
      {
        field: "invoiceHeaderId",
        operator: "=",
        values: [invoiceHeaderId.toString()],
      },
    ],
  };
  const api = `GetInvoiceUploadFiles`;
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

//Invoice/GetUploadFileStreamById
const urlGetFile = (params) => {
  const api = `${INVOICE_API}${ROOT}/GetUploadFileStreamById?${utils.paramToString(params, true)}`;
  return api;
};

// UploadFileAsync
const uploadFileAsync = async (params, body, ref) => {
  const api = `UploadFile`;
  const formData = new FormData();

  _.keys(body)?.map((k) => {
    if (body[k]) {
      formData.append(k, body[k]);
    }
  });

  let res;
  try {
    res = await fetcher(
      api,
      ROOT,
      {
        method: "POST",
        body: formData,
      },
      INVOICE_API,
    );
  } catch (err) {
    throw err;
  } finally {
    // sync to history
  }

  return res;
};

// DeleteUploadFilesById
const deleteUploadFileByIdAsync = async (params, body, ref) => {
  const api = `DeleteUploadFilesById?${utils.paramToString({ ...params }, true)}`;
  let res;
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
    throw err;
  } finally {
    // sync to history
  }

  return res;
};

const getInvoiceHistory = async (invoiceHeaderId) => {
  const body = {
    filters: [
      // this is how we categorize history data
      {
        field: "TableName",
        operator: "=",
        values: ["InvoiceHeader"],
        logic: "AND",
      },
      {
        field: "RecordId",
        operator: "=",
        values: [invoiceHeaderId.toString()],
      },
    ],
  };
  const api = `QueryHistoryLog`;
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
  wrapper_updateInvoiceStatus,
  softDeleteInvoice,
  hardDeleteInvoice,
  getInvoiceOrderDetails,

  // call logs
  getInvoiceCallLogs,
  addInvoiceCallLog,
  updateInvoiceCallLog,
  deleteCallLogsById,

  // notes
  getInvoiceNotes,
  addInvoiceNotes,
  updateInvoiceNotes,
  deleteNotesById,

  // files
  getInvoiceUploadFiles,
  urlGetFile,
  uploadFileAsync,
  deleteUploadFileByIdAsync,

  // history
  getInvoiceHistory
};
