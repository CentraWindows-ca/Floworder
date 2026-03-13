import _ from "lodash";
import constants, { ALL_SUBORDER_TYPES, FACILITY_FROM_CODE } from ".";

export const labelMapping = {
  d_Status: { title: "Doors Status" },
  w_Status: { title: "Windows Status" },
  m_Status: { title: "Status" },
  m_BranchId: { title: "Branch" },
  m_ManufacturingFacility: { title: "Manufacturing Facility" },
  d_ManufacturingFacility: { title: "Doors Manufacturing Facility" },
  w_ManufacturingFacility: { title: "Windows Manufacturing Facility" },

  m_TransferredLocation: { title: "Transferred To" },
  m_ShippingType: { title: "Shipping Type" },
  m_ResidentialType: { title: "Residential Type" },
  m_JobType: { title: "Job Type" },
  m_OrderType: { title: "Order Type" },
  m_CustomerType: { title: "Customer Type" },
  m_PriceBeforeTax: { title: "Price Before Tax" },
  m_Project: { title: "Project" },
  m_SalesRep: { title: "Sales Reps" },
  m_SalesRepKeyAccount: { title: "Sales Reps" },
  m_ShippedDate: { title: "Actual Shipped Date" },
  m_TransferredDate: { title: "Transferred Date" },
  m_TotalLBRMin: { title: "LBR Mins" },
  m_AddOnsCount: { title: "Add-ons" },
  m_AddOnLinked: { title: "Add-on Linked" },
  d_BlockNo: { title: "Doors Block NO." },
  d_BatchNo: { title: "Doors Batch NO." },
  d_GlassSupplier: { title: "Doors Glass Supplier" },
  w_BlockNo: { title: "Windows Block NO." },
  w_BatchNo: { title: "Windows Batch NO." },
  w_GlassSupplier: { title: "Windows Glass Supplier" },
  w_GlassOptions: { title: "Windows Glass Option" },
  m_SiteContact: { title: "Site Contact" },
  m_SiteContactPhoneNumber: { title: "Site Contact Number" },
  m_SiteContactEmail: { title: "Site Contact Email" },
  m_CustomerName: { title: "Customer Name" },
  m_ProjectName: { title: "Project Name" },
  m_ProjectManager: { title: "Project Manager" },
  m_ProjectManagerName: { title: "Project Manager" },
  m_Comment_1: { title: "Comment" },
  m_City: { title: "City" },
  m_Address: { title: "Address" },
  m_Email: { title: "Email" },
  m_PhoneNumber: { title: "Phone Number" },
  m_OtherContactNumber: { title: "Other Contact Number" },
  m_CustomerPickup: { title: "Customer Pick-up" },
  m_Community: { title: "Community" },
  d_RushOrder: { title: "Doors Rush Order" },
  d_MultipointFlag: { title: "Doors Multi Point" },
  d_PaintIcon: { title: "Doors Paint Icon" },
  d_RBMIcon: { title: "Doors RBM Icon" },
  d_GridsRequired: { title: "Doors Grids Required" },
  d_WaterTestingRequired: { title: "Doors Water Testing Required" },
  d_MiniblindIcon: { title: "Doors Mini Blind" },
  d_EngineeredIcon: { title: "Doors Engineered Order Icon" },
  d_ShapesRequires: { title: "Doors Shapes Requires" },
  w_RushOrder: { title: "Windows Rush Order" },
  w_PaintIcon: { title: "Windows Paint Icon" },
  w_CapstockIcon: { title: "Capstock Icon" },
  w_MiniblindIcon: { title: "Windows Miniblind Icon" },
  w_EngineeredIcon: { title: "Windows Engineered Order Icon" },
  w_RBMIcon: { title: "Windows RBM Icon" },
  w_VinylWrapIcon: { title: "Vinyl Wrap Icon" },
  w_ShapesRequires: { title: "Windows Shapes Requires" },
  w_GridsRequired: { title: "Windows Grids Required" },
  w_WaterTestingRequired: { title: "Windows Water Testing Required" },
  w_WaterPenetrationResistance: { title: "Water Penetration Resistance" },
  m_ShippingStartDate: { title: "Shipping Date" },
  m_ShippingEndDate: false, // { title: "Shipping End" },
  m_RevisedDeliveryDate: { title: "Revised Delivery Date" },
  d_CustomerDate: { title: "Doors Customer Date" },
  d_ProductionStartDate: { title: "Doors Production Date" },
  d_PaintStartDate: { title: "Doors Paint Date" },
  d_PaintEndDate: false, //{ title: "Doors Paint End" },
  d_GlassOrderDate: { title: "Doors Glass Order Date" },
  w_CustomerDate: { title: "Windows Customer Date" },
  w_ProductionStartDate: { title: "Windows Production Date" },
  w_PaintStartDate: { title: "Windows Paint Date" },
  w_PaintEndDate: false, //{ title: "Windows Paint End" },
  w_GlassOrderDate: { title: "Windows Glass Order Date" },
  w_GlassRecDate: { title: "Windows Glass Receive Date" },
  m_CustomerDate: { title: "Customer Date" },
  w__26CA: { title: "26CA" },
  w__26CAMin: { title: "26CA Min" },
  w__26HY: { title: "26HY" },
  w__26HYMin: { title: "26HY Min" },
  w__27DS: { title: "27DS" },
  w__27DSMin: { title: "27DS Min" },
  w__29CA: { title: "29CA" },
  w__29CAMin: { title: "29CA Min" },
  w__29CM: { title: "29CM" },
  w__29CMMin: { title: "29CM Min" },
  w__52PD: { title: "52PD" },
  w__52PDMin: { title: "52PD Min" },
  w__61DR: { title: "61DR" },
  w__61DRMin: { title: "61DR Min" },
  w__68CA: { title: "68CA" },
  w__68CAMin: { title: "68CA Min" },
  w__68SL: { title: "68SL" },
  w__68SLMin: { title: "68SL Min" },
  w__68VS: { title: "68VS" },
  w__68VSMin: { title: "68VS Min" },
  w__88SL: { title: "88SL" },
  w__88SLMin: { title: "88SL Min" },
  w__88VS: { title: "88VS" },
  w__88VSMin: { title: "88VS Min" },
  d__REDR: { title: "REDR" },
  d__REDRMin: { title: "REDR Min" },
  d__CDLD: { title: "CDLD" },
  d__CDLDMin: { title: "CDLD Min" },
  d__RESD: { title: "RESD" },
  d__RESDMin: { title: "RESD Min" },

  m_WorkOrderNo: { title: "Work Order" },
  m_Status_display: { title: "Order Status" },
  m_WinStatus_display: { title: "Windows Status" },
  m_DoorStatus_display: { title: "Doors Status" },
  m_InstallStatus: { title: "Install Status" },
  m_RebateIcon: { title: "Rebate" },
  m_TypeofGrant: { title: "Type Of Grant" },
  m_GrantStatus: { title: "Grant Status" },
  m_GovGrantExpiryDate_display: { title: "Gov. Grant Exp" },
  m_GovGrantExpiryDate: { title: "Gov. Grant Exp" },
  m_FormStatus: { title: "Forms Portal Status" },
  m_Branch: { title: "Branch" },
  m_JobType: { title: "Job Type" },
  w_BatchNo: { title: "Windows Batch#" },
  w_BlockNo: { title: "Windows Block#" },
  d_BatchNo: { title: "Doors Batch#" },
  d_BlockNo: { title: "Doors Block#" },
  m_NumberOfWindows: { title: "Number of Windows" },
  m_NumberOfPatioDoors: { title: "Number of Patio Doors" },
  m_NumberOfDoors: { title: "Number of Exterior Doors" },
  m_NumberOfSwingDoors: { title: "Number of Swing Doors" },
  m_NumberOfOthers: { title: "Number of Others" },
  m_InvStatus: { title: "INV Status" },
  m_CreatedBy: { title: "Created By" },
  m_CreatedAt: { title: "Created At" },
  m_CreatedAt_display: { title: "Created At" },
  m_LastModifiedBy: { title: "Modified By" },
  m_LastModifiedAt_display: { title: "Modified At" },
  m_LastModifiedAt: { title: "Modified At" },
  m_ShippingNotes: {
    title: "Shipping Notes",
  },
  m_ProjectManagementNotes: {
    title: "Project Manager Notes",
  },
  m_ReturnTripNotes: {
    title: "Returned Job",
  },
  w_OfficeNotes: {
    title: "Windows Office Notes",
  },
  w_PlantNotes: {
    title: "Windows Plant Notes",
  },
  d_OfficeNotes: {
    title: "Doors Office Notes",
  },
  d_DoorShopNotes: {
    title: "Doors Shop",
  },
  returnTripDate: {
    title: "Return Trip Date",
  },
  returnTripNotes: {
    title: "Return Trip Notes",
  },

  // invoice
  m_DepositValue: { title: "Deposit" },
  m_ListPrice: { title: "Sold Price" },
  m_Commission: { title: "Commission" },
  m_PaymentType: { title: "Payment Type" },
  m_Discount: { title: "Discount" },
  m_Tax: { title: "Tax" }, // dropdown of No Tax, GST, GST+ PST, PST Exempt
  m_PO: { title: "PO" },
  m_PSTExemptionNumber: { title: "PST Exemption Number" }, // when input only show when its PST

  // item level
  Item: { title: "Item" },
  System: { title: "System" },
  Description: { title: "Description" },
  DoorType: { title: "Doors Type" },
  Size: { title: "Size" },
  Quantity: { title: "Quantity" },
  SubQty: { title: "SubQty" },
  Notes: { title: "Notes" },
  DoorCutout: { title: "Doors Cut-out" },
  Status: { title: "Status" },
  Stock: { title: "Stock" },
  Lites: { title: "Lites" },
  BTO: { title: "BTO" },
  Multipoint: { title: "Multi Point" },
  SlabPrep: { title: "Slab Prep" },
  Assembly: { title: "Assembly" },
  MillingDept: { title: "Milling Dept" },
  CustomSlabPrep: { title: "Custom Slab Prep" },
  QA: { title: "QA" },
  CustomMilling: { title: "Custom Milling" },
  TempSlab: { title: "TempSlab" },
  Painted: { title: "Painted" },
  BoxQty: { title: "Box Qty" },
  GlassQty: { title: "Glass Qty" },
  LBRMin: { title: "LBR Min" },
  Nett: { title: "Nett" },
  RackLocation: { title: "Rack Location" },
  TransomCount: { title: "Transom Count" },
  SideliteCount: { title: "Sidelite Count" },
  SingleDoorCount: { title: "Single Doors Count" },
  DoubleDoorCount: { title: "Double Doors Count" },
  HighRisk: { title: "High Risk" },
  Custom: { title: "Custom" },
  RBMIcon: { title: "RBM Icon" },
  Wraped: { title: "Wraped" },
  PaintLineal: { title: "Paint Lineal" },
  Facility: { title: "Facility" },
  // glass item level
  receivedExpected: { title: "Rcev. / Expt." },
  rackID: { title: "Rack ID" },
  rackType: { title: "Rack Type" },
  qty: { title: "Qty On Rack" },
  item: { title: "Item" },
  description: { title: "Description" },
  orderDate: { title: "Order Date" },
  shipDate: { title: "Shipping Date" },
  size: { title: "Size" },
  position: { title: "Position" },
  status: { title: "Status" },
  notes: { title: "Notes" },
  wi_Status: { title: "Window Item Status" },
  di_Status: { title: "Door Item Status" },

  // table list

  // hidden fields (should not show to front-end order history)
  d_Transom: false,
  d_Sidelite: false,
  d_SingleLiteFlag: false,
  d_MultiLiteFlag: false,
  d_SingleDoor: false,
  d_DoubleDoor: false,
  d_ProductionEndDate: false,

  // all same as master lvl
  d_CreatedById: false,
  d_CreatedBy: false,
  d_LastModifiedAt: false,
  d_LastModifiedById: false,
  d_LastModifiedBy: false,
  w_CreatedById: false,
  w_CreatedBy: false,

  w_LastModifiedAt: false,
  w_LastModifiedById: false,
  w_LastModifiedBy: false,
  // m_LastModifiedAt: false,
  m_LastModifiedById: false,
  // m_LastModifiedBy: false,
  m_CreatedById: false,

  // duplicated value
  m_WinStatus: false,
  m_DoorStatus: false,
  d_CurrentStateName: false, // same as stauts
  w_CurrentStateName: false,
  m_CurrentStateName: false,

  // removed
  d_PlantNotes: false, // only window
  d_WaterPenetrationResistance: false,

  d_IsActive: false, // sysem internal
  w_Id: false,
  w_MasterId: false,
  w_IsActive: false,
  d_Id: false,
  d_MasterId: false,
  m_IsActive: false,
  m_MasterId: false,
};

