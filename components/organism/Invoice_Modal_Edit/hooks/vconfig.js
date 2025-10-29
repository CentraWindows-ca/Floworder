import { uiWoFieldEditGroupMapping as f } from "lib/constants/production_constants_labelMapping";

export const config_regular = {
  // [f.information.m_BranchId]: { required: true },
  // [f.information.w_ManufacturingFacility]: { required: true },

};

export const getVConfig = (initData) => {
  return config_regular;
};

export const getIsRequired = (initData, fieldName) => {
  const _configs = getVConfig(initData)
  return _configs?.[fieldName]?.required
}
