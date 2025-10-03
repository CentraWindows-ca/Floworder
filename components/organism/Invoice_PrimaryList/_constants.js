import _ from "lodash";
import constants, {
  WorkOrderSelectOptions,
  ORDER_STATUS,
  WORKORDER_STATUS_MAPPING,
} from "lib/constants";


export const COLUMN_SEQUENCE_FOR_STATUS = (status, columns) => {
  let sequence = [];
  switch (status) {
    case WORKORDER_STATUS_MAPPING.Pending.key:
    default: // all
      sequence = [
        "tmp_invoiceNumber",
        "m_Status_display",
        "invoiceStatus_display",
        "createdAt_display",
        "createdBy"
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

