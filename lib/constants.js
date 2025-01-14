export const PAGINATION = {
  perPage: 50,
  DEFAULT_ORDER: [["createdAt", "DESC"]],
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
    textColor: "#FFFFFF",
    label: "On Hold",
  }, // Red
};


export default {
  PAGINATION,
  FLOWFINITY_SYSTEM_FIELDS
};