// NOTE: UI thing, original requirement is from VK wants to split save button for WO edit sections
export const uiWoFieldEditGroupMapping = {
  basic: {
    m_CustomerName: "m_CustomerName",
    m_ProjectName: "m_ProjectName",
    m_Address: "m_Address",
    m_City: "m_City",
    m_Email: "m_Email",
    m_PhoneNumber: "m_PhoneNumber",
    m_OtherContactNumber: "m_OtherContactNumber",
    m_ProjectManager: "m_ProjectManager",
    m_SiteContact: "m_SiteContact",
    m_SiteContactPhoneNumber: "m_SiteContactPhoneNumber",
    m_SiteContactEmail: "m_SiteContactEmail",
    m_Comment_1: "m_Comment_1",
    m_Community: "m_Community",
  },
  invoice: {
    m_DepositValue: "m_DepositValue",
    m_ListPrice: "m_ListPrice",
    m_Commission: "m_Lism_CommissiontPrice",
    m_PaymentType: "m_PaymentType",
    m_Discount: "m_Discount",
    m_Tax: "m_Tax", // dropdown of No Tax, GST, GST+ PST, PST Exempt
    m_PO: "m_PO",
    m_PSTExemptionNumber: "m_PSTExemptionNumber", // when input only show when its PST
  },
  information: {
    m_BranchId: "m_BranchId",
    w_ManufacturingFacility: "w_ManufacturingFacility",
    d_ManufacturingFacility: "d_ManufacturingFacility",
    m_ShippingType: "m_ShippingType",
    m_ResidentialType: "m_ResidentialType",
    m_JobType: "m_JobType",
    m_OrderType: "m_OrderType",
    m_CustomerType: "m_CustomerType",
    m_PriceBeforeTax: "m_PriceBeforeTax",
    m_Project: "m_Project",
    m_SalesRepKeyAccount: "m_SalesRepKeyAccount",
    m_SalesRep: "m_SalesRep",
    w_BlockNo: "w_BlockNo",
    w_BatchNo: "w_BatchNo",
    w_GlassSupplier: "w_GlassSupplier",
    w_GlassOptions: "w_GlassOptions",
    d_BlockNo: "d_BlockNo",
    d_BatchNo: "d_BatchNo",
    d_GlassSupplier: "d_GlassSupplier",
  },
  options: {
    m_CustomerPickup: "m_CustomerPickup",
    w_RushOrder: "w_RushOrder",
    w_PaintIcon: "w_PaintIcon",
    w_CapstockIcon: "w_CapstockIcon",
    w_MiniblindIcon: "w_MiniblindIcon",
    w_EngineeredIcon: "w_EngineeredIcon",
    w_RBMIcon: "w_RBMIcon",
    w_VinylWrapIcon: "w_VinylWrapIcon",
    w_ShapesRequires: "w_ShapesRequires",
    w_GridsRequired: "w_GridsRequired",
    w_WaterTestingRequired: "w_WaterTestingRequired",
    d_RushOrder: "d_RushOrder",
    d_PaintIcon: "d_PaintIcon",
    d_RBMIcon: "d_RBMIcon",
    d_GridsRequired: "d_GridsRequired",
    d_MiniblindIcon: "d_MiniblindIcon",
    d_EngineeredIcon: "d_EngineeredIcon",
    d_ShapesRequires: "d_ShapesRequires",
  },
  schedule: {
    m_ShippingStartDate: "m_ShippingStartDate",
    m_RevisedDeliveryDate: "m_RevisedDeliveryDate",
    w_CustomerDate: "w_CustomerDate",
    w_ProductionStartDate: "w_ProductionStartDate",
    w_PaintStartDate: "w_PaintStartDate",
    w_GlassOrderDate: "w_GlassOrderDate",
    w_GlassRecDate: "w_GlassRecDate",
    d_CustomerDate: "d_CustomerDate",
    d_ProductionStartDate: "d_ProductionStartDate",
    d_PaintStartDate: "d_PaintStartDate",
    d_GlassOrderDate: "d_GlassOrderDate",
    m_TransferredDate: "m_TransferredDate",
    m_TransferredLocation: "m_TransferredLocation",
  },
  notes: {
    w_OfficeNotes: "w_OfficeNotes",
    d_OfficeNotes: "d_OfficeNotes",
    w_PlantNotes: "w_PlantNotes",
    d_DoorShopNotes: "d_DoorShopNotes",
    m_ProjectManagementNotes: "m_ProjectManagementNotes",
    m_ReturnTripNotes: "m_ReturnTripNotes",
    m_ShippingNotes: "m_ShippingNotes",
  },
  status: {
    m_TransferredLocation: "m_TransferredLocation",
    m_Status: "m_Status",
    m_WinStatus: "m_WinStatus",
    m_DoorStatus: "m_DoorStatus",
  },
};

