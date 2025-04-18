import _ from "lodash";
import { parse as parseDateFns, parseISO, formatISO, format } from "date-fns";

export const getParams = () => {};

export const tryParse = (json, isDefault = true) => {
  try {
    json = JSON.parse(json);
  } catch (error) {
    json = isDefault ? false : {};
  }

  return json;
};

export const getOrderKind = (data) => {
  let isWindow = false;
  let isDoor = false;
  if (
    data?.m_NumberOfWindows ||
    data?.m_NumberOfPatioDoors ||
    data?.m_NumberOfOthers
  ) {
    isWindow = true;
  }

  if (data?.m_NumberOfDoors || data?.m_NumberOfSwingDoors) {
    isDoor = true;
  }

  if (isWindow && !isDoor) return "w";
  if (!isWindow && isDoor) return "d";
  if (isWindow && isDoor) return "m";
};

export const paramToString = (obj, keepEmptyString = false) => {
  return _.keys(obj)
    .map((k) => {
      if (obj[k] || keepEmptyString) {
        return `${[k]}=${obj[k]}`;
      } else {
        return "";
      }
    })
    .join("&");
};

const convertIfBoolean = (value) => {
  if (value === "true") return true;
  if (value === "false") return false;
  return value;
};

export const parse = function (queryString) {
  var query = {};
  if (!queryString) return "";
  var pairs = (
    queryString[0] === "?" ? queryString.substr(1) : queryString
  ).split("&");

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    if (pair[0]) {
      // exclude: {"":""}
      query[decodeURIComponent(pair[0])] = convertIfBoolean(
        decodeURIComponent(pair[1] || ""),
      );
    }
  }
  return query;
};

export const formatCurrency2Decimal = (value, prefix = "$") => {
  if (!value) return "--"
  let str = formatNumber(value)
  str = String(str); // Ensure it's a string
  return str.includes(".") ? str : `${prefix}${str}.00`;
};

export const formatNumber = (num, placeholder = "--") => {
  if (!num) return placeholder;
  // Convert number to string and split it by the decimal point
  let [wholePart, decimalPart] = num.toString().split(".");

  // Add commas as thousands separators for the whole part
  wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  // If there's a decimal part, ensure it's two digits by padding with zero
  if (decimalPart) {
    decimalPart = (decimalPart + "0").slice(0, 2);
  }

  // Combine the whole part and decimal part (if exists)
  return decimalPart ? `${wholePart}.${decimalPart}` : wholePart;
};

export const formatNumberRoundToInteger = (num) => {
  let roundNum = Math.round(num);
  // Convert number to string and split it by the decimal point
  let [wholePart, decimalPart] = roundNum.toString().split(".");

  // Add commas as thousands separators for the whole part
  wholePart = wholePart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return wholePart;
};

const formatDate = (str, mask="yyyy-MM-dd HH:mm", id) => {
  if (!str) return null;

  const dateTime = parseISO(datetimeFromUTCToLocal(str, id));
  return format(dateTime, mask);
};

const calculateFileSize = (base64Data) => {
  // Remove padding characters (=) at the end
  const padding = (base64Data.match(/=/g) || []).length;
  // Calculate the Base64 string length without padding
  const base64Length = base64Data.length;
  // Calculate the file size in bytes
  const fileSizeInBytes = (base64Length * 3) / 4 - padding;
  return fileSizeInBytes;
};

const downloadFile = (base64Data, filename, mimeType) => {
  // Convert Base64 to binary data
  const binaryData = atob(base64Data); // Decodes the Base64 string
  const byteNumbers = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    byteNumbers[i] = binaryData.charCodeAt(i);
  }

  // Create a Blob from the binary data
  const blob = new Blob([byteNumbers], { type: mimeType });

  // Create a temporary URL and trigger download
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename; // Specify the filename for the downloaded file
  link.click();

  // Clean up the URL
  URL.revokeObjectURL(blobUrl);
};

const findChanges = (a, b) => {
  return _.reduce(
    b,
    (result, value, key) => {
      if (!_.isEqual(a[key], value)) {
        result[key] = value;
      }
      return result;
    },
    {},
  );
};

const datetimeFromUTCToLocal = (utcStr, id) => {
  try {
    if (!utcStr) return null;
    // Add 'Z' to treat it as UTC
    const safeUtcStr = utcStr.endsWith('Z') ? utcStr : utcStr + 'Z';
    const date = parseISO(safeUtcStr);
  
    // format automatically outputs in local time
    return format(date, "yyyy-MM-dd'T'HH:mm:ss");
  } catch (error) {
    console.log("error time convert:", id)
    throw error 
  }
};

const datetimeFromLocalToUTC = (str) => {
  const localDate = parseDateFns(str, "yyyy-MM-dd'T'HH:mm:ss", new Date());

  // convert local time to UTC
  const utcDate = new Date(
    localDate.getTime() - localDate.getTimezoneOffset() * 60000,
  );
  const utcStr = format(utcDate, "yyyy-MM-dd'T'HH:mm:ss");

  return utcStr;
};

export const utils = {
  tryParse,
  parse,
  paramToString,
  getOrderKind,
  formatCurrency2Decimal,
  formatNumber,
  formatNumberRoundToInteger,
  formatDate,
  datetimeFromUTCToLocal,
  datetimeFromLocalToUTC,
  calculateFileSize,
  downloadFile,
  findChanges,
};

export default utils;
