import React, { useContext, useState, useCallback, useEffect } from "react";
import {
  EyeOutlined,
  EditOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  HistoryOutlined,
  UndoOutlined,
} from "@ant-design/icons";

import { Button } from "antd";
import { GeneralContext } from "lib/provider/GeneralProvider";
import { useInterrupt } from "lib/provider/InterruptProvider";

import cn from "classnames";
import _ from "lodash";
import OrdersApi from "lib/api/OrdersApi";
import WM2CWProdApi from "lib/api/WM2CWProdApi";
import Dropdown_Custom from "components/atom/Dropdown_Custom";
import PermissionBlock from "components/atom/PermissionBlock";

import constants, {
  INVOICE_STATUS_MAPPING,
  INVOICE_WORKFLOW,
  INVOICE_TRANSFER_FIELDS,
} from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const getStatusName = (statusCode) =>
  _.values(INVOICE_STATUS_MAPPING).find(
    (a) => a.key?.trim() === statusCode?.toString()?.trim(),
  )?.systemName;

const WorkOrderActions = ({
  data,
  onHistory,
  onEdit,
  onUpdate,
}) => {
  const { invoiceId, invoiceStatus } = data;
  const { toast, permissions } = useContext(GeneralContext);

  const { requestData } = useInterrupt();

  // toggle it to close dropdown
  const [closeToggle, setCloseToggle] = useState(false);

  // statusIndex
  let allowedStatus = [];
  allowedStatus = INVOICE_WORKFLOW[getStatusName(invoiceStatus)] || [];

  const getStatusPayload = async (data, newStatus, _kind) => {
    const { invoiceId } = data;
    const payload = {
      invoiceId,
      newStatus,
    };
    payload["oldStatus"] = data.invoiceStatus

    // different target has different required fields
    const missingFields = INVOICE_TRANSFER_FIELDS?.[newStatus] || {};
    if (!_.isEmpty(missingFields)) {
      const moreFields = await requestData(missingFields, data);
      // cancel
      if (moreFields === null) return null;
      payload = { ...payload, ...moreFields };
    }
    return payload;
  };

  const handleMoveTo = async (newStatus, _kind) => {
    const payload = await getStatusPayload(data, newStatus, _kind);
    if (payload === null) return null;
    if (
      !window.confirm(
        `For invoice [${data?.invoiceId}], are you sure to update Status to ${newStatus}?`,
      )
    ) {
      return null;
    }

    await doMove(payload);

    toast("Status updated", { type: "success" });
    setCloseToggle((p) => !p);
    onUpdate();
  };

  const doMove = useLoadingBar(async (payload) => {
    await OrdersApi.updateWorkOrderStatus(null, payload, data);
  });

  const actionsActive = (
    <div className={cn(styles.workorderActionsContainer)}>
      <Button
        type="text"
        icon={<EditOutlined />}
        onClick={() => {
          onEdit();
          setCloseToggle((p) => !p);
        }}
      >
        Edit Invoice
      </Button>

      {allowedStatus?.map((stepName) => {
        const { label, color, key } = INVOICE_STATUS_MAPPING[stepName];
        return (
          <Button
            type="text"
            icon={<ArrowRightOutlined />}
            onClick={() => handleMoveTo(key, "w")}
            key={`${invoiceId}_${key}`}
          >
            Move To:{" "}
            <span
              style={{
                width: 10,
                height: 10,
                backgroundColor: color,
                border: "1px solid #A0A0A0",
              }}
            />
            <b>{label}</b>
          </Button>
        );
      })}

      <Button
        type="text"
        icon={<i className="fa-solid fa-clock-rotate-left"></i>}
        onClick={() => {
          setCloseToggle((p) => !p);
          onHistory();
        }}
      >
        View Invoice History
      </Button>
    </div>
  );

  return (
    <>
      <Dropdown_Custom
        renderTrigger={(onClick) => {
          return (
            <span style={{ cursor: "pointer" }} onClick={onClick}>
              {invoiceId}
            </span>
          );
        }}
        content={actionsActive}
        closeToggle={closeToggle}
      />
    </>
  );
};

export default WorkOrderActions;
