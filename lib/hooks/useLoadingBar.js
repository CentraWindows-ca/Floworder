import { useContext }  from "react";
import { GeneralContext } from "lib/provider/GeneralProvider"

export const useLoadingBar = (fn) => {
  const [ _, setLoadingStatus ] = useContext(GeneralContext).loadingBar
  return async (...params) => {
      try {
        setLoadingStatus(prev => prev + 1)
        const res = await fn(...params)
        setLoadingStatus(prev => prev - 1)
        return Promise.resolve(res)   
      } catch (error) {
        setLoadingStatus(-1)
        return Promise.reject(error)  
      }
  }
}

export const useIsLoading = () => {
  const [ status ] = useContext(GeneralContext).loadingBar
  return status
}

export default useLoadingBar