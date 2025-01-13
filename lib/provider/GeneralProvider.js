import React, { createContext, useContext, useState, useEffect }  from "react";
// import useProvideAuth from "../hooks/useProvideAuth.js"
import Constants from "lib/constants"
import useDataInit from "lib/hooks/useDataInit";

// APIs
import DictionaryApi from "lib/api/DictionaryApi";

export const GeneralContext = createContext(null);
export const GeneralProvider = ({children, permissions, rawAuth}) => {

  // const auth = useProvideAuth()
  const [loadingStatus, setLoadingStatus] = useState(0)
  const [navShow, setNavShow] = useState(false)
  const [dictionary_flowfinity, setDictionary_flowfinity] = useState("hello")

  // ==== dictionaries
  const { data: branchList } = useDataInit(DictionaryApi.flowfinity.branch);
  const { data: departmentList } = useDataInit(DictionaryApi.flowfinity.department);
  const { data: productList } = useDataInit(DictionaryApi.flowfinity.product);

  useEffect(() => {
    if (branchList && departmentList && productList) {
      setDictionary_flowfinity({
        branchList,
        departmentList: Constants.FLOWFINITY_SYSTEM_FIELDS.DEPARTMENTS, // departmentList,
        productList: Constants.FLOWFINITY_SYSTEM_FIELDS.PRODUCTS // productList
      })
    }
  }, [branchList, departmentList, productList])

  const context = {
    // ui
    navShow,
    setNavShow,
    loadingBar: [loadingStatus, setLoadingStatus],

    // dictionary
    dictionary_flowfinity,

    // auth
    permissions,
    rawAuth
  }

  return (
    <GeneralContext.Provider value={ context }>
      {children}
    </GeneralContext.Provider>
  );
};