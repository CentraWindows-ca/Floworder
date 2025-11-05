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
import invoice_utils from "lib/utils/invoice_utils";
import InvoiceApi from "lib/api/InvoiceApi";

const getStatusName = (statusCode) =>
  _.values(INVOICE_STATUS_MAPPING).find(
    (a) => a.key?.trim() === statusCode?.toString()?.trim(),
  )?.systemName;

const WorkOrderActions = ({
  data,
  onHistory,
  onEdit,
  onView,
  onUpdate,
}) => {
  const { inv_invoiceId, invh_invoiceStatus } = data;
  const { toast, permissions } = useContext(GeneralContext);

  const { requestData } = useInterrupt();

  // toggle it to close dropdown
  const [closeToggle, setCloseToggle] = useState(false);

  // statusIndex
  let allowedStatus = [];
  allowedStatus = INVOICE_WORKFLOW[getStatusName(invh_invoiceStatus)] || [];

  const handleMoveTo = async (newStatus) => {
    const initData = data
    const payload = await invoice_utils.getStatusPayload({}, newStatus, initData, requestData);
    if (payload === null) return null;
    if (
      !window.confirm(
        `For invoice [${data?.inv_invoiceId}], are you sure to update Status to ${newStatus}?`,
      )
    ) {
      return null;
    }

    await InvoiceApi.wrapper_updateInvoiceStatus(payload, initData);
    toast("Status updated", { type: "success" });
    setCloseToggle((p) => !p);
    onUpdate();
  };

  const actionsActive = (
    <div className={cn(styles.workorderActionsContainer)}>
      <Button
        type="text"
        icon={<EyeOutlined />}
        onClick={() => {
          onView();
          setCloseToggle((p) => !p);
        }}
      >
        View Invoice
      </Button>
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
            key={`${inv_invoiceId}_${key}`}
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
    </div>
  );

  return (
    <>
      <Dropdown_Custom
        renderTrigger={(onClick) => {
          return (
            <span className="d-flex" style={{ cursor: "pointer" }} onClick={onClick}>
              {inv_invoiceId}
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
