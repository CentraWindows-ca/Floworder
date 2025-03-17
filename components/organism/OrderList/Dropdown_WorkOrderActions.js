import React, { useContext, useState, useEffect } from "react";
import {
  EyeOutlined,
  EditOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  HistoryOutlined,
  SyncOutlined,
} from "@ant-design/icons";

import { Button } from "antd";
import { GeneralContext } from "lib/provider/GeneralProvider";
import { useInterrupt } from "lib/provider/InterruptProvider";

import cn from "classnames";
import _ from "lodash";
import OrdersApi from "lib/api/OrdersApi";
import Dropdown_Custom from "components/atom/Dropdown_Custom";
import PermissionBlock from "components/atom/PermissionBlock";

import constants, {
  ORDER_STATUS,
  WORKORDER_WORKFLOW,
  WORKORDER_MAPPING,
  ORDER_TRANSFER_FIELDS,
} from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";
import { getOrderKind } from "lib/utils";

const getStatusName = (statusCode) =>
  ORDER_STATUS.find((a) => a.key?.trim() === statusCode?.trim())?.systemName;

const WorkOrderActions = ({
  data,
  onHistory,
  onEdit,
  onView,
  onUpdate,
  kind,
}) => {
  const { m_WorkOrderNo, m_IsActive, w_Status, d_Status } = data;
  const { toast } = useContext(GeneralContext);

  const { requestData } = useInterrupt();

  // statusIndex
  let allowedStatusWindow = [];
  let allowedStatusDoor = [];

  if (
    kind === "m" ||
    getOrderKind(data) === "m" ||
    getOrderKind(data) === "w"
  ) {
    allowedStatusWindow = WORKORDER_WORKFLOW[getStatusName(w_Status)] || [];
  }

  if (
    kind === "m" ||
    getOrderKind(data) === "m" ||
    getOrderKind(data) === "d"
  ) {
    allowedStatusDoor = WORKORDER_WORKFLOW[getStatusName(d_Status)] || [];
  }

  const handleMoveTo = async (newStatus, _kind) => {
    const payload = await getStatusPayload(data, newStatus, _kind);
    if (payload === null) return null;
    await doMove(payload);

    toast("Status updated", { type: "success" });
    onUpdate();
  };

  const getStatusPayload = async (data, newStatus, _kind) => {
    const { m_WorkOrderNo, m_MasterId } = data;
    const payload = {
      m_WorkOrderNo,
      m_MasterId,
      newStatus,
    };
    const updatingStatusField = `${_kind}_Status`;
    payload["oldStatus"] = data[updatingStatusField];
    payload["isWindow"] = _kind === "w";

    // different target has different required fields
    const missingFields = ORDER_TRANSFER_FIELDS?.[newStatus] || {};
    if (!_.isEmpty(missingFields)) {
      const moreFields = await requestData(missingFields, data);
      // cancel
      if (moreFields === null) return null;
      payload = { ...payload, ...moreFields };
    }
    return payload;
  };

  const doMove = useLoadingBar(async (payload) => {
    await OrdersApi.updateWorkOrderStatus(payload);
  });

  const handleDelete = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to delete [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    await OrdersApi.softDeleteProductionsWorkOrder(data);
    toast("Work order moved to trash bin", { type: "success" });
    onUpdate();
  });

  const handleHardDelete = useLoadingBar(async () => {
    if (
      !window.confirm(
        `Are you sure to permenant delete [${data?.m_WorkOrderNo}]?`,
      )
    ) {
      return null;
    }

    await OrdersApi.hardDeleteProductionsWorkOrder(data);
    toast("Work order deleted permenantly", { type: "success" });
    onUpdate();
  });

  // update Items from WindowMaker
  const handleGetWindowMaker = useLoadingBar(async () => {
    if (
      !window.confirm(
        `Are you sure to get WindowMaker data for [${data?.m_WorkOrderNo}]?`,
      )
    ) {
      return null;
    }

    const dbSource = data.m_DBSource;
    // fetch from WM
    if (dbSource === "WM_AB") {
      await OrdersApi.updateOnly_AB_WMByWorkOrderAsync(null, {
        workOrderNo: data?.m_WorkOrderNo,
      });
    } else {
      await OrdersApi.updateOnly_BC_WMByWorkOrderAsync(null, {
        workOrderNo: data?.m_WorkOrderNo,
      });
    }

    toast("Work order updated from WindowMaker", { type: "success" });
    onUpdate();
  });

  const actionsActive = (
    <div className={cn(styles.workorderActionsContainer)}>
      <FilterByStatus id="viewOrder" data={data}>
        <Button type="text" icon={<EyeOutlined />} onClick={onView}>
          View Order
        </Button>
      </FilterByStatus>
      <FilterByStatus id="editOrder" data={data}>
        <PermissionBlock
          featureCode={constants.FEATURE_CODES["om.prod.wo"]}
          op="canEdit"
        >
          <Button type="text" icon={<EditOutlined />} onClick={onEdit}>
            Edit Order
          </Button>
        </PermissionBlock>
      </FilterByStatus>

      <PermissionBlock
        featureCode={constants.FEATURE_CODES["om.prod.statusSwitchGeneral"]}
      >
        {allowedStatusWindow?.map((stepName) => {
          const { label, color, key } = WORKORDER_MAPPING[stepName];
          return (
            <FilterByStatus key={key} id={`windowStatus_${key}`} data={data}>
              <Button
                type="text"
                icon={<ArrowRightOutlined />}
                onClick={() => handleMoveTo(key, "w")}
              >
                Move Windows To:{" "}
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
            </FilterByStatus>
          );
        })}

        {allowedStatusDoor?.map((stepName) => {
          const { label, color, key } = WORKORDER_MAPPING[stepName];
          return (
            <FilterByStatus key={key} id={`doorStatus_${key}`} data={data}>
              <Button
                type="text"
                icon={<ArrowRightOutlined />}
                onClick={() => handleMoveTo(key, "d")}
                key={key}
              >
                Move Doors To:{" "}
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
            </FilterByStatus>
          );
        })}
      </PermissionBlock>
      <FilterByStatus id="deleteOrder" data={data}>
        <PermissionBlock
          featureCode={constants.FEATURE_CODES["om.prod.wo"]}
          op="canDelete"
        >
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            // disabled={true}
          >
            Delete Order
          </Button>
        </PermissionBlock>
      </FilterByStatus>
      <FilterByStatus id="syncFromWindowMaker" data={data}>
        <PermissionBlock
          featureCode={constants.FEATURE_CODES["om.prod.woGetWindowMaker"]}
        >
          <Button
            type="text"
            icon={<SyncOutlined />}
            onClick={handleGetWindowMaker}
          >
            Get WindowMaker
          </Button>
        </PermissionBlock>
      </FilterByStatus>

      <FilterByStatus id="viewOrderHistory" data={data}>
        <PermissionBlock
          featureCode={constants.FEATURE_CODES["om.prod.woHistory"]}
        >
          <Button type="text" icon={<HistoryOutlined />} onClick={onHistory}>
            View Order History
          </Button>
        </PermissionBlock>
      </FilterByStatus>
    </div>
  );

  const actionsTrash = (
    <div className={cn(styles.workorderActionsContainer)}>
      <Button type="text" icon={<EyeOutlined />} onClick={onView}>
        View Order
      </Button>
      <PermissionBlock
        featureCode={constants.FEATURE_CODES["om.prod.wo"]}
        op="canDelete"
      >
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={handleHardDelete}
        >
          Permenantly Delete Order
        </Button>
      </PermissionBlock>
    </div>
  );

  return (
    <>
      <Dropdown_Custom
        renderTrigger={(onClick) => {
          return (
            <span style={{ cursor: "pointer" }} onClick={onClick}>
              {m_WorkOrderNo}
            </span>
          );
        }}
        content={m_IsActive ? actionsActive : actionsTrash}
      />
    </>
  );
};

const FilterByStatus = ({ id, children, data }) => {
  if (data?.m_Status === WORKORDER_MAPPING.Pending.key) {
    if (id !== "viewOrder") return null;
  }

  return children;
};

export default WorkOrderActions;
