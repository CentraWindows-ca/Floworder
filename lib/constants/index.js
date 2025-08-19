import constants_labelMapping, { applyField } from "./constants_labelMapping";

// === constants work order step
export const Draft = "Draft";
export const DraftReservation = "DraftReservation";
export const ConfirmedReservation = "ConfirmedReservation";
export const CompletedReservation = "CompletedReservation";
export const Scheduled = "Scheduled";
export const InProgress = "InProgress";
export const ReadyToShip = "ReadyToShip";
export const Transferred = "Transferred";
export const Shipped = "Shipped";
export const OnHold = "OnHold";
export const Pending = "Pending";
export const Cancelled = "Cancelled";
export const Rejected = "Rejected";

// === workorder mapping
export const WORKORDER_MAPPING = {
  Draft: {
    label: "Draft",
    key: "Draft Work Order", // database string
    systemName: Draft, // front-end constant name, in case we want to update db
    color: "#DDA0DD",
    textColor: "#000",
    icon: <i className="fa-solid fa-pen-to-square" />,
  },
  Scheduled: {
    label: "Scheduled",
    key: "Scheduled Work Order",
    systemName: Scheduled, // front-end constant name, in case we want to update db
    color: "#9FB6CD",
    textColor: "#0c1f26",
    icon: <i className="fa-solid fa-clock" />,
  },
  InProgress: {
    label: "In Progress",
    key: "In-Progress",
    systemName: InProgress, // front-end constant name, in case we want to update db
    color: "#A5D6A7",
    textColor: "#000000",
    icon: <i className="fa-solid fa-spinner" />,
  },
  ReadyToShip: {
    label: "Ready To Ship",
    key: "Ready To Ship",
    systemName: ReadyToShip, // front-end constant name, in case we want to update db
    color: "#FFFACD",
    textColor: "#34444B",
    icon: <i className="fa-solid fa-box-open" />,
  },
  Transferred: {
    label: "Transferred",
    key: "Transferred",
    systemName: Transferred, // front-end constant name, in case we want to update db
    color: "#9AC94F",
    textColor: "#000000",
    icon: <i className="fa-solid fa-shuffle" />,
  },
  Shipped: {
    label: "Shipped",
    key: "Shipped",
    systemName: Shipped, // front-end constant name, in case we want to update db
    color: "#FFC966",
    textColor: "#0c2c00",
    icon: <i className="fa-solid fa-truck" />,
  },
  OnHold: {
    label: "On Hold",
    key: "On Hold",
    systemName: OnHold, // front-end constant name, in case we want to update db
    color: "#FF6347",
    textColor: "#FFFFFF",
    icon: <i className="fa-solid fa-pause-circle" />,
  },
  Pending: {
    label: "Pending",
    key: "Pending",
    systemName: Pending, // front-end constant name, in case we want to update db
    color: "#64B8ED",
    textColor: "#FFFFFF",
    icon: <i className="fa-solid fa-hourglass-half" />,
  },
  Rejected: {
    label: "Rejected",
    key: "Rejected",
    systemName: Rejected, // front-end constant name, in case we want to update db
    color: "#ae7e75",
    textColor: "#FFFFFF",
    icon: <i className="fa-solid fa-hand" />,
  },
  Cancelled: {
    label: "Cancelled",
    key: "Cancelled",
    systemName: Cancelled, // front-end constant name, in case we want to update db
    color: "#EEEEEE",
    icon: <i className="fa-solid fa-ban" />,
  },

  // ============ reservations ============
  DraftReservation: {
    label: "Draft Reservation",
    key: "Draft Reservations",
    systemName: DraftReservation, // front-end constant name, in case we want to update db
    color: "#AAA05D",
    textColor: "#FFFFFF",
    icon: <i className="fa-solid fa-file-circle-check" />,
    isReservation: true,
  },
  ConfirmedReservation: {
    label: "Confirmed Reservation",
    key: "Confirmed Reservations",
    systemName: ConfirmedReservation, // front-end constant name, in case we want to update db
    color: "#9393ff",
    textColor: "#FFFFFF",
    icon: <i className="fa-solid fa-calendar-check" />,
    isReservation: true,
  },
  CompletedReservation: {
    label: "Completed Reservation",
    key: "Completed Reservations",
    systemName: CompletedReservation, // front-end constant name, in case we want to update db
    color: "#F3E6FB",
    textColor: "#32363a",
    icon: <i className="fa-solid fa-circle-check" />,
    isReservation: true,
  },
};

