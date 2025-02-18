import React, { useState, useEffect, useContext } from "react";
import {
  EyeOutlined,
  EditOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  DeleteOutlined,
  HistoryOutlined,
} from "@ant-design/icons";

import { Button } from "antd";

import cn from "classnames";
import _ from "lodash";
import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";
import OrdersApi from "lib/api/OrdersApi";
import Dropdown_Custom from "components/atom/Dropdown_Custom";
import PermissionBlock from "components/atom/PermissionBlock";

import constants, {
  ORDER_STATUS,
  WORKORDER_WORKFLOW,
  WORKORDER_MAPPING,
} from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";
import {getOrderKind} from "lib/utils";


const getStatusName = (statusCode) => ORDER_STATUS.find(
  (a) => a.key?.trim() === statusCode?.trim(),
)?.systemName;


const WorkOrderActions = ({ data, onEdit, onView, onUpdate, kind }) => {
  const { m_WorkOrderNo, m_Status, w_Status, d_Status } = data;

  // statusIndex
  let allowedStatusWindow = [];
  let allowedStatusDoor = [];

  if (kind === 'm' || getOrderKind(data) === 'w') {
    allowedStatusWindow = WORKORDER_WORKFLOW[getStatusName(w_Status)] || [];
  }

  if (kind === 'm' || getOrderKind(data) === 'd') {
    allowedStatusDoor = WORKORDER_WORKFLOW[getStatusName(d_Status)] || [];
  }

  const handleMoveTo = useLoadingBar(async (key, _kind) => {
    await Wrapper_OrdersApi.updateWorkOrder(data, {
      [`${_kind}_Status`]: key,
    });
    onUpdate();
  });

  const handleDelete = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to delete [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    await OrdersApi.softDeleteProductionsWorkOrder(data);
    onUpdate();
  });

  const actions = (
    <div className={cn(styles.workorderActionsContainer)}>
      <PermissionBlock featureCode={constants.FEATURE_CODES["nav.prod.woView"]}>
        <Button type="text" icon={<EyeOutlined />} onClick={onView}>
          View Order
        </Button>
      </PermissionBlock>
      <PermissionBlock featureCode={constants.FEATURE_CODES["nav.prod.woEdit"]}>
        <Button type="text" icon={<EditOutlined />} onClick={onEdit}>
          Edit Order
        </Button>
      </PermissionBlock>
      <PermissionBlock
        featureCode={constants.FEATURE_CODES["nav.prod.statusSwitchGeneral"]}
      >
        {allowedStatusWindow?.map((stepName) => {
          const { label, color, key } = WORKORDER_MAPPING[stepName];
          return (
            <Button
              type="text"
              icon={<ArrowRightOutlined />}
              onClick={() => handleMoveTo(key, 'w')}
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
              onClick={() => handleMoveTo(key, 'd')}
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
        featureCode={constants.FEATURE_CODES["nav.prod.woDelete"]}
      >
        <Button
          type="text"
          icon={<DeleteOutlined />}
          onClick={handleDelete}
          // disabled={true}
          title="not implemented"
        >
          Delete Order
        </Button>
      </PermissionBlock>
      <PermissionBlock
        featureCode={constants.FEATURE_CODES["nav.prod.woViewHistory"]}
      >
        <Button
          type="text"
          icon={<HistoryOutlined />}
          disabled={true}
          title="not implemented"
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