export const applyField = (arr) => {
  return arr
    ?.filter((a) => a)
    ?.map((a) => {
      const _v = { ...a };
      if (!_v.title) {
        const { id, key, fieldCode, field } = a;
        const f = fieldCode || field || id || key;

        // if no code no title, its empty
        if (f) {
          _v.title = getFieldObj({ fieldCode: f })?.title || f;
        }
      }
      return _v;
    });
};

/*
  ========== handle 1_w_Xxxxx ==========
  naming convention
  field -> w_1_Status
  dbColumn -> Status
  fieldCode -> w_Status
*/
export const parseFieldsByfieldCode = (
  fieldCode,
  initWithOriginalStructure,
) => {
  // fieldCode can be w_Aaaa, data will be like [{field: 'w_1_Aaaa'}, {field: 'w_2_Aaa'}]
  const [kind, ...other] = fieldCode.split("_");
  const dbColumn = other?.join("_");

  if (kind === "m") {
    return [fieldCode];
  }
  return _.keys(initWithOriginalStructure)
    ?.map((fac) => {
      if (fac?.startsWith(kind + "_")) {
        return fac + "_" + dbColumn;
      }
    })
    ?.filter(Boolean);
};

export const parseFieldInfoByField = (field) => {
  let [kind, ...rest] = field?.split("_")

  // legacy of w_aaa or d_aaa
  let isLegacy = isNaN(Number(rest[0]))
  if (kind === 'm' || isLegacy) {
    const fieldCode = field
    return {
      fieldCode,
      field,
      facility: null,
      fieldObj: labelMapping[fieldCode]
    }
  }



  let [facilityCode, ...restParts] = rest
  const dbColumn = restParts?.join("_")
  const fieldCode = [kind, dbColumn]?.join("_")
  return {
    fieldCode,
    field,
    facility: FACILITY_FROM_CODE[facilityCode],
    fieldObj: labelMapping[fieldCode]
  }
}