export const PAGINATION = {
  perPage: 50,
  DEFAULT_ORDER: [["createdAt", "DESC"]],
};
const COLORS = {
  centraBlue: "#005db9",
  centraBlueLight: "#e0eeff",
  centraBlueLightest: "#f4f9ff",
  centraDark: "#3b444b",
  centraWhite: "#fff",
  centraGreen: "#16A34A",
  centraGreenHover: "#1dd762",
  centraYellow: "#f2ff56",
  centraGray: "#fafafa",
  centraYellowOrange: "#FFAE42",
};
export const PROD_TYPES = {
  m: 1,
};

export const ITEM_STATUS = [
  {
    label: "Not Started",
    key: "Not Started",
    sort: 0,
  },
  {
    label: "In-Progress",
    key: "In-Progress", // "inProgress",
    color: "#A5D6A7",
    textColor: "#FFFFFF",
    sort: 1,
  },
  {
    label: "Ready To Ship",
    key: "Ready To Ship", //"readyToShip",
    color: "#FFFACD",
    textColor: "#64748B",
    sort: 3,
  },
  {
    label: "Shipped",
    key: "Shipped", //"shipped",
    color: "#FFC966",
    textColor: "#FFFFFF",
    sort: 4,
  },
  {
    label: "On Hold",
    key: "On Hold", //"onHold",
    color: "#FF6347",
    textColor: "#FFFFFF",
    sort: 5,
  },
];
export const ITEM_LITES = [
  {
    label: "N/A",
    key: "",
  },
  {
    label: "Single Lite",
    key: "Single Lite", //"draft",
  },
  {
    label: "Multi Lite",
    key: "Multi Lite",
  },
];

export const ORDER_STATUS = [
  WORKORDER_MAPPING.Draft,
  WORKORDER_MAPPING.Scheduled,
  WORKORDER_MAPPING.InProgress,
  WORKORDER_MAPPING.ReadyToShip,
  WORKORDER_MAPPING.Transferred,
  WORKORDER_MAPPING.Shipped,

  WORKORDER_MAPPING.DraftReservation,
  WORKORDER_MAPPING.ConfirmedReservation,
  WORKORDER_MAPPING.CompletedReservation,

  WORKORDER_MAPPING.OnHold,
  WORKORDER_MAPPING.Pending,
  WORKORDER_MAPPING.Cancelled,
  WORKORDER_MAPPING.Rejected,
];

export const ORDER_TRANSFER_FIELDS = {
  [WORKORDER_MAPPING.Transferred.key]: {
    transferredDate: {
      required: true,
    },
    transferredLocation: {
      required: true,
    },
    // notes: {
    //   required: false
    // },
  },
  [WORKORDER_MAPPING.Shipped.key]: {
    shippedDate: {
      required: true,
    },
  },
};

export const ORDER_STATUS_AS_GROUP = [
  // [
  //   {
  //     label: "All Work orders",
  //     key: "",
  //   },
  // ],
  [
    WORKORDER_MAPPING.Pending,
    WORKORDER_MAPPING.Rejected,
    WORKORDER_MAPPING.Cancelled,
  ],
  [
    WORKORDER_MAPPING.Draft,
    WORKORDER_MAPPING.Scheduled,
    WORKORDER_MAPPING.InProgress,
    WORKORDER_MAPPING.OnHold,
    WORKORDER_MAPPING.ReadyToShip,
    WORKORDER_MAPPING.Transferred,
    WORKORDER_MAPPING.Shipped,
  ],
  [
    WORKORDER_MAPPING.DraftReservation,
    WORKORDER_MAPPING.ConfirmedReservation,
    WORKORDER_MAPPING.CompletedReservation,
  ],
];

export const ADDON_STATUS = {
  attached: "0",
  detached: "1"
}

