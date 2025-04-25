import { useState, useContext, memo } from "react";
import cn from "classnames";
import { Spin } from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import constants, {
  WORKORDER_MAPPING,
  GlassRowStates,
  FEATURE_CODES,
} from "lib/constants";
// styles
import styles from "./styles.module.scss";
import { LocalDataContext } from "./LocalDataProvider";
import utils from "lib/utils";
import { uiWoFieldEditGroupMapping as gmp } from "lib/constants/constants_labelMapping";

export const getIfFieldDisplayAsProductType = (
  { kind, uiOrderType, id, displayAs },
  data,
) => {
  let currentKind = "m";
  if (id?.startsWith("m_")) currentKind = "m";
  else if (id?.startsWith("w_")) currentKind = "w";
  else if (id?.startsWith("d_")) currentKind = "d";
  currentKind = displayAs || currentKind;

  // dont show fields if its not certain type of order
  if (!uiOrderType?.m && currentKind === "m") return null;
  if (!uiOrderType?.w && currentKind === "w") return null;
  if (!uiOrderType?.d && currentKind === "d") return null;

  if (id === "m_Community") {
    //
    return (
      data?.m_JobType === "SO" &&
      constants.checkProvince(data?.m_Branch) === "AB"
    );
  }

  if (currentKind === kind || currentKind === "m" || kind === "m") {
    return true;
  } else {
    return false;
  }
};

export const displayFilter = (itemList, { kind, uiOrderType }) => {
  return itemList?.filter((a) => {
    const { id = "m", displayAs } = a;
    // currentKind is data kind
    return getIfFieldDisplayAsProductType(
      {
        kind,
        uiOrderType,
        id,
        displayAs,
      },
      a,
    );
  });
};

export const SaveButton = memo(({ group }) => {
  const {
    checkEditableForSectionSaveButton,
    data,
    isSaving,
    onSave,
    editedGroup,
  } = useContext(LocalDataContext);

  return null;
  if (!checkEditableForSectionSaveButton({ group })) {
    return false;
  }

  return (
    <div
      className={cn("justify-content-center flex")}
      style={{
        margin: " 0px",
        padding: "10px",
        borderTop: "1px solid #F0F0F0",
      }}
    >
      <button
        className="btn btn-primary align-items-center flex gap-2 px-3"
        disabled={!data?.m_WorkOrderNo || isSaving || !editedGroup[group]}
        onClick={() => onSave(group)}
      >
        {!isSaving ? (
          <SaveOutlined size="small" />
        ) : (
          <Spin
            size="small"
            indicator={<LoadingOutlined />}
            spinning={isSaving}
            style={{ color: "white" }}
          />
        )}
        Save
      </button>
    </div>
  );
});

export const DisplayBlock = ({ children, id = "m", displayAs, ...props }) => {
  // kind is UI selected kind
  const { uiOrderType, kind, data } = useContext(LocalDataContext);

  const display = getIfFieldDisplayAsProductType(
    {
      kind,
      uiOrderType,
      id,
      displayAs,
    },
    data,
  );

  if (display) {
    return children;
  } else {
    return null;
  }
};

export const ToggleBlock = ({
  children,
  data,
  id,
  title,
  titleClass,
  jsxClose = null,
  ...props
}) => {
  const { onAnchor, expands, setExpands } = useContext(LocalDataContext);
  const toggle = !expands[id];

  const setToggle = () => {
    if (expands[id]) {
      setExpands((prev) => {
        const _v = JSON.parse(JSON.stringify(prev || {}));
        _v[id] = !_v[id];
        return _v;
      });
    } else {
      onAnchor(id);
    }
  };

  return (
    <div className={cn(styles.toggleContainer)} id={id}>
      <div
        className={cn(styles.toggleTitle, titleClass)}
        onClick={() => setToggle((prev) => !prev)}
      >
        {title}
        <div>
          <i
            className={cn("fa-solid", toggle ? "fa-angle-down" : "fa-angle-up")}
          ></i>
        </div>
      </div>
      {toggle ? (
        jsxClose
      ) : (
        <div className={cn(styles.toggleZone)}>{children}</div>
      )}
    </div>
  );
};

export const ToggleFull = ({
  children,
  data,
  id,
  title,
  titleClass,
  jsxClose = null,
  ...props
}) => {
  const { onAnchor, expands, setExpands } = useContext(LocalDataContext);
  const toggle = !expands[id];

  const setToggle = () => {
    if (expands[id]) {
      setExpands((prev) => {
        const _v = JSON.parse(JSON.stringify(prev || {}));
        _v[id] = !_v[id];
        return _v;
      });
    } else {
      onAnchor(id);
    }
  };

  return (
    <div className={cn(styles.toggleContainer, styles.toggleFull)} id={id}>
      <div
        className={cn(styles.toggleTitle, titleClass)}
        onClick={() => setToggle((prev) => !prev)}
      >
        {title}
        <div>
          <i
            className={cn("fa-solid", toggle ? "fa-angle-up" : "fa-angle-down")}
          ></i>
        </div>
      </div>
      {toggle ? (
        <div
          className={cn(styles.toggleFullClose)}
          onClick={() => setToggle((prev) => !prev)}
        >
          {jsxClose}
        </div>
      ) : (
        <div className={cn(styles.toggleZone)}>{children}</div>
      )}
    </div>
  );
};

export const NoData = ({ title = "No Data", className }) => {
  return (
    <div className={cn("text-center text-slate-400", className)}>
      -- {title} --
    </div>
  );
};

