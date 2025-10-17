import axios from "axios";

const IS_DUMMY = false;

let PORTAL_SERVER = "http://localhost:3000";
let SERVER = "https://localhost:7152";
let NEXT_API_SERVER = "http://localhost:1720";
let FF_API_SERVER = "https://flowfinityproxy.centra.ca";
let PORTAL_WEBCAL = "https://calendar.centra.ca";
let CAL_API = "https://calendarapi.centra.ca";
let FORM_API = "https://devformsapi.centrawindows.com";
let SERVICE_API = "https://staging-servicesapi.centra.ca";
let INVOICE_API = "http://invoice.centrawindows.com"

// node: convention of CRA, all customized env should prefix with "REACT_APP_" e.g. process.env.REACT_APP_HELLO
if (process.env.NEXT_PUBLIC_ENV === "development") {
  // SERVER = "https://ordersapi.centra.ca";
  SERVER = "https://staging-ordersapi.centra.ca";
  CAL_API = "https://staging-webcalendar-api.centra.ca";
  FORM_API = "https://centraportalapi.centra.ca";
  // SERVER = "https://localhost:7152";
  // SERVER = IS_DUMMY ? PORTAL_SERVER : SERVER;
  // SERVER = "https://dragonflyapi.centra.ca";
  // NEXT_API_SERVER = "http://10.201.76.143:1520";
  // FORM_API = "https://localhost:7247"

  SERVICE_API = "https://staging-servicesapi.centra.ca";
  PORTAL_WEBCAL = "https://staging-calendar.centra.ca";
}

if (process.env.NEXT_PUBLIC_ENV === "staging") {
  SERVER = "https://staging-ordersapi.centra.ca";
  NEXT_API_SERVER = "https://staging-production.centra.ca";
  FORM_API = "https://devformsapi.centrawindows.com";
  SERVICE_API = "https://staging-servicesapi.centra.ca";
  CAL_API = "https://staging-webcalendar-api.centra.ca";
}

if (process.env.NEXT_PUBLIC_ENV === "production") {
  SERVER = "https://ordersapi.centra.ca";
  NEXT_API_SERVER = "https://production.centra.ca";
  FORM_API = "https://centraportalapi.centra.ca";
  SERVICE_API = "https://servicesapi.centra.ca";
}

const timeout = 99999999999999999999999999;

const USER_KEY = "userkey";
const MSBC_TOKEN = "msbc_token";
const APP_NAME = "Production Order Management";

export { USER_KEY, MSBC_TOKEN };

export const authFetcher = async (url, root) => {
  const res = await _createRequest(root).get(url);
  return res?.data;
};

// fetch from our API
export const fetcher = async (url, root, options, _server = SERVER) => {
  // fetch(SERVER + root + url).then((res) => res.json())
  const { method, body } = options || { method: "GET" };
  let res = null;
  switch (method) {
    case "GET":
      res = await _createRequestPublic(root, _server).get(url);
      break;
    case "POST":
      res = await _createRequestPublic(root, _server).post(url, body);
    default:
      break;
  }

  return res?.data;
};

export const fetcherNext = async (url, root, options) => {
  const { method, body } = options || { method: "GET" };
  let res = null;
  switch (method) {
    case "GET":
      res = await _createRequestNext(root).get(url);
      break;
    case "POST":
      res = await _createRequestNext(root).post(url, body);
    default:
      break;
  }

  return res?.data;
};

export const fetcherMulti = async (...urls) => {
  const resArr = await Promise.all(
    urls.map(([url, root, options]) => {
      return fetcher(url, root, options);
    }),
  );
  return resArr;
};

export const fetcherMsbc = async (url, root) => {
  const res = await _createRequest(root, MSBC_TOKEN, true).get(url);
  return res?.data;
};

// fetch from 3rd party API from internet
export const fetcherExternal = (url) => fetch(url).then((res) => res.json());

export const fetcherBasicToken = async (url, user, pw) => {
  const res = await _createRequestBasicToken("", user, pw).get(url);
  return res?.data;
};