export const WORKORDER_WORKFLOW = {
  // ========== temporary solution: @250423_handle_reservation: allow between regular and reservation ===========
  DraftReservation: [ConfirmedReservation, Draft],
  ConfirmedReservation: [DraftReservation, CompletedReservation, Scheduled],
  CompletedReservation: [ConfirmedReservation],

  //
  Draft: [Scheduled, OnHold, Pending, DraftReservation, Cancelled],
  Scheduled: [InProgress, OnHold, ConfirmedReservation, Cancelled],
  InProgress: [Scheduled, ReadyToShip, OnHold, Cancelled],
  ReadyToShip: [InProgress, Transferred, Shipped, OnHold, Cancelled],
  Transferred: [ReadyToShip, Shipped, OnHold, Cancelled],
  Shipped: [Transferred, ReadyToShip, Cancelled],
  OnHold: [Scheduled, InProgress, ReadyToShip, Cancelled],
  Pending: [Cancelled],
  Cancelled: [Draft],
};

export const ITEM_DOOR_TYPES = [
  { key: "D", value: "D" },
  { key: "DS", value: "DS" },
  { key: "SD", value: "SD" },
  { key: "SDS", value: "SDS" },
  { key: "SDT", value: "SDT" },
  { key: "DST", value: "DST" },
  { key: "DD", value: "DD" },
  { key: "DDT", value: "DDT" },
  { key: "DT", value: "DT" },
];

export const FILTER_OPERATOR = {
  Equals: "Equals", // =
  NotEquals: "NotEquals", // !=
  Contains: "Contains", // LIKE
  GreaterThan: "GreaterThan", // >
  LessThan: "LessThan", // <
  GreaterOrEqual: "GreaterOrEqual", // >=
  LessOrEqual: "LessOrEqual", // <=
  Between: "Between", // BETWEEN
  In: "In", // IN
};

export const GlassRowStates = {
  ordered: {
    color: "#93C5FD",
    label: "Ordered",
  }, // Blue
  notOrdered: {
    color: "#FF6347",
    label: "Not Ordered",
  }, // Red
  received: {
    color: "#FFC966",
    label: "Received",
  }, // Orange
  partiallyOrdered: {
    color: "#C084FC", // Light Purple
    label: "Partially Ordered",
  },
  partiallyReceived: {
    color: "#A4D3A2", // Light Green
    label: "Partially Received",
  },
  na: {
    color: "#E0E0E0", // Light Green
    label: "N/A",
  },
};

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

