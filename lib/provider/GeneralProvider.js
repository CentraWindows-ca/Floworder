import React, { createContext, useContext, useState, useEffect }  from "react";
import { ToastContainer, toast } from "react-toastify";

// import useProvideAuth from "../hooks/useProvideAuth.js"
import Constants from "lib/constants"
import useDataInit from "lib/hooks/useDataInit";

// APIs
import DictionaryApi from "lib/api/DictionaryApi";

export const GeneralContext = createContext(null);
export const GeneralProvider = ({children, permissions, rawAuth}) => {

  const [dictionary, setDictionary] = useState({})

  const { data: salesRepsList } = useDataInit(DictionaryApi.portal.salesReps, 'external');

  useEffect(() => {
    if (salesRepsList) {
      setDictionary({
        salesRepsList,
        departmentList: Constants.FLOWFINITY_SYSTEM_FIELDS.DEPARTMENTS, // departmentList,
        productList: Constants.FLOWFINITY_SYSTEM_FIELDS.PRODUCTS, // productList
        branchList: Constants.FLOWFINITY_SYSTEM_FIELDS.BRANCHES,
        WorkOrderSelectOptions: Constants.WorkOrderSelectOptions
      })
    }
  }, [salesRepsList])

  // const auth = useProvideAuth()
  const [loadingStatus, setLoadingStatus] = useState(0)
  const [navShow, setNavShow] = useState(false)

  const context = {
    // ui
    navShow,
    setNavShow,
    loadingBar: [loadingStatus, setLoadingStatus],
    dictionary,
    toast,

    // auth
    permissions,
    rawAuth
  }

  return (
    <GeneralContext.Provider value={ context }>
      <ToastContainer {...{ position: "top-center", autoClose: 2000 }} />
      {children}
    </GeneralContext.Provider>
  );
};