export const fetcherProxy = (url) => {
  const proxyUrl = FF_API_SERVER;

  return fetch(proxyUrl, {
    headers: {
      url: url, // Custom header with the actual API URL
    },
  }).then((res) => {
    if (!res.ok) {
      throw new Error("Network response was not ok");
    }
    return res.json();
  });
};

const getHeaders = (tokenKey) => {
  if (typeof window !== "undefined") {
    const { token } = JSON.parse(localStorage.getItem(tokenKey) || "{}");

    const user_email = localStorage.getItem("user_email");

    return {
      Authorization: token ? `Bearer ${token}` : "",
      ["centra-login-email"]: user_email,
      ["centra-app-name"]: APP_NAME,
    };
  }
};

const getHeadersBasicToken = (user, pw) => {
  if (typeof window !== "undefined") {
    const username = user;
    const password = pw;
    const base64Credentials = Buffer.from(`${username}:${password}`).toString(
      "base64",
    );
    return { Authorization: `Basic ${base64Credentials}` };
  }
};

const _createRequest = (
  defaultRoute,
  tokenKey = USER_KEY,
  isThirdParty = false,
) => {
  axios.defaults.params = { m: Math.random(), t: new Date().getTime() };
  const request = axios.create({
    baseURL: (isThirdParty ? "" : SERVER) + defaultRoute,
    timeout,
    headers: getHeaders(tokenKey),
  });

  request.interceptors.request.use((req) => {
    const { token } = JSON.parse(localStorage.getItem(tokenKey) || "{}");
    req.headers.Authorization = token ? `Bearer ${token}` : "";
    req.headers["Cache-Control"] = "no-cache";

    return req;
  });

  request.interceptors.response.use(
    (response) => {
      if (response?.data?.invalid) {
        throw new Error(response.data.messages.join("\n"));
      }
      return response;
    },
    (error) => {
      if (error) {
        if (error?.response?.status == 403) {
          window.location.replace("/admin");
        }
      }
    },
  );

  return request;
};

const _createRequestExternal = (defaultRoute) => {
  const request = axios.create({
    baseURL: defaultRoute,
    timeout,
    // headers: getHeaders(),
  });
  request.interceptors.request.use((req) => {
    req.headers["contentType"] = "application/json";
    return req;
  });
  return request;
};

const _createRequestPublic = (defaultRoute, _server) => {
  const request = axios.create({
    baseURL: _server + defaultRoute,
    timeout,
    headers: getHeaders(USER_KEY),
  });
  request.interceptors.request.use((req) => {
    req.headers["contentType"] = "application/json";
    return req;
  });
  return request;
};

const _createRequestNext = (defaultRoute) => {
  const request = axios.create({
    baseURL: defaultRoute,
    timeout,
    // headers: getHeaders(),
  });
  request.interceptors.request.use((req) => {
    req.headers["contentType"] = "application/json";
    return req;
  });
  return request;
};

const _createRequestBasicToken = (url, user, pw) => {
  const request = axios.create({
    baseURL: url,
    timeout,
    headers: getHeadersBasicToken(user, pw),
  });
  request.interceptors.request.use((req) => {
    req.headers["contentType"] = "application/json";
    return req;
  });
  return request;
};

const dummyFetch = (defaultRoute) => {
  const request = axios.create({
    baseURL: NEXT_API_SERVER + "/dummydata" + defaultRoute,
    timeout,
    headers: getHeaders(),
  });

  const getter = async (endpoint) => {
    endpoint = endpoint.split("?")[0];
    return await request.get(`${endpoint}.json`);
  };

  return {
    get: getter,
    post: getter,
    put: getter,
    delete: getter,
  };
};

export {
  SERVER,
  timeout,
  // headers,
  PORTAL_SERVER,
  NEXT_API_SERVER,
  FF_API_SERVER,
  PORTAL_WEBCAL,
  CAL_API,
  FORM_API,
  SERVICE_API,
  INVOICE_API
};

export const createRequest = IS_DUMMY ? dummyFetch : _createRequest;
export const createRequestPublic = IS_DUMMY ? dummyFetch : _createRequestPublic;
export const createRequestDummy = dummyFetch;
export const createRequestExternal = _createRequestExternal;