export const WorkOrderSelectOptions = {
  // === using
  branches: [
    { key: "selectOne", label: "-" },
    { key: "000000032", label: "Langley" },
    { key: "000000033", label: "Kelowna" },
    { key: "000000035", label: "Nanaimo" },
    { key: "000023276", label: "Victoria" },
    { key: "VVMM59159", label: "Calgary" },
    { key: "VVJ203741", label: "Edmonton" },
    // { key: "unAllocated", value: "", label: "Unallocated" },
  ],

  // === using
  shippingTypes: [
    { key: "Select One", label: "-" },
    { key: "Delivery", label: "Delivery" },
    { key: "PickUp", label: "Pick Up" },
    { key: "unAllocated", label: "Unallocated" },
  ],

  // === using
  glassSuppliers: [
    { key: "Select One", label: "-" },
    { key: "PFG", label: "PFG" },
    { key: "Cardinal", label: "Cardinal" },
    { key: "Centra Calgary", label: "Centra Calgary" },
    { key: "No Glass", label: "No Glass" },
    { key: "Unallocated", label: "Unallocated" },
  ],

  // === using
  glassOptions: [
    { key: "Select One", label: "-" },
    {
      key: "All Season Advanced Performance",
      label: "All Season Advanced Performance",
    },
    {
      key: "Extreme Performance",
      label: "Extreme Performance",
    },
    {
      key: "Maximum Performance",
      label: "Maximum Performance",
    },
  ],

  // === using
  residentialTypes: [
    { key: "selectOne", label: "-" },
    { key: "SF", label: "Single Family" },
    { key: "MF", label: "Multi Family" },
    // { key: "unAllocated", value: "", label: "Unallocated" }
  ],

  // === using
  jobTypes: [
    { key: "selectOne", label: "-" },
    { key: "SO", label: "Supply Only" },
    { key: "SI", label: "Supply and Install" },
    { key: "RES", label: "Reservation" },
    { key: "PendingRES", label: "Plan Reservation" },
    // { key: "unAllocated", value: "", label: "Unallocated" }
  ],

  // === using
  customerTypes: [
    { key: "selectOne", label: "-" },
    { key: "Builder", label: "Builder" },
    { key: "Dealer", label: "Dealer" },
    { key: "Homeowner", label: "Homeowner" },
    {
      key: "Modular Builder",
      label: "Modular Builder",
    },
    {
      key: "New Construction",
      label: "New Construction",
    },
    {
      key: "Restoration Contractor",
      label: "Restoration Contractor",
    },
    { key: "Track Builder", label: "Track Builder" },
    { key: "unAllocated", label: "Unallocated" },
  ],

  // === using
  project: [
    { key: "selectOne", label: "-" },
    { key: "Yes", label: "Yes" },
    { key: "No", label: "No" },
  ],

  // not using ====
  // serviceBranches: [
  //   { key: "selectOne", value: "", label: "-" },
  //   { key: "Calgary", value: "Calgary", label: "Calgary" },
  //   { key: "Langley", value: "Langley", label: "Langley" },
  //   { key: "Kelowna", value: "Kelowna", label: "Kelowna" },
  //   { key: "Nanaimo", value: "Nanaimo", label: "Nanaimo" },
  //   { key: "Victoria", value: "Victoria", label: "Victoria" },
  // ],

  // not using ====
  // originalWODateTypes: [
  //   { key: "selectOne", value: "", label: "-" },
  //   { key: "year", value: "Year" },
  //   { key: "month", value: "Month" },
  //   { key: "date", value: "Date" },
  // ],

  // not using ====
  // serviceType: [
  //   { key: "selectOne", value: "", label: "-", category: "" },
  //   { key: "supplyOnlyWarranty", value: "Supply Only", category: "SO" },
  //   { key: "supplyInsWarranty", value: "Supply And Install", category: "SI" },
  //   { key: "chrgService", value: "Chargeable Service", category: "SO" },
  //   { key: "warr&Chrg", value: "Warranty & Chargeable", category: "SI" },
  //   { key: "newSale", value: "New Sale", category: "SI" },
  //   { key: "windowTesting", value: "Window Testing", category: "SO" },
  //   { key: "supplyOnlyService", value: "Supply Only Service", category: "SO" },
  //   { key: "3rdPartyWarranty", value: "3rd Party Warranty", category: "SI" },
  //   {
  //     key: "supplyOnlyGoodwill",
  //     value: "Supply Only Goodwill",
  //     category: "SO",
  //   },
  // ],

  // not using ====
  // serviceJobType: [
  //   { key: "selectOne", value: "", label: "-" },
  //   { key: "warranty", value: "Warranty" },
  //   { key: "fixed", value: "Fixed" },
  //   { key: "billable", value: "Billable" },
  // ],

  // not using ====
  // serviceHighRisk: [
  //   { key: "selectOne", value: "", label: "-" },
  //   { key: "yes", value: "Yes" },
  //   { key: "no", value: "No" },
  // ],

  // not using ====
  // serviceReason: [
  //   { key: "selectOne", value: "", label: "-" },
  //   { key: "windowPlant", value: "Window Plant Issues" },
  //   { key: "dataEntry", value: "Data Entry Issues" },
  //   { key: "installations", value: "Installations Issues" },
  //   { key: "vendor", value: "Vendor Issues" },
  //   { key: "shippingDelivery", value: "Shipping / Delivery Issues" },
  //   { key: "purchasing", value: "Purchasing Issues" },
  //   { key: "customer", value: "Customer Issues" },
  //   { key: "appearance", value: "Appearance" },
  // ],

  // not using ====
  // serviceSubmittedBy: [
  //   { key: "selectOne", value: "", label: "-" },
  //   { key: "salesRep", value: "Sales Rep" },
  //   { key: "employee", value: "Employee" },
  //   { key: "windowPlant", value: "Window Plant" },
  //   { key: "installDept", value: "Installation Department" },
  //   { key: "customer", value: "Customer" },
  //   { key: "other", value: "Other" },
  // ],

  // not using ====
  // serviceRequestedBy: [
  //   { key: "selectOne", value: "", label: "-" },
  //   { key: "website", value: "Centra Website" },
  //   { key: "tel", value: "Telephone / Direct Contact" },
  //   { key: "email", value: "Email" },
  //   { key: "salesRep", value: "Sales Rep" },
  //   { key: "installDept", value: "Installation Department" },
  //   { key: "supplyOnlySales", value: "Supply Only Sales" },
  //   { key: "supplyOnlyCustomer", value: "Supply Only Customer" },
  //   { key: "other", value: "Other" },
  // ],

  // not using ====
  // serviceRBO: [
  //   { key: "selectOne", value: "", label: "-" },
  //   { key: "yes", value: "Yes" },
  //   { key: "no", value: "No" },
  // ],
  // serviceRemainingBalanceOwing: [
  //   { key: "selectOne", value: "", label: "-" },
  //   { key: "yes", value: "Yes" },
  //   { key: "no", value: "No" },
  // ],
};

