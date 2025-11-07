import React, { createContext, useContext, useState, useEffect } from "react";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";

import utils from "lib/utils";

import OrdersApi from "lib/api/OrdersApi";
import GlassApi from "lib/api/GlassApi";

import useLoadingBar from "lib/hooks/useLoadingBar";
import constants, { ORDER_STATUS } from "lib/constants";

import InvoiceApi from "lib/api/InvoiceApi";

export const LocalDataContext = createContext(null);

export const LocalDataProvider = ({
  children,
  initInvoiceHeaderId,
  onHide,
  ...props
}) => {
  const generalContext = useContext(GeneralContext);
  const [data, setData] = useState(null);

  const [workOrderInfo, setWorkOrderInfo] = useState(null)

  const [isLoading, setIsLoading] = useState(false);

  // only display. upload/delete will directly call function
  useEffect(() => {
    if (initInvoiceHeaderId) {
      init(initInvoiceHeaderId);
    }
  }, [initInvoiceHeaderId]);

  // ====== api calls
  const clear = () => {
    setData(null);
  };

  const init = async (initInvoiceHeaderId) => {
    setIsLoading(true);
    setData(null);
    // fetch data
    const res =  await InvoiceApi.getInvoiceHistory(initInvoiceHeaderId);
    if (res?.items) {
      setData(
        res?.items.map((a) => {
          return {
            ...a,
            CreatedAt: utils.formatDate(a.CreatedAt, "yyyy-MM-dd HH:mm:ss"),
          };
        }),
      );
    }
    setIsLoading(false);
  };

  const context = {
    ...generalContext,
    ...props,
    isLoading,
    initInvoiceHeaderId,
    data,
    workOrderInfo,
    setData,
    onHide
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
