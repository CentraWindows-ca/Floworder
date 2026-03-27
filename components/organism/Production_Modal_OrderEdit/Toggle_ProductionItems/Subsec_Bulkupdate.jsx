import { useState, useEffect, useMemo } from "react";
import _ from "lodash";
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

const _getPhase = (itemStatus) => {
  return ITEM_STATUS.find((a) => a.key === itemStatus)?.phase;
};

const Com = (props) => {
  const {
    kind,
    dictKey,
    itemListData,
    onBatchUpdateItems,
    //
    updatingValues,
    setUpdatingValues,
    handleUpdate,
    multiChecked,
    setMultiChecked,
    sortedList,
    overridedList,
    overridedListByFacility,
    sort,
    setSort,
    filters,
    setFilters,
  } = props;

  const mappedData = useMemo(() => {
    const _mapping = {};
    sortedList?.forEach((a) => {
      _mapping[a.Id] = a;
    });

    return _mapping;
  }, [sortedList]);

  const isShowBulkUpdate = _.values(multiChecked)?.some((a) => a);

  const [multiRack, setMultiRack] = useState("");
  const [multiStatus, setMultiStatus] = useState("");

  const checkedObjects = useMemo(() => {
    return _.keys(multiChecked)?.filter((k) => multiChecked[k]);
  }, [multiChecked]);

  const checkBulkUpdateAllow = useMemo(() => {
    /*
      NOTE: phase production and phase shipping can not update together
    */
    let allow = true,
      reason = [];
    const selectedPhase = {};
    checkedObjects.forEach((itemId) => {
      const selectedStatus = mappedData[itemId]?.Status;
      const phase = _getPhase(selectedStatus);
      selectedPhase[phase] = true;
    });

    if (selectedPhase["shipping"] && selectedPhase["production"]) {
      allow = false;
      reason.push(
        "Selected items are mixed production and shipping purpose, they can not update together.",
      );
    }
    return {
      allow,
    };
  }, [multiChecked, _getPhase]);

  const checkStatusAllow = useMemo(() => {
    let allow = true,
      reason = [];

    switch (multiStatus) {
      case "Not Started":
        allow = checkedObjects.every((itemId) => {
          const selectedStatus = mappedData[itemId]?.Status;
          return selectedStatus === "On Hold";
        });
        if (!allow)
          reason.push(`Only "On Hold" items can update to "Not Started"`);
        break;
      case "In-Progress":
        allow = checkedObjects.every((itemId) => {
          const selectedStatus = mappedData[itemId]?.Status;
          return (
            selectedStatus === "Not Started" ||
            selectedStatus === "In-Progress" ||
            selectedStatus === "On Hold"
          );
        });
        if (!allow)
          reason.push(
            `Only "Not Started" or "On Hold" items can update to "In-Progress"`,
          );
        break;
      case "Shipped":
        allow = checkedObjects.every((itemId) => {
          const selectedStatus = mappedData[itemId]?.Status;
          return (
            selectedStatus === "Ready To Ship" ||
            selectedStatus === "Shipped" ||
            selectedStatus === "On Hold"
          );
        });
        if (!allow) reason.push("Only Ready To Ship can update to Shipped");
        break;
      case "Ready To Ship":
        allow = false;
        if (!allow) reason.push("Should bulk update by shipping");
        break;
      case "On Hold":
      // if onhold, always true. multiStatus is target status
      default:
        allow = true;
        break;
    }

    return {
      allow,
      reason,
    };
  }, [multiStatus, multiChecked, mappedData]);

  const checkRackAllow = useMemo(() => {
    return true;
    // !checkedObjects.some((itemId) => {
    //   const selectedStatus = mappedData[itemId]?.Status;
    //   return selectedStatus === "Ready To Ship";
    // });
  }, [multiStatus, multiChecked, mappedData]);

  if (!isShowBulkUpdate) {
    return null;
  }

  const handleUpdateMultiRack = (v, rid, o) => {
    setMultiRack(v);
  };

  const handleUpdateMultiStatus = (v) => {
    setMultiStatus(v);
  };

  const handleCancel = () => {
    setMultiRack("");
    setMultiStatus("");
  };
  const handleBulkUpdate = async () => {
    if (!_.isEmpty(updatingValues)) {
      if (
        window.confirm(
          "You have unsaved item changes. Bulk update will discard them. Continue?",
        )
      ) {
        setUpdatingValues({});
      }
    }

    const updatingList = checkedObjects?.map((itemId) => {
      const fields = {};
      if (multiRack?.value === "REMOVE") {
        fields["RackLocation"] = "";
        fields["RackLocationId"] = "";
      } else if (multiRack?.value) {
        fields["RackLocation"] = multiRack.label;
        fields["RackLocationId"] = multiRack.value;
      }

      if (multiStatus) {
        fields["Status"] = multiStatus;
      }

      return {
        keyValue: itemId,
        fields,
      };
    });

    if (
      window.confirm(
        `This will update ${updatingList?.length} items. Continue?`,
      )
    )
      await onBatchUpdateItems(updatingList, kind);
    handleCancel();
    setMultiChecked({});

    alert(`Updated ${updatingList?.length || 0} items`);
  };

  if (!checkBulkUpdateAllow.allow) {
    return null;
  }

  const reasons = checkStatusAllow?.reason;

  return (
    <div className={cn(styles.bulkUpdateContainer)}>
      {
        
      }
      <>
        <Editable.EF_Rack
          id={`${dictKey}_bulkupdate_rack`}
          value={multiRack?.value || ""}
          onChange={(v, rid, o) => {
            handleUpdateMultiRack(o);
          }}
          isDisplayAvilible={false}
          isRemoveAllow={true}
          placeholder="-- Not Update --"
          size="sm"
          disabled={!checkRackAllow}
          style={{ flexShrink: 0 }}
        />
        <Editable.EF_SelectWithLabel
          id={`${dictKey}_bulkupdate_status`}
          value={multiStatus}
          onChange={(v) => {
            handleUpdateMultiStatus(v);
          }}
          options={ITEM_STATUS}
          placeholder="-- Not  Update --"
          className="form-select-sm form-select w-auto"
        />
        <div className="input-group">
          <button
            onClick={handleCancel}
            className="btn btn-sm btn-outline-secondary"
            disabled={!multiStatus && !multiRack}
          >
            Cancel
          </button>
          <button
            className="btn btn-sm btn-primary"
            disabled={!checkStatusAllow.allow || (!multiStatus && !multiRack)}
            onClick={handleBulkUpdate}
          >
            Bulk Update
          </button>
        </div>
      </>
      <ComReason reasons={reasons} />
    </div>
  );
};

const ComReason = ({ reasons }) => {
  if (_.isEmpty(reasons)) return null;

  return (
    <Tooltip title={reasons?.join("\n")}>
      <i className="fa-solid fa-triangle-exclamation text-red-500" />
    </Tooltip>
  );
};

export default Com;