export const ManufacturingFacilities = {
  Langley: "Langley",
  Calgary: "Calgary",
  // All: "All",
};

export const ManufacturingBuildings = {
  bldgA: "Bldg A",
  bldgB: "Bldg B",
  bldgC: "Bldg C",
  bldgCalgary: "Calgary",
  bldgAll: "All",
  bldgLangley: "Langley",
};

export const FEATURE_CODES = {
  "om.prod.wo": "om.prod.wo",
  "om.prod.reservation": "om.prod.reservation",
  "om.prod.wo.basic": "om.prod.wo.basic",
  "om.prod.wo.information.window": "om.prod.wo.information.window",
  "om.prod.wo.information.door": "om.prod.wo.information.door",
  "om.prod.wo.options.window": "om.prod.wo.options.window",
  "om.prod.wo.options.door": "om.prod.wo.options.door",

  "om.prod.wo.scheduleWithoutProduction.window":
    "om.prod.wo.scheduleWithoutProduction.window",
  "om.prod.wo.scheduleWithoutProduction.door":
    "om.prod.wo.scheduleWithoutProduction.door",
  "om.prod.wo.scheduleWithProduction.window":
    "om.prod.wo.scheduleWithProduction.window",
  "om.prod.wo.scheduleWithProduction.door":
    "om.prod.wo.scheduleWithProduction.door",
  "om.prod.wo.scheduleShippedDate": "om.prod.wo.scheduleShippedDate",
  "om.prod.wo.notes": "om.prod.wo.notes",
  "om.prod.wo.returnTrips": "om.prod.wo.returnTrips",
  "om.prod.wo.windowitems": "om.prod.wo.windowitems",
  "om.prod.wo.dooritems": "om.prod.wo.dooritems",

  "om.prod.wo.statusReservation": "om.prod.wo.statusReservation",
  "om.prod.history": "om.prod.history",
  "om.prod.wo.status.window": "om.prod.wo.status.window",
  "om.prod.wo.status.door": "om.prod.wo.status.door",
  "om.prod.woGetWindowMaker": "om.prod.woGetWindowMaker",
  "om.prod.woHardDelete": "om.prod.woHardDelete",
  "om.prod.wo.informationPriceBeforeTax": "om.prod.wo.informationPriceBeforeTax",
  "om.prod.woDetachAddOn": "om.prod.woDetachAddOn"

  // "om.prod.reservationList": "om.prod.reservationList",
  // "om.prod.woList.so": "om.prod.woList.so",
  // "om.prod.woList.si": "om.prod.woList.si"
};

const checkProvince = (branch) => {
  if (["Calgary"].includes(branch)) {
    return "AB";
  } else {
    return "BC";
  }
};


// ================================ 
// holding changes that we dont want users to see
// (chunk at the display, unless we need to block the function from running)
// before release, remove boolean conditions (dont keep trash)

const DEV_HOLDING_FEATURES = {
  v20250815_screen_number_display: true,
  v20250815_addon: false,
  v20250815_sitelockout_display: false
}

export default {
  COLORS,
  PAGINATION,
  FLOWFINITY_SYSTEM_FIELDS,
  WorkOrderSelectOptions,
  ManufacturingFacilities,
  ManufacturingBuildings,
  FILTER_OPERATOR,
  PROD_TYPES,
  FEATURE_CODES,
  constants_labelMapping,
  applyField,
  checkProvince,

  // 
  DEV_HOLDING_FEATURES
};
