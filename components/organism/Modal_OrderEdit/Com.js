import { useState, useContext, memo } from "react";
import cn from "classnames";
import { Spin } from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import { getIsRequired } from "./hooks/vconfig";
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
  { kind, uiOrderType, id, displayAs, permissions },
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

  let _isDisplay = true;

  // data conditions ======================
  if (id === "m_Community") {
    //
    _isDisplay &=
      data?.m_JobType === "SO" &&
      constants.checkProvince(data?.m_Branch) === "AB";
  }

  if (id === "m_ShippedDate") {
    _isDisplay &= [WORKORDER_MAPPING.Shipped.key].includes(data?.m_Status);
  }

  if (
    id === "m_TransferredLocation_display" ||
    id === "m_TransferredDate_display"
  ) {
    const _windowShow =
      data?.w_ManufacturingFacility &&
      data?.m_Branch !== data?.w_ManufacturingFacility;
    const _doorShow =
      data?.d_ManufacturingFacility &&
      data?.m_Branch !== data?.d_ManufacturingFacility;
    const _hasBranch = data?.m_Branch && data?.m_Branch !== "-";
    _isDisplay &= _hasBranch && (_windowShow || _doorShow);
  }

  // user permissions ======================
  const checkPermission = (pc, op = "canEdit") => {
    return _.get(permissions, [pc, op], false);
  };

  if (id === "m_PriceBeforeTax") {
    _isDisplay &= checkPermission(
      FEATURE_CODES["om.prod.wo.informationPriceBeforeTax"],
      "canView",
    );
  }

  // order kind ======================
  if (currentKind === kind || currentKind === "m" || kind === "m") {
    _isDisplay &= true;
  } else {
    _isDisplay &= false;
  }

  return _isDisplay;
};

export const displayFilter = (itemList, { kind, uiOrderType, permissions }) => {
  return itemList?.filter((a) => {
    const { id = "m", displayAs } = a;
    // currentKind is data kind
    return getIfFieldDisplayAsProductType(
      {
        kind,
        uiOrderType,
        id,
        displayAs,
        permissions,
      },
      a,
    );
  });
};
export const Block = ({ className_input, inputData }) => {
  const {
    data,
    initData,
    onChange,
    checkEditable,
    validationResult,
    dictionary,
  } = useContext(LocalDataContext);
  let {
    Component,
    title,
    displayId,
    id,
    options,
    overrideOnChange,
    renderValue,
    ...rest
  } = inputData;
  if (typeof options === "function") {
    options = options(dictionary);
  }
  const className_required = getIsRequired(initData, id) && "required";

  const _value = renderValue
    ? renderValue(data?.[id], data)
    : data?.[id];

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
          {...rest}
        />
      </div>
    </DisplayBlock>
  );
};

export const DisplayBlock = ({ children, id = "m", displayAs, ...props }) => {
  // kind is UI selected kind
  const { uiOrderType, kind, data, permissions } = useContext(LocalDataContext);

  const display = getIfFieldDisplayAsProductType(
    {
      kind,
      uiOrderType,
      id,
      displayAs,
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

export const checkEditableById = ({ id, permissions, data, initKind }) => {
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
  if (checkPermission(FEATURE_CODES["om.prod.wo.scheduleShippedDate"])) {
    isEnable = isEnable || id === "m_ShippedDate";
  }
  if (checkPermission(FEATURE_CODES["om.prod.wo.notes"])) {
    isEnable = isEnable || checkGroup("notes");
  }

  // ============ functional checking: "disable" rules ============
  /* 
  [VK]NOTE 20250523
  pending rule is rely on "where they open the modal". not on "what modal" they open
  here "where" means which tab (master, window, door) they search the order from
  */
  let status_ForPendingRule = data?.[`${initKind}_Status`];
  if (status_ForPendingRule === WORKORDER_MAPPING.Pending.key) {
    // check from group 'schedule', but still from field level (in case we dont pass group)
    if (!checkGroup("schedule")) {
      isEnable = false;
    }
  }

  /*
  NOTE 20250729
  Addon inheritates from parent fields doesnt allow to edit
  */
  if (data?.m_isAddon) {
    if (checkGroup("basic")) {
      isEnable = false;
    }

    if (checkGroup("information") && id?.startsWith("m_")) {
      isEnable = false;
    }

    if (['m_ShippingStartDate', 'm_RevisedDeliveryDate', 'w_CustomerDate', 'd_CustomerDate'].includes(id)) {
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
  // if (data?.m_Status === WORKORDER_MAPPING.Pending.key) {
  //   // check from group 'schedule', but still from field level (in case we dont pass group)
  //   if (group !== "schedule") {
  //     return false
  //   }
  // }

  return isAllowAny;
};

export default {};
