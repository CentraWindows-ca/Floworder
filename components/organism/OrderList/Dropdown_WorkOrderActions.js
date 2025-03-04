import React, from "react";
import {
  EyeOutlined,
  EditOutlined,
  ArrowRightOutlined,
  DeleteOutlined,
  HistoryOutlined,
  SyncOutlined 
} from "@ant-design/icons";

import { Button } from "antd";

import cn from "classnames";
import _ from "lodash";
import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";
import OrdersApi from "lib/api/OrdersApi";
import Dropdown_Custom from "components/atom/Dropdown_Custom";
import PermissionBlock from "components/atom/PermissionBlock";
import External_FromApi from "lib/api/External_FromApi";

import constants, {
  ORDER_STATUS,
  WORKORDER_WORKFLOW,
  WORKORDER_MAPPING,
} from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";
import { getOrderKind } from "lib/utils";

const getStatusName = (statusCode) =>
  ORDER_STATUS.find((a) => a.key?.trim() === statusCode?.trim())?.systemName;

const WorkOrderActions = ({ data, onHistory, onEdit, onView, onUpdate, kind }) => {
  const { m_WorkOrderNo, w_Status, d_Status } = data;

  // statusIndex
  let allowedStatusWindow = [];
  let allowedStatusDoor = [];

  if (kind === "m" || getOrderKind(data) === "m" || getOrderKind(data) === "w") {
    allowedStatusWindow = WORKORDER_WORKFLOW[getStatusName(w_Status)] || [];
  }

  if (kind === "m" || getOrderKind(data) === "m" || getOrderKind(data) === "d") {
    allowedStatusDoor = WORKORDER_WORKFLOW[getStatusName(d_Status)] || [];
  }

  const handleMoveTo = useLoadingBar(async (key, _kind) => {
    const { m_WorkOrderNo, m_MasterId } = data;
    const payload = {
      m_WorkOrderNo,
      m_MasterId,
      newStatus: key,
    };
    const updatingIdField = `${_kind}_Id`;
    const updatingStatusField =  `${_kind}_Status`;
    payload[updatingIdField] = data[updatingIdField];
    payload[updatingStatusField] = data[updatingStatusField]

    await OrdersApi.updateWorkOrderStatus(payload);
    onUpdate();
  });

  const handleDelete = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to delete [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    await OrdersApi.softDeleteProductionsWorkOrder(data);
    onUpdate();
  });

  const handleSyncWindowMaker = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to snyc Window Maker data for [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    const manufacturingFacility = data.m_Facility
    // fetch from WM
    if (manufacturingFacility === "Calgary") {
      await OrdersApi.sync_AB_WindowMakerByWorkOrderAsync({
        WorkOrderNo : data?.m_WorkOrderNo,
        Status: data?.m_Status
      });
    } else {
      await OrdersApi.sync_BC_WindowMakerByWorkOrderAsync({
        WorkOrderNo : data?.m_WorkOrderNo,
        Status: data?.m_Status
      });
    }
    onUpdate();
  }  )

  const actions = (
    <div className={cn(styles.workorderActionsContainer)}>
      <Button type="text" icon={<EyeOutlined />} onClick={onView}>
        View Order
      </Button>
      <PermissionBlock
        featureCode={constants.FEATURE_CODES["om.prod.wo"]}
        op="canEdit"
      >
        <Button type="text" icon={<EditOutlined />} onClick={onEdit}>
          Edit Order
        </Button>
      </PermissionBlock>
      <PermissionBlock
        featureCode={constants.FEATURE_CODES["om.prod.statusSwitchGeneral"]}
      >
        {allowedStatusWindow?.map((stepName) => {
          const { label, color, key } = WORKORDER_MAPPING[stepName];
          return (
            <Button
              type="text"
              icon={<ArrowRightOutlined />}
              onClick={() => handleMoveTo(key, "w")}
              key={key}
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
          );
        })}

        {allowedStatusDoor?.map((stepName) => {
          const { label, color, key } = WORKORDER_MAPPING[stepName];
          return (
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
          );
        })}
      </PermissionBlock>
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

      <Button
          type="text"
          icon={<SyncOutlined  />}
          onClick={handleSyncWindowMaker}
        >
          Sync From Window Maker
      </Button>

      <PermissionBlock
        featureCode={constants.FEATURE_CODES["om.prod.woHistory"]}
      >
        <Button
          type="text"
          icon={<HistoryOutlined />}
          onClick={onHistory}
        >
          View Order History
        </Button>
      </PermissionBlock>
    </div>
  );

  return (
    <Dropdown_Custom
      renderTrigger={(onClick) => {
        return (
          <span style={{ cursor: "pointer" }} onClick={onClick}>
            {m_WorkOrderNo}
          </span>
        );
      }}
      content={actions}
    />
  );
};

export default WorkOrderActions;
