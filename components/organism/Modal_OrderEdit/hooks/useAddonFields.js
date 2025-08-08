import { useContext } from "react";
import _ from "lodash";
import {
  uiWoFieldEditGroupMapping,
  labelMapping,
} from "lib/constants/constants_labelMapping";
import { getIfFieldDisplayAsProductType } from "../Com";
import { LocalDataContext } from "../LocalDataProvider";

// ===

const hook = () => {
  const ctx = useContext(LocalDataContext) || {};
    
  /**
   * data is current value;
   * initData to search extra conditions (if window, if door, ...)
   */
  const checkAddonField = (params) => {
    const { id } = params;
     console.log(ctx)
    return {
      isAddonEditable: false,
    };

   
  };

  return {
    checkAddonField,
  };
};

export default hook;
