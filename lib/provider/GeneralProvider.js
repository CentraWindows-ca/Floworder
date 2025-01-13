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

  const context = {
    // ui
    navShow,
    setNavShow,
    loadingBar: [loadingStatus, setLoadingStatus],

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