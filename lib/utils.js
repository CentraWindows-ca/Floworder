
import _ from "lodash";

export const getParams = () => {};

export const tryParse = (json, isDefault = true) => {
  try {
    json = JSON.parse(json);
  } catch (error) {
    json = isDefault ? false : {};
  }

  return json;
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
}

export const parse = function (queryString) {
  var query = {};
  if (!queryString) return "";
  var pairs = (queryString[0] === "?" ? queryString.substr(1) : queryString).split("&");

  for (var i = 0; i < pairs.length; i++) {
    var pair = pairs[i].split("=");
    if (pair[0]) {
      // exclude: {"":""}
      query[decodeURIComponent(pair[0])] = convertIfBoolean(decodeURIComponent(pair[1] || ""));
    }
  }
  return query;
};


export const utils = {
  tryParse,
  parse,
  paramToString,
};

export default utils;
