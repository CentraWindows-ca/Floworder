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
import Dropdown_Custom from "components/atom/Dropdown_Custom";

import LoadingBlock from "components/atom/LoadingBlock";
import LabelDisplay from "components/atom/LabelDisplay";

import {ORDER_STATUS} from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";
import utils from "lib/utils";

// View Order - permission based
// Edit Order - permission based
// Progress to Status - permission based
// Back to Status - permission based
// Delete Order - permission based
// View Order History - permission based

const WorkOrderActions = ({ data, onEdit, onView, onUpdate }) => {
  const { m_WorkOrderNo, m_Status } = data;

  // statusIndex
  const statusIndex = ORDER_STATUS.findIndex((a) => a.key === m_Status);

  const handleProgress = useLoadingBar(async () => {
    await Wrapper_OrdersApi.updateWorkOrder(data?.m_MasterId, {
      [`m_Status`]: ORDER_STATUS[statusIndex + 1]?.key,
    });
    onUpdate();
  });

  const handleBack = useLoadingBar(async () => {
    await Wrapper_OrdersApi.updateWorkOrder(data?.m_MasterId, {
      [`m_Status`]: ORDER_STATUS[statusIndex - 1]?.key,
    });
    onUpdate();
  });

  const handleDelete = () => {
    onUpdate();
  };

  const actions = (
    <div className={cn(styles.workorderActionsContainer)}>
      <Button type="text" icon={<EyeOutlined />} onClick={onView}>
        View Order
      </Button>
      <Button type="text" icon={<EditOutlined />} onClick={onEdit}>
        Edit Order
      </Button>
      <Button
        type="text"
        icon={<ArrowRightOutlined />}
        onClick={handleProgress}
        disabled={statusIndex >= ORDER_STATUS.length - 1}
      >
        Progress to Status
      </Button>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={handleBack}
        disabled={statusIndex <= 0}
      >
        Back to Status
      </Button>
      <Button type="text" icon={<DeleteOutlined />} onClick={handleDelete} disabled={true}
      title="not implemented"
      >
        Delete Order
      </Button>
      <Button type="text" icon={<HistoryOutlined />} disabled={true}
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
          <span style={{ cursor: "pointer", color: "blue" }} onClick={onClick}>
            {m_WorkOrderNo}
          </span>
        );
      }}
      content={actions}
    />
  );
};

export default WorkOrderActions;
