import { INVOICE_TRANSFER_FIELDS } from "lib/constants";
import _ from "lodash";

const flattenResWithPrefix = (res) => {
  const { invoice, header } = res;
  let { orderJSON, ...otherInvoice } = invoice || {};

  try {
    orderJSON = JSON.parse(orderJSON);
  } catch (error) {
    // noop
    orderJSON = {};
  }
  const _prefixed_invoice = {}; // inv_
  const _prefixed_order = {}; // m_
  const _prefixed_header = {}; // invh_

  _.keys(otherInvoice)?.map((k) => {
    _prefixed_invoice[`inv_${k}`] = otherInvoice[k];
  });
  _.keys(orderJSON)?.map((k) => {
    _prefixed_order[`m_${k}`] = orderJSON[k];
  });
  _.keys(header)?.map((k) => {
    _prefixed_header[`invh_${k}`] = header[k];
  });
  // ==== assemble, add prefix

  return {
    ..._prefixed_invoice,
    ..._prefixed_order,
    ..._prefixed_header,
  };
};

const assemblePrefixedObjToPayload = (mergedData, initData) => {
  // Helpers
  const strip = (prefix, key) => key.slice(prefix.length);
  const hasKeys = (obj) => Object.keys(obj).length > 0;

  // 1) Rebuild partial invoice/header from changed fields
  const invoice = {};
  const header = {};

  _.keys(mergedData)?.forEach((k) => {
    if (k.startsWith("inv_")) {
      invoice[strip("inv_", k)] = mergedData[k];
    } else if (k.startsWith("invh_")) {
      header[strip("invh_", k)] = mergedData[k];
    }
  });

  // 2) Rebuild orderJSON by merging:
  //    base := all m_* from initData  + overrides := m_* from mergedData
  //    (optional) if mergedData.orderJSON is a string, parse and merge too
  const baseOrder = {};
  _.keys(initData)?.forEach((k) => {
    if (k.startsWith("m_")) baseOrder[strip("m_", k)] = initData[k];
  });

  let hasMChanges = false;
  _.keys(mergedData)?.forEach((k) => {
    if (k.startsWith("m_")) {
      baseOrder[strip("m_", k)] = mergedData[k];
      hasMChanges = true;
    }
  });

  // If caller also passed a full orderJSON string, parse & merge (last writer wins = mergedData)
  if (typeof mergedData.orderJSON === "string" && mergedData.orderJSON.trim()) {
    try {
      const parsed = JSON.parse(mergedData.orderJSON);
      Object.assign(baseOrder, parsed);
      hasMChanges = true; // we will send orderJSON
    } catch (e) {
      // noop: ignore invalid JSON string
    }
  }

  // 3) Assemble minimal payload
  const payload = {};
  if (hasKeys(invoice)) payload.invoice = invoice;
  if (hasKeys(header)) payload.header = header;
  if (hasMChanges)
    _.set(payload, ["invoice", "orderJSON"], JSON.stringify(baseOrder));
  return payload;
};

const getStatusPayload = async (data, newStatus, initData, requestData) => {
  const {} = data;
  let _changedData = {
    invh_invoiceStatus: newStatus,
  };

  // different target has different required fields
  const missingFields = INVOICE_TRANSFER_FIELDS?.[newStatus] || {};

  if (!_.isEmpty(missingFields)) {
    const moreFields = await requestData(missingFields);
    // cancel
    if (moreFields === null) return null;
    _changedData = { ..._changedData, ...moreFields };
  }

  const _payload = assemblePrefixedObjToPayload(
    _changedData,
    initData,
  );
  return _payload;
};

export default {
  flattenResWithPrefix,
  assemblePrefixedObjToPayload,
  getStatusPayload
};
