import { useState } from "react";
import cn from "classnames";

import constants, {
  ITEM_STATUS,
  ITEM_LITES,
  ITEM_DOOR_TYPES,
  FACILITY_ORDER,
  ITEM_FACILITY,
} from "lib/constants";

import Editable from "components/molecule/Editable";
import Tooltip from "components/atom/Tooltip";
import stylesRoot from "../styles.module.scss";
import stylesCurrent from "./styles.module.scss";
const styles = { ...stylesRoot, ...stylesCurrent };

const Com = (props) => {
  const {
    dictKey,
    itemListData,

    //
    updatingValues,
    setUpdatingValues,
    handleUpdate,
    multiChecked,
    handleMultiCheck,
    sortedList,
    overridedList,
    overridedListByFacility,
    sort,
    setSort,
    filters,
    setFilters,
  } = props;

  const [multiRack, setMultiRack] = useState("");
  const [multiStatus, setMultiStatus] = useState("");

  const handleUpdateMultiRack = (v, rid, o) => {
    setMultiRack(v);
  };

  const handleUpdateMultiStatus = (v) => {
    setMultiStatus(v);
  };

  const checkStatusDisabled = () => {
    return false;
  };
  const checkRackDisabled = () => {
    return false;
  };

  return (
    <div className={cn(styles.bulkUpdateContainer)}>
      <div>Bulk update:</div>

      <Editable.EF_Rack
        id={`${dictKey}_bulkupdate_rack`}
        value={multiRack}
        onChange={(v, rid, o) => {
          handleUpdateMultiRack(v);
        }}
        isDisplayAvilible={false}
        size="sm"
        disabled={checkRackDisabled()}
      />

      <Editable.EF_SelectWithLabel
        id={`${dictKey}_bulkupdate_status`}
        value={multiStatus}
        onChange={(v) => {
          handleUpdateMultiStatus(v);
        }}
        options={ITEM_STATUS}
        className = "form-select form-select-sm w-auto"
      />
    </div>
  );
};
export default Com;
