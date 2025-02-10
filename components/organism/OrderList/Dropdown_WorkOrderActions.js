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
import { GeneralContext } from "lib/provider/GeneralProvider";
import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";
import OrdersApi from "lib/api/OrdersApi";
import Dropdown_Custom from "components/atom/Dropdown_Custom";

import LoadingBlock from "components/atom/LoadingBlock";
import LabelDisplay from "components/atom/LabelDisplay";

import { ORDER_STATUS } from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";
import utils from "lib/utils";

const WorkOrderActions = ({ data, onEdit, onView, onUpdate, kind }) => {
  const { m_WorkOrderNo, m_Status } = data;

  // statusIndex
  let statusIndex = ORDER_STATUS.findIndex((a) => a.key === m_Status);

  if (statusIndex === -1) statusIndex = 0

  const nextStatus = ORDER_STATUS[statusIndex + 1]?.key || "";
  const previousStatus = ORDER_STATUS[statusIndex - 1]?.key || "";

  const handleProgress = useLoadingBar(async () => {
    await Wrapper_OrdersApi.updateWorkOrder(data, {
      [`${kind}_Status`]: nextStatus,
    });
    onUpdate();
  });

  const handleBack = useLoadingBar(async () => {
    await Wrapper_OrdersApi.updateWorkOrder(data, {
      [`${kind}_Status`]: previousStatus,
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
      <Button type="text" icon={<EyeOutlined />} onClick={onView}>
        View Order
      </Button>
      <Button type="text" icon={<EditOutlined />} onClick={onEdit}>
        Edit Order
      </Button>
      {nextStatus && (
        <Button
          type="text"
          icon={<ArrowRightOutlined />}
          onClick={handleProgress}
        >
          Progress to: <b>{nextStatus}</b>
        </Button>
      )}

      {previousStatus && (
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleBack}>
          Back to: <b>{previousStatus}</b>
        </Button>
      )}

      <Button
        type="text"
        icon={<DeleteOutlined />}
        onClick={handleDelete}
        // disabled={true}
        title="not implemented"
      >
        Delete Order
      </Button>
      <Button
        type="text"
        icon={<HistoryOutlined />}
        disabled={true}
        title="not implemented"
      >
        View Order History
      </Button>
    </div>
  );

  return (
    <Dropdown_Custom
      renderTrigger={(onClick) => {
        return (
          <span style={{ cursor: "pointer", }} onClick={onClick}>
            {m_WorkOrderNo}
          </span>
        );
      }}
      content={actions}
    />
  );
};

export default WorkOrderActions;
