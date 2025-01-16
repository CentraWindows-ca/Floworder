import axios from "axios";

const IS_DUMMY = false;

let PORTAL_SERVER = "http://localhost:3000";
let SERVER = "https://localhost:7152";
let NEXT_API_SERVER = "http://localhost:1720";
let FF_API_SERVER = "https://flowfinityproxy.centra.ca";
let PORTAL_WEBCAL = "https://webcalendar.centra.ca"

// node: convention of CRA, all customized env should prefix with "REACT_APP_" e.g. process.env.REACT_APP_HELLO
if (process.env.NEXT_PUBLIC_ENV === "development") {
  SERVER = "http://srvvandev:8077";
  // SERVER = IS_DUMMY ? PORTAL_SERVER : SERVER;
  // SERVER = "https://dragonflyapi.centra.ca";
  // NEXT_API_SERVER = "http://10.201.76.143:1520";
  PORTAL_WEBCAL = "https://floworder.centra.ca"
}

if (process.env.NEXT_PUBLIC_ENV === "staging") {
  SERVER = "http://srvvandev:8077";
  NEXT_API_SERVER = "https://stagingdragonfly.centra.ca";
  PORTAL_WEBCAL = "https://floworder.centra.ca"
}

if (process.env.NEXT_PUBLIC_ENV === "production") {
  SERVER = "http://srvvandev:8077";
  NEXT_API_SERVER = "https://dragonfly.centra.ca";
  PORTAL_WEBCAL = "https://floworder.centra.ca"
}

const timeout = 99999999999999999999999999;

const USER_KEY = "userkey";
const MSBC_TOKEN = "msbc_token";
export { USER_KEY, MSBC_TOKEN };

export const authFetcher = async (url, root) => {
  const res = await _createRequest(root).get(url);
  return res?.data;
};

// fetch from our API
export const fetcher = async (url, root, options) => {

  // fetch(SERVER + root + url).then((res) => res.json())
  const { method, body } = options || { method: "GET" };
  let res = null;
  switch (method) {
    case "GET":
      res = await _createRequestPublic(root).get(url);
      break;
    case "POST":
      res = await _createRequestPublic(root).post(url, body);
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
    return { Authorization: token ? `Bearer ${token}` : "" };
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

const _createRequestPublic = (defaultRoute) => {
  const request = axios.create({
    baseURL: SERVER + defaultRoute,
    timeout,
    // headers: getHeaders(),
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
  PORTAL_WEBCAL
};

export const createRequest = IS_DUMMY ? dummyFetch : _createRequest;
export const createRequestPublic = IS_DUMMY ? dummyFetch : _createRequestPublic;
export const createRequestDummy = dummyFetch;
export const createRequestExternal = _createRequestExternal
