import React, { createContext, useContext, useState, useEffect } from "react";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";

import utils from "lib/utils";

import OrdersApi from "lib/api/OrdersApi";
import GlassApi from "lib/api/GlassApi";

import useLoadingBar from "lib/hooks/useLoadingBar";
import constants, { ORDER_STATUS } from "lib/constants";
import { getOrderKind } from "lib/utils";

import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";

export const LocalDataContext = createContext(null);

export const LocalDataProvider = ({
  children,
  initMasterId,
  kind: initKind,
  facility,
  onSave,
  onHide,
  initIsEditable,
  ...props
}) => {
  const generalContext = useContext(GeneralContext);
  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // only display. upload/delete will directly call function
  useEffect(() => {
    if (initMasterId) {
      init(initMasterId);
    }
  }, [initMasterId]);

  // ====== api calls
  const clear = () => {
    setData(null);
  };

  const init = async (initMasterId) => {
    setIsLoading(true);
    setData(null);
    // fetch data
    const res =  await Wrapper_OrdersApi.getWorkOrderHistory(initMasterId);
    if (res?.data) {
      setData(
        res?.data.map((a) => {
          return {
            ...a,
            CreatedAt: utils.formatDate(a.CreatedAt),
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
    initMasterId,
    data,
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
