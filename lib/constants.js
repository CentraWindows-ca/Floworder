export const PAGINATION = {
  perPage: 50,
  DEFAULT_ORDER: [["createdAt", "DESC"]],
};

export const ORDER_STATES = [
  {
    label: "All Work orders",
    key: 0,
  },
  {
    label: "Draft",
    key: 1, //"draft",
    color: "#DDA0DD",
    textColor: "#FFFFFF",
  },
  {
    label: "Scheduled",
    key: 2, // "scheduled",
    color: "#9FB6CD",
    textColor: "#FFFFFF",
  },
  {
    label: "In Progress",
    key: 3, // "inProgress",
    color: "#A5D6A7",
    textColor: "#FFFFFF",
  },
  {
    label: "Ready to Ship",
    key: 4, //"readyToShip",
    color: "#FFFACD",
    textColor: "#64748B",
  },
  {
    label: "Shipped",
    key: 5, //"shipped",
    color: "#FFC966",
    textColor: "#FFFFFF",
  },
  {
    label: "On Hold",
    key: 6, //"onHold",
    color: "#FF6347",
    textColor: "#FFFFFF",
  },
]

export const FLOWFINITY_SYSTEM_FIELDS = {
  BRANCHES: [
    "Kamloops",
    "Kelowna",
    "Langley HVAC",
    "LowerMainland",
    "Nanaimo",
    "Victoria",
    "Calgary",
  ],
  PRODUCTS: [
    "Sealed Unit",
    "Fiberglass Slabs",
    "Frame",
    "Window Sash",
    "Window",
    "Screen",
    "Sash",
    "Window Frame",
    "Other",
  ],
  DEPARTMENTS: [
    "Assembly",
    "Back End",
    "Bead/Pocket Fill/Sill Track",
    "Centra Plant",
    "Centra Window Plant",
    "Data Entry",
    "Estimating",
    "Fabricator",
    "Glazing",
    "Install",
    "Installation",
    "Logistics",
    "Other",
    "Production Admin",
    "Production Office",
    "Re-measure",
    "Sales",
    "Sawyer",
    "Screens",
    "Service",
    "Shipping",
    "Vendor",
    "Welder",
    "Window Plant",
  ],
};

