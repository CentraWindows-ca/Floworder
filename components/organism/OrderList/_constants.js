import _ from "lodash";
import constants, {
  WorkOrderSelectOptions,
  ORDER_STATUS,
  WORKORDER_MAPPING,
} from "lib/constants";

const COLUMN_PRODUCT_NUMBERS = [
  "m_NumberOfWindows",
  "m_NumberOfPatioDoors",
  "m_NumberOfSwingDoors",
  "m_NumberOfDoors",
  "m_NumberOfOthers",
];
const COLUMN_PRODUCT_NUMBERS_BREAKDOWN = [
  "w__26CA",
  "w__26HY",
  "w__27DS",
  "w__29CA",
  "w__29CM",
  "w__52PD",
  "w__61DR",
  "w__68CA",
  "w__68SL",
  "w__68VS",
  "w__88SL",
  "w__88VS",
  "d__REDR",
  "d__CDLD",
  "d__RESD",
];
const COLUMN_PROJECT = [
  "m_CustomerName",
  "m_ProjectName",
  "m_ProjectManagerName"
]

export const COLUMN_SEQUENCE_FOR_STATUS = (status, columns) => {
  let sequence = [];
  switch (status) {
    case WORKORDER_MAPPING.Pending.key:
      sequence = [
        "m_WorkOrderNo",
        "m_CreatedAt_display",
        "m_CreatedBy",
        "m_LastModifiedAt_display",
        "m_LastModifiedBy",
        "m_InstallStatus",
        "m_FormStatus",
        "m_Branch",
        "w_CustomerDate_display",
        "d_CustomerDate_display",
        "m_JobType",
        ...COLUMN_PRODUCT_NUMBERS,
        ...COLUMN_PRODUCT_NUMBERS_BREAKDOWN,
        ...COLUMN_PROJECT
      ];
      break;
    case WORKORDER_MAPPING.Draft.key:
      sequence = [
        "m_WorkOrderNo",
        "m_Status_display",
        "w_Status_display",
        "d_Status_display",
        "m_Branch",
        "m_JobType",
        ...COLUMN_PRODUCT_NUMBERS,
        ...COLUMN_PRODUCT_NUMBERS_BREAKDOWN,
        "m_TotalLBRMin",
        "w_BatchNo",
        "w_BlockNo",
        "d_BatchNo",
        "d_BlockNo",
        "m_InvStatus",
        "m_CreatedAt_display",
        "m_CreatedBy",
        "m_LastModifiedAt_display",
        "m_LastModifiedBy",
        "w_CustomerDate_display",
        "d_CustomerDate_display",
        ...COLUMN_PROJECT
      ];
      break;
    case WORKORDER_MAPPING.Scheduled.key:
    case WORKORDER_MAPPING.InProgress.key:
    case WORKORDER_MAPPING.OnHold.key:
      sequence = [
        "m_WorkOrderNo",
        "m_Status_display",
        "w_Status_display",
        "d_Status_display",
        "w_ProductionStartDate",
        "d_ProductionStartDate",
        "w_CustomerDate_display",
        "d_CustomerDate_display",
        "m_Branch",
        "m_JobType",
        ...COLUMN_PRODUCT_NUMBERS,
        ...COLUMN_PRODUCT_NUMBERS_BREAKDOWN,
        "m_TotalLBRMin",
        "w_BatchNo",
        "w_BlockNo",
        "d_BatchNo",
        "d_BlockNo",
        "m_InvStatus",
        "m_CreatedAt_display",
        "m_CreatedBy",
        "m_LastModifiedAt_display",
        "m_LastModifiedBy",
        ...COLUMN_PROJECT
      ];
      break;
    case WORKORDER_MAPPING.ReadyToShip.key:
      sequence = [
        "m_WorkOrderNo",
        "m_Status_display",
        "w_Status_display",
        "d_Status_display",
        "m_ShippingStartDate",
        "w_CustomerDate_display",
        "d_CustomerDate_display",
        "m_Branch",
        "m_JobType",
        ...COLUMN_PRODUCT_NUMBERS,
        ...COLUMN_PRODUCT_NUMBERS_BREAKDOWN,
        "m_TotalLBRMin",
        "w_BatchNo",
        "w_BlockNo",
        "d_BatchNo",
        "d_BlockNo",
        "m_InvStatus",
        "m_CreatedAt_display",
        "m_CreatedBy",
        "m_LastModifiedAt_display",
        "m_LastModifiedBy",
        ...COLUMN_PROJECT
      ];
      break;
    case WORKORDER_MAPPING.Transferred.key:
      sequence = [
        "m_WorkOrderNo",
        "m_Status_display",
        "w_Status_display",
        "d_Status_display",
        "m_TransferredDate",
        "m_ShippingStartDate",
        "w_CustomerDate_display",
        "d_CustomerDate_display",
        "m_Branch",
        "m_JobType",
        ...COLUMN_PRODUCT_NUMBERS,
        ...COLUMN_PRODUCT_NUMBERS_BREAKDOWN,
        "w_BatchNo",
        "w_BlockNo",
        "d_BatchNo",
        "d_BlockNo",
        "m_InvStatus",
        "m_CreatedAt_display",
        "m_CreatedBy",
        "m_LastModifiedAt_display",
        "m_LastModifiedBy",
        "w_CustomerDate_display",
        "d_CustomerDate_display",
        ...COLUMN_PROJECT
      ];
      break;
    case WORKORDER_MAPPING.Shipped.key:
      sequence = [
        "m_WorkOrderNo",
        "m_Status_display",
        "w_Status_display",
        "d_Status_display",
        "m_ShippedDate",
        "m_Branch",
        "m_JobType",
        ...COLUMN_PRODUCT_NUMBERS,
        ...COLUMN_PRODUCT_NUMBERS_BREAKDOWN,
        "w_BatchNo",
        "w_BlockNo",
        "d_BatchNo",
        "d_BlockNo",
        "m_InvStatus",
        "m_CreatedAt_display",
        "m_CreatedBy",
        "m_LastModifiedAt_display",
        "m_LastModifiedBy",
        "w_CustomerDate_display",
        "d_CustomerDate_display",
        ...COLUMN_PROJECT
      ];
      break;
    case WORKORDER_MAPPING.DraftReservation.key:
    case WORKORDER_MAPPING.ConfirmedReservation.key:
    case WORKORDER_MAPPING.CompletedReservation.key:
      sequence = [
        "m_WorkOrderNo",
        "m_Status_display",
        "w_Status_display",
        "d_Status_display",
        "w_CustomerDate_display",
        "d_CustomerDate_display",
        "m_Branch",
        "m_JobType",
        ...COLUMN_PRODUCT_NUMBERS,
        ...COLUMN_PRODUCT_NUMBERS_BREAKDOWN,
        "m_TotalLBRMin",
        "w_BatchNo",
        "w_BlockNo",
        "d_BatchNo",
        "d_BlockNo",
        "m_InvStatus",
        "m_CreatedAt_display",
        "m_CreatedBy",
        "m_LastModifiedAt_display",
        "m_LastModifiedBy",
        ...COLUMN_PROJECT
      ];
      break;
    default:
      sequence = [
        "m_WorkOrderNo",
        "m_Status_display",
        "w_Status_display",
        "d_Status_display",
        "m_Branch",
        "m_JobType",
        ...COLUMN_PRODUCT_NUMBERS,
        ...COLUMN_PRODUCT_NUMBERS_BREAKDOWN,
        "w_BatchNo",
        "w_BlockNo",
        "d_BatchNo",
        "d_BlockNo",
        "m_InvStatus",
        "m_CreatedAt_display",
        "m_CreatedBy",
        "m_LastModifiedAt_display",
        "m_LastModifiedBy",
        "w_CustomerDate_display",
        "d_CustomerDate_display",
        ...COLUMN_PROJECT
      ];
      break;
  }

  /* 
    reorder columns. the element from sequence will match columns[i].key
  */

  // Build a map of columns for quick lookup by key
  const columnMap = _.keyBy(columns, "key");

  // Ordered part: only those keys that exist in columnMap
  const orderedColumns = sequence.map((key) => columnMap[key]).filter(Boolean);

  // Remaining columns that weren't included in sequence
  // const remainingColumns = columns.filter(col => !sequence.includes(col.key));

  return orderedColumns;
};