// ========== copied from calendar project: ==========
export const treateGlassItems = (list) => {
  const getStatus = (glassItem) => {
    let result = "Not Ordered";

    if (glassItem?.qty === glassItem?.glassQty) {
      result = "Received";
    } else if (glassItem?.orderDate) {
      result = "Ordered";
    }

    return result;
  };

  let _glassItems = [...list];
  const _newItems = [];
  _glassItems?.forEach((g, i) => {
    g.status = getStatus(g);
    g.statusObj =
      _.values(GlassRowStates).find((_grs) => _grs.label === g.status) || {};
    g.receivedExpected = `${g.qty} / ${g.glassQty}`;
    g.shipDate = utils.formatDateForMorganLegacy(g.shipDate);
    g.orderDate = utils.formatDateForMorganLegacy(g.orderDate);
  });
  const statusPriority = {
    "Not Ordered": 1,
    Ordered: 2,
    Received: 3,
  };

  _glassItems = _glassItems.sort((a, b) => {
    // Compare status priority
    const statusComparison =
      statusPriority[a.status] - statusPriority[b.status];
    if (statusComparison !== 0) {
      return statusComparison;
    }
    // If status is the same, compare item strings
    return a.item.localeCompare(b.item);
  });

  _glassItems?.forEach((g, i) => {
    const { rackInfo = [], workOrderNumber, item } = g;
    g.isFirstRow = true;
    // expand extra rows by rack info (if any)
    if (_.isEmpty(rackInfo)) {
      _newItems.push({ ...g, key: `${workOrderNumber}_${item}_${i}` });
    } else {
      g.rowSpan = rackInfo.length;

      rackInfo.map((ri, j) => {
        const { rackID, rackType, qty } = ri;
        _newItems.push({
          ...g,
          isFirstRow: j > 0 ? false : true,
          rackID,
          rackType,
          rackQty: qty,
          key: `${workOrderNumber}_${item}_${rackID}_${i}_${j}`,
        });
      });
    }
  });

  return _newItems;
};

export const checkEditableById = ({ id, permissions, data }) => {
  let isEnable = false;


  // ============ permission checking: "enable" rules ============
  const isWindowField = id?.startsWith("w_") || id?.startsWith("m_");
  const isDoorField = id?.startsWith("d_") || id?.startsWith("m_");
  const checkPermission = (pc, op = "canEdit") => {
    return _.get(permissions, [pc, op], false);
  };
  const checkGroup = (group) => {
    return gmp[group][id];
  };
  if (checkPermission(FEATURE_CODES["om.prod.wo.basic"])) {
    isEnable = isEnable || checkGroup("basic");
  }
  if (checkPermission(FEATURE_CODES["om.prod.wo.information.window"])) {
    isEnable = isEnable || (checkGroup("information") && isWindowField);
  }
  if (checkPermission(FEATURE_CODES["om.prod.wo.information.door"])) {
    isEnable = isEnable || (checkGroup("information") && isDoorField);
  }
  if (checkPermission(FEATURE_CODES["om.prod.wo.options.window"])) {
    isEnable = isEnable || (checkGroup("options") && isWindowField);
  }
  if (checkPermission(FEATURE_CODES["om.prod.wo.options.door"])) {
    isEnable = isEnable || (checkGroup("options") && isDoorField);
  }

  if (checkPermission(FEATURE_CODES["om.prod.wo.status.window"])) {
    isEnable = isEnable || (checkGroup("status") && isWindowField);
  }
  if (checkPermission(FEATURE_CODES["om.prod.wo.status.door"])) {
    isEnable = isEnable || (checkGroup("status") && isDoorField);
  }

  // ============ [VK]NOTE 250424: "Shipping guys can change shipping schedule... but not production schedule"
  if (
    checkPermission(
      FEATURE_CODES["om.prod.wo.scheduleWithoutProduction.window"],
    )
  ) {
    // schedule fileds in window type but not start date
    isEnable =
      isEnable ||
      (checkGroup("schedule") &&
        id !== "w_ProductionStartDate" &&
        isWindowField);
  }
  if (
    checkPermission(FEATURE_CODES["om.prod.wo.scheduleWithoutProduction.door"])
  ) {
    isEnable =
      isEnable ||
      (checkGroup("schedule") && id !== "d_ProductionStartDate" && isDoorField);
  }
  if (
    checkPermission(FEATURE_CODES["om.prod.wo.scheduleWithProduction.window"])
  ) {
    isEnable = isEnable || id === "w_ProductionStartDate";
  }
  if (
    checkPermission(FEATURE_CODES["om.prod.wo.scheduleWithProduction.door"])
  ) {
    isEnable = isEnable || id === "d_ProductionStartDate";
  }

  if (checkPermission(FEATURE_CODES["om.prod.wo.notes"])) {
    isEnable = isEnable || checkGroup("notes");
  }

  // ============ functional checking: "disable" rules ============
  if (data?.m_Status === WORKORDER_MAPPING.Pending.key) {
    // check from group 'schedule', but still from field level (in case we dont pass group)
    if (!checkGroup("schedule")) {
      isEnable = false;
    }
  }


  return isEnable;
};

export const checkEditableByGroup = ({ group, permissions, data }) => {
  const isAllowWindow = _.get(
    permissions,
    [`om.prod.wo.${group}.window`, `canEdit`],
    false,
  );
  const isAllowDoor = _.get(
    permissions,
    [`om.prod.wo.${group}.door`, `canEdit`],
    false,
  );
  const isAllowBoth = _.get(
    permissions,
    [`om.prod.wo.${group}`, `canEdit`],
    false,
  );

  let isAllowAny = isAllowWindow || isAllowDoor || isAllowBoth;

  // ============ functional checking: "disable" rules ============
  if (data?.m_Status === WORKORDER_MAPPING.Pending.key) {
    // check from group 'schedule', but still from field level (in case we dont pass group)
    if (group !== "schedule") {
      return false
    }
  }

  return isAllowAny;
};

export default {
  SaveButton,
};