export const ProductionStates = {
  inProgress: {
    color: "#A5D6A7",
    textColor: "#FFFFFF",
    label: "In Progress",
  }, // Green
  scheduled: {
    color: "#9FB6CD",
    textColor: "#FFFFFF",
    label: "Scheduled",
  }, // Blue
  draft: {
    color: "#DDA0DD",
    textColor: "#FFFFFF",
    label: "Draft",
  }, // Purple
  readyToShip: {
    color: "#FFFACD",
    textColor: "#64748B",
    label: "Ready To Ship",
  }, // Yellow
  shipped: {
    color: "#FFC966",
    textColor: "#FFFFFF",
    label: "Shipped",
  }, // Orange
  onHold: {
    color: "#FF6347",
    textColor: "#FFFFFF",
    label: "On Hold",
  }, // Red
};
export const WorkOrderSelectOptions = {
  branches: [
    { key: "selectOne", value: "Select One", label: "-" },
    { key: "VVMM59159", value: "VVMM59159", label: "Calgary" },
    { key: "000000032", value: "000000032", label: "Langley" },
    { key: "000000033", value: "000000033", label: "Kelowna" },
    { key: "000000035", value: "000000035", label: "Nanaimo" },
    { key: "000023276", value: "000023276", label: "Victoria" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  shippingTypes: [
    { key: "selectOne", value: "Select One", label: "-" },
    { key: "delivery", value: "Delivery", label: "Delivery" },
    { key: "pickup", value: "PickUp", label: "Pick Up" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  glassSuppliers: [
    { key: "selectOne", value: "Select One", label: "-" },
    { key: "pfg", value: "PFG", label: "PFG" },
    { key: "cardinal", value: "Cardinal", label: "Cardinal" },
    { key: "GlassFab", value: "Centra Calgary", label: "Centra Calgary" },
    { key: "noGlass", value: "No Glass", labelk: "No Glass" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  glassOptions: [
    { key: "selectOne", value: "Select One", label: "-" },
    {
      key: "asap",
      value: "All Season Advanced Performance",
      label: "All Season Advanced Performance",
    },
    { key: "ep", value: "Extreme Performance", label: "Extreme Performance" },
    { key: "mp", value: "Maximum Performance", label: "Maximum Performance" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  residentialTypes: [
    { key: "selectOne", value: "", label: "-" },
    { key: "sf", value: "SF", label: "Single Family" },
    { key: "mf", value: "MF", label: "Multi Family" },
    // { key: "unAllocated", value: "", label: "Unallocated" }
  ],
  jobTypes: [
    { key: "selectOne", value: "", label: "-" },
    { key: "so", value: "SO", label: "Supply Only" },
    { key: "si", value: "SI", label: "Supply and Install" },
    { key: "res", value: "RES", label: "Reservation" },
    { key: "pendingRes", value: "PendingRES", label: "Plan Reservation" },
    // { key: "unAllocated", value: "", label: "Unallocated" }
  ],
  customerTypes: [
    { key: "selectOne", value: "", label: "-" },
    { key: "builder", value: "Builder", label: "Builder" },
    { key: "dealer", value: "Dealer", label: "Dealer" },
    { key: "homeOwner", value: "Homeowner", label: "Homeowner" },
    {
      key: "modularBuilder",
      value: "Modular Builder",
      label: "Modular Builder",
    },
    {
      key: "newConstruction",
      value: "New Construction",
      label: "New Construction",
    },
    {
      key: "restorationContractor",
      value: "Restoration Contractor",
      label: "Restoration Contractor",
    },
    { key: "trackBuilder", value: "Track Builder", label: "Track Builder" },
    { key: "unAllocated", value: "", label: "Unallocated" },
  ],
  serviceBranches: [
    { key: "selectOne", value: "", label: "-" },
    { key: "Calgary", value: "Calgary", label: "Calgary" },
    { key: "Langley", value: "Langley", label: "Langley" },
    { key: "Kelowna", value: "Kelowna", label: "Kelowna" },
    { key: "Nanaimo", value: "Nanaimo", label: "Nanaimo" },
    { key: "Victoria", value: "Victoria", label: "Victoria" },
  ],
  originalWODateTypes: [
    { key: "selectOne", value: "", label: "-" },
    { key: "year", value: "Year" },
    { key: "month", value: "Month" },
    { key: "date", value: "Date" },
  ],
  serviceType: [
    { key: "selectOne", value: "", label: "-", category: "" },
    { key: "supplyOnlyWarranty", value: "Supply Only", category: "SO" },
    { key: "supplyInsWarranty", value: "Supply And Install", category: "SI" },
    { key: "chrgService", value: "Chargeable Service", category: "SO" },
    { key: "warr&Chrg", value: "Warranty & Chargeable", category: "SI" },
    { key: "newSale", value: "New Sale", category: "SI" },
    { key: "windowTesting", value: "Window Testing", category: "SO" },
    { key: "supplyOnlyService", value: "Supply Only Service", category: "SO" },
    { key: "3rdPartyWarranty", value: "3rd Party Warranty", category: "SI" },
    {
      key: "supplyOnlyGoodwill",
      value: "Supply Only Goodwill",
      category: "SO",
    },
  ],
  serviceJobType: [
    { key: "selectOne", value: "", label: "-" },
    { key: "warranty", value: "Warranty" },
    { key: "fixed", value: "Fixed" },
    { key: "billable", value: "Billable" },
  ],
  serviceHighRisk: [
    { key: "selectOne", value: "", label: "-" },
    { key: "yes", value: "Yes" },
    { key: "no", value: "No" },
  ],
  serviceReason: [
    { key: "selectOne", value: "", label: "-" },
    { key: "windowPlant", value: "Window Plant Issues" },
    { key: "dataEntry", value: "Data Entry Issues" },
    { key: "installations", value: "Installations Issues" },
    { key: "vendor", value: "Vendor Issues" },
    { key: "shippingDelivery", value: "Shipping / Delivery Issues" },
    { key: "purchasing", value: "Purchasing Issues" },
    { key: "customer", value: "Customer Issues" },
    { key: "appearance", value: "Appearance" },
  ],
  serviceSubmittedBy: [
    { key: "selectOne", value: "", label: "-" },
    { key: "salesRep", value: "Sales Rep" },
    { key: "employee", value: "Employee" },
    { key: "windowPlant", value: "Window Plant" },
    { key: "installDept", value: "Installation Department" },
    { key: "customer", value: "Customer" },
    { key: "other", value: "Other" },
  ],
  serviceRequestedBy: [
    { key: "selectOne", value: "", label: "-" },
    { key: "website", value: "Centra Website" },
    { key: "tel", value: "Telephone / Direct Contact" },
    { key: "email", value: "Email" },
    { key: "salesRep", value: "Sales Rep" },
    { key: "installDept", value: "Installation Department" },
    { key: "supplyOnlySales", value: "Supply Only Sales" },
    { key: "supplyOnlyCustomer", value: "Supply Only Customer" },
    { key: "other", value: "Other" },
  ],
  serviceRBO: [
    { key: "selectOne", value: "", label: "-" },
    { key: "yes", value: "Yes" },
    { key: "no", value: "No" },
  ],
  serviceRemainingBalanceOwing: [
    { key: "selectOne", value: "", label: "-" },
    { key: "yes", value: "Yes" },
    { key: "no", value: "No" },
  ],
  project: [
    { key: "selectOne", value: "", label: "-" },
    { key: "yes", value: "Yes" },
    { key: "no", value: "No" },
  ],
};

export const ManufacturingFacilities = {
  Langley: "Langley",
  Calgary: "Calgary",
  All: "All",
};

export const ManufacturingBuildings = {
  bldgA: "Bldg A",
  bldgB: "Bldg B",
  bldgC: "Bldg C",
  bldgCalgary: "Calgary",
  bldgAll: "All",
  bldgLangley: "Langley"
};

export default {
  PAGINATION,
  FLOWFINITY_SYSTEM_FIELDS,
  WorkOrderSelectOptions,
  ManufacturingFacilities,
  ManufacturingBuildings
};
