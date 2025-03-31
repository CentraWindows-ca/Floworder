import { useContext } from "react";
import { GeneralContext } from "lib/provider/GeneralProvider";

export const useLoadingBar = (fn) => {
  const toast = useContext(GeneralContext).toast;

  const [_, setLoadingStatus] = useContext(GeneralContext).loadingBar;
  return async (...params) => {
    try {
      setLoadingStatus((prev) => prev + 1);
      const res = await fn(...params);
      return Promise.resolve(res);
    } catch (error) {
      if (error?.response?.data) {
        toast(error?.response?.data, {
          type: "error",
          autoClose: 5000,
        });
        return Promise.resolve(error);
      }

      return Promise.reject(error);
    } finally {
      setLoadingStatus((prev) => {
        if (prev - 1 < 0) return 0;
        return prev - 1;
      });
    }
  };
};

export const useIsLoading = () => {
  const [status] = useContext(GeneralContext).loadingBar;
  return status;
};

export default useLoadingBar;