export const parseFieldsByDbColumn = (dbColumn, initWithOriginalStructure) => {
  //
};

export const getFieldCode = (field) => {
  const frags = field?.split("_");
  const [kind, ...other] = frags;
  if (kind === "m") {
    return field;
  } else {
    const [facilityCode, ...dbColumn] = other;
    return [kind, dbColumn?.join("_")].join("_");
  }
};

export const getFieldObj = ({ field, fieldCode }) => {
  if (fieldCode) {
    return labelMapping[fieldCode];
  } else {
    return labelMapping[getFieldCode(field)];
  }
};

export const fnAssignValue = (payload) => {
  const { fields, assignFrom, assignTo, fn } = payload;
  ALL_SUBORDER_TYPES.forEach((a) => {
    const { suborder_code } = a;
    // if there is value, assign
    const fieldvlk = suborder_code + "_" + assignFrom;
    const fieldvrk = suborder_code + "_" + assignTo;
    if (fieldvlk) {
      fields[fieldvrk] = fn(fields[fieldvlk]);
    }
  });
};

export const fnAssignPrimary = (payload) => {
  const { original_fields, assignFrom, assignTo, fn } = payload;

  let primary_d = {};
  let primary_w = {};

  _.keys(original_fields).forEach((k) => {
    const prod_fields = original_fields[k];
    const [kind, facility_code, dbColumn] = k.split("_");
    const field_FacilityRoleType = [
      kind,
      facility_code,
      "FacilityRoleType",
    ]?.join("_");
    const _FacilityRoleType = prod_fields[field_FacilityRoleType];
    if (!_FacilityRoleType || _FacilityRoleType === "Primary") {
      if (kind === "d") {
        primary_d = prod_fields;
      } else {
        primary_w = prod_fields;
      }
    }
  });
};

