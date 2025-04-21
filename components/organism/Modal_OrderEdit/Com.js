import { useState, useContext, memo } from "react";
import cn from "classnames";
import { Spin } from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import constants, { WORKORDER_MAPPING, GlassRowStates } from "lib/constants";
// styles
import styles from "./styles.module.scss";
import { LocalDataContext } from "./LocalDataProvider";
import utils from "lib/utils";

const _ifDisplay = ({ kind, uiOrderType, id, displayAs }, data) => {
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
    return _ifDisplay(
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
  const { checkEditableForSave, data, isSaving, onSave, editedGroup } =
    useContext(LocalDataContext);

  return null;
  if (!checkEditableForSave({ group })) {
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

  const display = _ifDisplay(
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
    g.statusObj = _.values(GlassRowStates).find(_grs => _grs.label === g.status) || {}
    g.receivedExpected = `${g.qty} / ${g.glassQty}`;
    g.shipDate = utils.formatDateForMorganLegacy(g.shipDate);
    g.orderDate = utils.formatDateForMorganLegacy(g.orderDate);

  })
  const statusPriority = {
    "Not Ordered": 1,
    "Ordered": 2,
    "Received": 3
  };

  _glassItems = _glassItems.sort((a, b) => {
    // Compare status priority
    const statusComparison = statusPriority[a.status] - statusPriority[b.status];
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
      _newItems.push({ ...g, key: `${workOrderNumber}_${item}_${i}`});
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
          key: `${workOrderNumber}_${item}_${rackID}_${i}_${j}`
        });
      });
    }
  });

  return _newItems;
}

export const checkEditableById = ({ id, group, permissions, data }) => {
  if (!id && !group) return true;

  // for pending, only allow to edit schedueld
  if (data?.m_Status === WORKORDER_MAPPING.Pending.key) {
    if (
      [
        "m_ShippingStartDate",
        "m_RevisedDeliveryDate",
        "w_CustomerDate",
        "w_ProductionStartDate",
        "w_PaintStartDate",
        "w_GlassOrderDate",
        "w_GlassRecDate",
        "d_CustomerDate",
        "d_ProductionStartDate",
        "d_PaintStartDate",
        "d_GlassOrderDate",
      ].includes(id)
    ) {
      return true;
    } else {
      return false;
    }
  }

  // permissions checking
  if (group) {
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
    const isAllowAny = isAllowWindow || isAllowDoor || isAllowBoth;

    if (id) {
      if (id?.startsWith("w_")) {
        return isAllowWindow;
      }
      if (id?.startsWith("d_")) {
        return isAllowDoor;
      }
      if (id?.startsWith("m_")) {
        return isAllowAny;
      }
      return false;
    } else {
      return isAllowBoth;
    }
  }

  return true;
};

export const checkEditableByGroup = ({ group, permissions, data }) => {
  if (!group) return true;

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
  const isAllowAny = isAllowWindow || isAllowDoor || isAllowBoth;

  return isAllowAny;
};

export default {
  SaveButton,
};
