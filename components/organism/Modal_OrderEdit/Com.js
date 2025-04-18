import { useState, useContext } from "react";
import cn from "classnames";
import constants, { HEADER_COLUMNS, WORKORDER_MAPPING } from "lib/constants";
// styles
import styles from "./styles.module.scss";
import OrdersApi from "lib/api/OrdersApi";
import GlassApi from "lib/api/GlassApi";
import { LocalDataContext } from "./LocalDataProvider";

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
    const isAllowWindow = _.get(permissions, [`om.prod.wo.${group}.window`, `canEdit`], false)
    const isAllowDoor = _.get(permissions, [`om.prod.wo.${group}.door`, `canEdit`], false)
    const isAllowBoth = _.get(permissions, [`om.prod.wo.${group}`, `canEdit`], false)

    if (id) {
      if (id?.startsWith("w_")) {
        return isAllowWindow
      }
      if (id?.startsWith("d_")) {
        return isAllowDoor
      }
      if (id?.startsWith("m_")) {
        return isAllowWindow || isAllowDoor
      }
      return false
    } else {
      return isAllowBoth
    }   
  }

  return true;
};
