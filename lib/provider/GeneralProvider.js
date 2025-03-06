import React, { createContext, useContext, useState, useEffect } from "react";
import _ from "lodash";

import { ToastContainer, toast } from "react-toastify";

// import useProvideAuth from "../hooks/useProvideAuth.js"
import Constants from "lib/constants";
import useDataInit from "lib/hooks/useDataInit";

// APIs
import DictionaryApi from "lib/api/DictionaryApi";

export const GeneralContext = createContext(null);
export const GeneralProvider = ({ children, permissions, rawAuth }) => {
  const [dictionary, setDictionary] = useState({
    departmentList: Constants.FLOWFINITY_SYSTEM_FIELDS.DEPARTMENTS, // departmentList,
    productList: Constants.FLOWFINITY_SYSTEM_FIELDS.PRODUCTS, // productList
    branchList: Constants.FLOWFINITY_SYSTEM_FIELDS.BRANCHES,
    WorkOrderSelectOptions: Constants.WorkOrderSelectOptions,
  });

  const { data: salesRepsList } = useDataInit(
    DictionaryApi.portal.salesReps,
    "external",
  );

  const { data: rackList } = useDataInit(
    DictionaryApi.flowfinity.rack,
    "proxy",
  );

  const checkPermission = (featureCode, op = null) => {
    // op can be - canEdit: true, canView: true, canAdd: true, canDelete: true, isPublic: false
    if (!permissions) return false
    if (permissions[featureCode]) {
      if (!op) return true; // of not certain operation
      if (typeof op === "object") {
        const checkList = _.keys(op).map((k) => permissions[featureCode][k]);
        return _.every(checkList);
      } else {
        return permissions[featureCode][op];
      }
    }

    return false;
  };

  useEffect(() => {
    if (salesRepsList) {
      setDictionary((prev) => ({
        ...prev,
        salesRepsList,
      }));
    }
  }, [salesRepsList]);

  useEffect(() => {
    if (rackList) {
      setDictionary((prev) => ({
        ...prev,
        rackList,
      }));
    }
  }, [rackList]);

  // const auth = useProvideAuth()
  const [loadingStatus, setLoadingStatus] = useState(0);
  const [navShow, setNavShow] = useState(false);

  const context = {
    // ui
    navShow,
    setNavShow,
    loadingBar: [loadingStatus, setLoadingStatus],
    dictionary,
    toast,

    // auth
    permissions,
    rawAuth,
    checkPermission,
  };

  return (
    <GeneralContext.Provider value={context}>
      <ToastContainer {...{ position: "top-right", autoClose: 2000 }} />
      {children}
    </GeneralContext.Provider>
  );
};
