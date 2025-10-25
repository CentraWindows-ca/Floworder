import { useState, useContext, memo } from "react";
import cn from "classnames";
import { Spin } from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import { getIsRequired } from "./hooks/vconfig";
import constants, {
  WORKORDER_STATUS_MAPPING,
  GlassRowStates,
  FEATURE_CODES,
  ADDON_STATUS,
} from "lib/constants";
// styles
import styles from "./styles.module.scss";
import { LocalDataContext } from "./LocalDataProvider";
import utils from "lib/utils";
import { uiWoFieldEditGroupMapping as gmp } from "lib/constants/invoice_constants_labelMapping";

export const getIfFieldDisplayAsProductType = (
  { uiOrderType, id, permissions },
  data,
) => {
  let _isDisplay = true;

  // data conditions ======================

  // user permissions ======================
  const checkPermission = (pc, op = "canEdit") => {
    return _.get(permissions, [pc, op], false);
  };

  return _isDisplay;
};

export const displayFilter = (itemList, { uiOrderType, permissions }) => {
  return itemList?.filter((a) => {
    const { id = "m" } = a;
    return getIfFieldDisplayAsProductType(
      {
        uiOrderType,
        id,
        permissions,
      },
      a,
    );
  });
};
export const Block = ({ className_input, inputData }) => {
  const localContext =  useContext(LocalDataContext);
  const {
    data,
    initData,
    onChange,
    checkEditable,
    checkAddOnField,
    validationResult,
    dictionary,
  } = localContext
  let {
    Component,
    title,
    displayId,
    id,
    options,
    overrideOnChange,
    renderValue,
    className,
    ...rest
  } = inputData;
  if (typeof options === "function") {
    options = options(dictionary);
  }
  const className_required = getIsRequired(initData, id) && "required";

  const _value = renderValue ? renderValue(data?.[id], data, localContext) : data?.[id];
  const addon = checkAddOnField({ id });
  const addonClass = addon?.isSyncedFromParent ? styles.addonSync_input : "";

  return (
    <DisplayBlock id={displayId || id}>
      <label className={cn(className_required)}>{title}</label>
      <div className={cn(className_input)}>
        <Component
          id={id}
          value={_value}
          initValue={initData?.[id]}
          isHighlightDiff
          onChange={(v, ...o) => {
            if (typeof overrideOnChange === "function") {
              overrideOnChange(onChange, [v, ...o]);
            } else {
              onChange(v, id);
            }
          }}
          disabled={!checkEditable({ id })}
          options={options}
          errorMessage={validationResult?.[id]}
          className={cn(className, addonClass)}
          {...rest}
        />
      </div>
    </DisplayBlock>
  );
};

export const DisplayBlock = ({ children, id = "m", displayAs, ...props }) => {
  const { uiOrderType, data, permissions } = useContext(LocalDataContext);

  const display = getIfFieldDisplayAsProductType(
    {
      uiOrderType,
      id,
      permissions,
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

export const checkEditableById = ({ id, permissions }) => {
  let isEnable = false;

  // ============ permission checking: "enable" rules ============
  const checkPermission = (pc, op = "canEdit") => {
    return _.get(permissions, [pc, op], false);
  };
  const checkGroup = (group) => {
    return gmp[group][id];
  };

  if (checkPermission(FEATURE_CODES["om.prod.wo.basic"])) {
    isEnable = isEnable || checkGroup("basic");
  }
  if (checkPermission(FEATURE_CODES["om.prod.wo.invoice"])) {
    isEnable = isEnable || checkGroup("invoice") ||  checkGroup("invoiceBilling") ;
  }

  return isEnable;
};

export const checkEditableByGroup = ({ group, permissions, data }) => {

  return true
  const isAllowBoth = _.get(
    permissions,
    [`om.prod.wo.${group}`, `canEdit`],
    false,
  );

  let isAllowAny = isAllowBoth;

  return isAllowAny;
};

export const checkAddOnFieldById = ({
  id,
  data,
  workOrderFields,
}) => {
  let result = { isAddOnEditable: true, isSyncedFromParent: false };

  // if data?.m_AddOnLinked === 'SPLIT', isAddOnEditable is true
  const isOrderUnlink = data?.m_AddOnLinked === ADDON_STATUS.detached;

  if (workOrderFields?.[id]) {
    let { 
      isReadOnly, // default
      isSplitNotSync,  // functional purpose
      isSyncedFromParent // visual color purpose
    } =
      workOrderFields[id];

    let _editable = !isReadOnly;
    let _syncFromParent = isSyncedFromParent

    // detach has higher priority. if that happens 
    if (isSplitNotSync) {
      _editable = isOrderUnlink
      _syncFromParent = !isOrderUnlink
    } 

    result = {
      isAddOnEditable: _editable,
      isSyncedFromParent: _syncFromParent, // visual for if sync
    };
  }

  return result;
};

export default {};