export const spreadFacilities = (fieldSettings, initWithOriginalStructure) => {
  const facilitiesMap = {};
  const masterFields = [];
  const groupEntries = _.toPairs(initWithOriginalStructure || {});

  fieldSettings?.forEach((fieldSetting, sortid) => {
    const fieldCode = fieldSetting?.fieldCode;
    if (!fieldCode) return;

    const [kind, ...restParts] = fieldCode.split("_");
    const dbColumn = restParts.join("_");

    // handle master fields: m_BranchId
    if (kind === "m") {
      const field = `m_${dbColumn}`;
      if (initWithOriginalStructure?.m?.[field] === undefined) return;

      masterFields.push({
        ...fieldSetting,
        field,
        sortid,
      });
      return;
    }

    // handle facility fields: w_Hello -> w_1_Hello / w_2_Hello ...
    groupEntries.forEach(([groupKey, groupData]) => {
      if (!groupKey?.startsWith(`${kind}_`)) return;

      const field = `${groupKey}_${dbColumn}`;
      if (groupData?.[field] === undefined) return;

      const [, facilityCode] = groupKey.split("_");
      const facilityName = constants.FACILITY_FROM_CODE[facilityCode];

      if (!facilitiesMap[facilityName]) {
        facilitiesMap[facilityName] = {
          facility: facilityName,
          facilityRoleType: "",
          fields: [],
        };
      }

      if (dbColumn === "FacilityRoleType") {
        facilitiesMap[facilityName].facilityRoleType = groupData[field];
      }

      facilitiesMap[facilityName].fields.push({
        ...fieldSetting,
        field,
        sortid,
      });
    });
  });

  const facilities = _.values(facilitiesMap).map((item) => ({
    ...item,
    fields: _.sortBy(item.fields, "sortid"),
  }));

  const sortedFacilities = facilities.sort((a, b) => {
    const aPrimary = !a.facilityRoleType || a.facilityRoleType === "Primary";
    const bPrimary = !b.facilityRoleType || b.facilityRoleType === "Primary";

    if (aPrimary === bPrimary) return 0;
    return aPrimary ? -1 : 1;
  });

  return {
    master: _.sortBy(masterFields, "sortid"),
    facilities: sortedFacilities,
  };
};

export default labelMapping;
