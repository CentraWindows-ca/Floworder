import React, { createContext, useContext, useState, useEffect } from "react";
import _ from "lodash";

import { ToastContainer, toast } from "react-toastify";

// import useProvideAuth from "../hooks/useProvideAuth.js"
import Constants from "lib/constants";
import useDataInit from "lib/hooks/useDataInit";

// APIs
import DictionaryApi from "lib/api/DictionaryApi";
import FFCommonApi from "lib/api/FFCommonApi";
import WMCommonQuery from "lib/api/WMCommonQuery";

export const GeneralContext = createContext(null);
export const GeneralProvider = ({ children, permissions, rawAuth }) => {
  const [dictionary, setDictionary] = useState({
    departmentList: Constants.FLOWFINITY_SYSTEM_FIELDS.DEPARTMENTS, // departmentList,
    productList: Constants.FLOWFINITY_SYSTEM_FIELDS.PRODUCTS, // productList
    branchList: Constants.FLOWFINITY_SYSTEM_FIELDS.BRANCHES,
    WorkOrderSelectOptions: Constants.WorkOrderSelectOptions,
  });

  const { data: salesRepsList } = useDataInit(FFCommonApi.initGetSalesReps);

  const { data: projectManagerList } = useDataInit(
    FFCommonApi.initGetProjectManagers,
  );

  const { data: glassSupplierList } = useDataInit(
    FFCommonApi.initGetFFGlassSuppliers,
  );

  const { data: glassOptionList } = useDataInit(
    FFCommonApi.initGetFFGlassOptions,
  );

  const { data: rackList } = useDataInit(
    DictionaryApi.flowfinity.rack,
    "proxy",
  );

  const { data: systemCategoryList } = useDataInit(
    WMCommonQuery.initGetItemSystemCatgories,
  );

  const checkPermission = (params) => {
    const { featureCodeGroup, featureCode, op = null } = params;
    // op can be - canEdit: true, canView: true, canAdd: true, canDelete: true, isPublic: false
    if (!permissions) return false;

    if (featureCodeGroup) {
      // check feature group
      const checkList = _.keys(permissions)?.map((k) => {
        return featureCodeGroup === k || k.startsWith(featureCodeGroup + ".");
      });
      return _.some(checkList);
    } else if (featureCode) {
      // check individual feature
      let featureCodeList = [];

      // can be multiple
      if (typeof featureCode === "string") {
        featureCodeList = [featureCode];
      } else {
        featureCodeList = featureCode;
      }

      const checkList = featureCodeList.map((fc) => {
        if (permissions[fc]) {
          if (!op) return true; // of not certain operation
          if (typeof op === "object") {
            const _checkList = _.keys(op).map((k) => permissions[fc][k]);
            return _.every(_checkList);
          } else {
            return permissions[fc][op];
          }
        }

        return false;
      });

      return _.some(checkList);
    }
  };

  useEffect(() => {
    if (rackList) {
      setDictionary((prev) => ({
        ...prev,
        rackList,
      }));
    }
  }, [rackList]);

  useEffect(() => {
    if (salesRepsList) {
      setDictionary((prev) => ({
        ...prev,
        salesRepsList,
      }));
    }
    if (projectManagerList) {
      setDictionary((prev) => ({
        ...prev,
        projectManagerList,
      }));
    }

    if (systemCategoryList) {
      setDictionary((prev) => ({
        ...prev,
        systemCategoryList,
      }));
    }
    if (glassSupplierList) {
      // setDictionary((prev) => ({
      //   ...prev,
      //   glassSupplierList,
      // }));

      setDictionary((prev) => ({
        ...prev,
        glassSupplierList: Constants.WorkOrderSelectOptions.glassSuppliers,
      }));
    }
    if (glassOptionList) {
      // setDictionary((prev) => ({
      //   ...prev,
      //   glassOptionList,
      // }));

      setDictionary((prev) => ({
        ...prev,
        glassOptionList: Constants.WorkOrderSelectOptions.glassOptions,
      }));
    }
  }, [
    salesRepsList,
    projectManagerList,
    glassSupplierList,
    glassOptionList,
    systemCategoryList,
  ]);

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
      <ToastContainer {...{ position: "bottom-right", autoClose: 2000 }} />
      {children}
    </GeneralContext.Provider>
  );
};
