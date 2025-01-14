import useSWR from "swr";

import {
  authFetcher,
  fetcher,
  fetcherBasicToken,
  fetcherExternal,
  fetcherMsbc,
  fetcherMulti,
  fetcherNext,
  fetcherProxy,
} from "lib/api/SERVER";

const DEFAULT_REFRESH = 24 * 60 * 60 * 1000;
// { refreshInterval: REFRESH }
// export const fetcherWithAuth = (url) => {
//   const { token } = getUser() || {};
//   return fetch(url, { headers: { Authorization: "Bearer " + token } }).then((res) => res.json());
// };

const useDataInit = (url, type, options = {}) => {
  const { refresh } = options;
  const fetchers = {
    regular: fetcher,
    auth: authFetcher,
    external: fetcherExternal,
    msbc: fetcherMsbc,
    multi: fetcherMulti,
    next: fetcherNext,
    basic: fetcherBasicToken, // basic auth (emulates browser prompt user/pw). NOTE: might be have CORS issue,
    proxy: fetcherProxy,
  };

  return useSWR(url, fetchers[type || "regular"], {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: refresh || DEFAULT_REFRESH,
    ...options,
  });
};

export default useDataInit;
