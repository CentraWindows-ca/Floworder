import { uiWoFieldEditGroupMapping as f } from "lib/constants/production_constants_labelMapping";

export const config_regular = {
  [f.information.m_BranchId]: { required: true },
  [f.information.w_ManufacturingFacility]: { required: true },
  [f.information.d_ManufacturingFacility]: { required: true },
  [f.information.m_ShippingType]: { required: true },
  [f.information.m_ResidentialType]: { required: true },
  [f.information.m_JobType]: { required: true },
  [f.information.m_CustomerType]: { required: true },
  [f.information.m_SalesRepKeyAccount]: { required: true },
  [f.information.w_BlockNo]: { required: true },
  [f.information.w_BatchNo]: { required: true },
  [f.information.w_GlassSupplier]: { required: true },
  [f.information.w_GlassOptions]: { required: true },
  [f.information.d_BlockNo]: { required: true },
  [f.information.d_BatchNo]: { required: true },
  [f.information.d_GlassSupplier]: { required: true },

  [f.schedule.w_ProductionStartDate]: { required: true },
  [f.schedule.d_ProductionStartDate]: { required: true },
};

export const config_reservation = {
  [f.information.m_BranchId]: { required: true },
  [f.information.w_ManufacturingFacility]: { required: true },
  [f.information.d_ManufacturingFacility]: { required: true },
  [f.information.m_ShippingType]: { required: true },
  [f.information.m_ResidentialType]: { required: true },
  [f.information.m_JobType]: { required: true },
  [f.information.m_CustomerType]: { required: true },
  [f.information.m_SalesRepKeyAccount]: { required: true },
  [f.information.w_BlockNo]: { required: true },
  [f.information.w_BatchNo]: { required: true },
  [f.information.w_GlassSupplier]: { required: true },
  [f.information.w_GlassOptions]: { required: true },
  [f.information.d_BlockNo]: { required: true },
  [f.information.d_BatchNo]: { required: true },
  [f.information.d_GlassSupplier]: { required: true },

  [f.schedule.w_ProductionStartDate]: { required: true },
  [f.schedule.d_ProductionStartDate]: { required: true },
};

export const getVConfig = (initData) => {
  const isReservation = initData?.m_Status?.toLocaleLowerCase().includes("reservation");
  return isReservation ? config_reservation : config_regular;
};

export const getIsRequired = (initData, fieldName) => {
  const _configs = getVConfig(initData)
  return _configs?.[fieldName]?.required
}
