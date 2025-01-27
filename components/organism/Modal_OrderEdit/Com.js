import { useState, useContext } from "react";
import cn from "classnames";
import constants, { HEADER_COLUMNS } from "lib/constants";
// styles
import styles from "./styles.module.scss";
import OrdersApi from "lib/api/OrdersApi";
import GlassApi from "lib/api/GlassApi";
import { LocalDataContext } from "./LocalDataProvider";

const _ifDisplay = ({ kind, uiOrderType, id, displayAs }) => {
  let currentKind = "m";
  if (id?.startsWith("m_")) currentKind = "m";
  else if (id?.startsWith("w_")) currentKind = "w";
  else if (id?.startsWith("d_")) currentKind = "d";
  currentKind = displayAs || currentKind;

  // dont show fields if its not certain type of order
  if (!uiOrderType?.m && currentKind === "m") return null;
  if (!uiOrderType?.w && currentKind === "w") return null;
  if (!uiOrderType?.d && currentKind === "d") return null;

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
    return _ifDisplay({
      kind,
      uiOrderType,
      id,
      displayAs,
    });
  });
};

export const DisplayBlock = ({ children, id = "m", displayAs, ...props }) => {
  // kind is UI selected kind
  const { uiOrderType, kind, data } = useContext(LocalDataContext);

  const display = _ifDisplay({
    kind,
    uiOrderType,
    id,
    displayAs,
  })

  if (display) {
    return children
  } else {
    return null
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
            className={cn("fa-solid", toggle ? "fa-angle-up" : "fa-angle-down")}
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
  const { expands, setExpands } = useContext(LocalDataContext);
  const toggle = !expands[id];

  const setToggle = () => {
    setExpands((prev) => {
      const _v = JSON.parse(JSON.stringify(prev || {}));
      _v[id] = !_v[id];
      return _v;
    });
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

export const localApi = {
  getFiles: async (masterId) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "Prod_UploadingFiles",
      filters: [
        {
          field: "MasterId",
          operator: "Equals",
          value: masterId,
        },
        {
          field: "ProdTypeId",
          operator: "Equals",
          value: constants.PROD_TYPES.m.toString(),
        },
      ],
    });
  },
  getImages: async (masterId) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "Prod_UploadingImages",
      filters: [
        {
          field: "MasterId",
          operator: "Equals",
          value: masterId,
        },
        {
          field: "ProdTypeId",
          operator: "Equals",
          value: constants.PROD_TYPES.m.toString(),
        },
      ],
    });
  },

  getDoorItems: async (WorkOrderNo) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "ProdDoorItems",
      filters: [
        {
          field: "WorkOrderNo",
          operator: "Equals",
          value: WorkOrderNo,
        },
      ],
    });
  },

  getWindowItems: async (WorkOrderNo) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "ProdWindowItems",
      filters: [
        {
          field: "WorkOrderNo",
          operator: "Equals",
          value: WorkOrderNo,
        },
      ],
    });
  },

  getWorkOrder: async (initWorkOrderNo) => {
    return (
      OrdersApi.queryWorkOrderHeaderWithPrefixAsync(null, {
        pageSize: 1,
        page: 1,
        filters: [
          {
            field: "m_WorkOrderNo",
            operator: constants.FILTER_OPERATOR.Equals,
            value: initWorkOrderNo,
          },
        ],
        kind: "m",
      }) || {}
    );
  },
  updateWorkOrder: async (m_MasterId, fields) => {
    return (
      OrdersApi.updateWorkOrderHeaderWithPrefixAsync(null, {
        keyValue: m_MasterId,
        masterId: m_MasterId,
        fields,
      }) || {}
    );
  },
};
