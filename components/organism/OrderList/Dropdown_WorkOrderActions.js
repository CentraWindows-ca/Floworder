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
  DraftReservation,
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
  onEditPending,
  onView,
  onUpdate,
  kind,
}) => {
  const { m_WorkOrderNo, m_IsActive, w_Status, d_Status } = data;
  const { toast, permissions } = useContext(GeneralContext);
  const { filterOutByStatus } = useFilterControl(permissions);

  const { requestData } = useInterrupt();

  // toggle it to close dropdown
  const [closeToggle, setCloseToggle] = useState(false);

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

  const handleMoveTo = async (newStatus, _kind) => {
    const payload = await getStatusPayload(data, newStatus, _kind);
    if (payload === null) return null;
    if (
      !window.confirm(
        `For work order [${data?.m_WorkOrderNo}], are you sure to update Status to ${newStatus}?`,
      )
    ) {
      return null;
    }

    await doMove(payload);

    toast("Status updated", { type: "success" });
    setCloseToggle((p) => !p);
    onUpdate();
  };

  const handleDelete = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to delete [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    await OrdersApi.softDeleteProductionsWorkOrder(null, null, data);
    toast("Work order moved to trash bin", { type: "success" });
    setCloseToggle((p) => !p);
    onUpdate();
  });

  const handleUndoDelete = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to delete [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    await OrdersApi.undoSoftDeleteProductionsWorkOrder(null, null, data);
    toast("Work order restored", { type: "success" });
    setCloseToggle((p) => !p);
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

    await OrdersApi.hardDeleteProductionsWorkOrder(null, data, data);
    toast("Work order deleted permenantly", { type: "success" });
    setCloseToggle((p) => !p);
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
      await WM2CWProdApi.updateOnly_AB_WMByWorkOrderAsync(
        null,
        {
          workOrderNo: data?.m_WorkOrderNo,
        },
        data,
      );
    } else {
      await WM2CWProdApi.updateOnly_BC_WMByWorkOrderAsync(
        null,
        {
          workOrderNo: data?.m_WorkOrderNo,
        },
        data,
      );
    }

    toast("Work order updated from WindowMaker", { type: "success" });
    setCloseToggle((p) => !p);
    onUpdate();
  });

  const doMove = useLoadingBar(async (payload) => {
    await OrdersApi.updateWorkOrderStatus(null, payload, data);
  });

  const actionsActive = (
    <div className={cn(styles.workorderActionsContainer)}>
      <PermissionBlock isHidden={filterOutByStatus({ id: "viewOrder", data })}>
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => {
            onView();
            setCloseToggle((p) => !p);
          }}
        >
          View Order
        </Button>
      </PermissionBlock>

      <PermissionBlock
        featureCodeGroup={constants.FEATURE_CODES["om.prod.wo"]}
        isHidden={filterOutByStatus({ id: "editOrder", data })}
        op="canEdit"
      >
        <Button
          type="text"
          icon={<EditOutlined />}
          onClick={() => {
            onEdit();
            setCloseToggle((p) => !p);
          }}
        >
          Edit Order
        </Button>
      </PermissionBlock>

      <PermissionBlock
        featureCodeGroup={constants.FEATURE_CODES["om.prod.wo"]}
        isHidden={filterOutByStatus({ id: "editPendingOrder", data })}
        op="canEdit"
      >
        <Button type="text" icon={<EditOutlined />} onClick={() => {
          onEditPending()
          setCloseToggle((p) => !p);

        }}>
          Edit Pending Order
        </Button>
      </PermissionBlock>

      <PermissionBlock
        featureCode={constants.FEATURE_CODES["om.prod.wo.status.window"]}
      >
        {allowedStatusWindow?.map((stepName) => {
          const { label, color, key } = WORKORDER_MAPPING[stepName];
          return (
            <PermissionBlock
              key={key}
              isHidden={filterOutByStatus({
                id: `windowStatus_${key}`,
                data,
              })}
            >
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
            </PermissionBlock>
          );
        })}
      </PermissionBlock>

      <PermissionBlock
        featureCode={constants.FEATURE_CODES["om.prod.wo.status.door"]}
      >
        {allowedStatusDoor?.map((stepName) => {
          const { label, color, key } = WORKORDER_MAPPING[stepName];
          return (
            <PermissionBlock
              key={key}
              isHidden={filterOutByStatus({ id: `doorStatus_${key}`, data })}
            >
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
            </PermissionBlock>
          );
        })}
      </PermissionBlock>

      <PermissionBlock
        featureCode={[
          constants.FEATURE_CODES["om.prod.wo"],
          constants.FEATURE_CODES["om.prod.woAdmin"],
        ]}
        isHidden={filterOutByStatus({ id: "deleteOrder", data, permissions })}
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
      <PermissionBlock
        featureCode={constants.FEATURE_CODES["om.prod.wo"]}
        isHidden={filterOutByStatus({ id: "syncFromWindowMaker", data })}
        op="canEdit"
      >
        <Button
          type="text"
          icon={<i className="fa-solid fa-cloud-arrow-down"></i>}
          onClick={handleGetWindowMaker}
        >
          Get WindowMaker
        </Button>
      </PermissionBlock>

      <PermissionBlock
        featureCode={constants.FEATURE_CODES["om.prod.history"]}
        isHidden={filterOutByStatus({ id: "viewOrderHistory", data })}
        op="canView"
      >
        <Button
          type="text"
          icon={<i className="fa-solid fa-clock-rotate-left"></i>}
          onClick={() => {
            setCloseToggle((p) => !p);
            onHistory();
          }}
        >
          View Order History
        </Button>
      </PermissionBlock>
    </div>
  );

  const actionsTrash = (
    <div className={cn(styles.workorderActionsContainer)}>
      <Button
        type="text"
        icon={<EyeOutlined />}
        onClick={() => {
          onView();
          setCloseToggle((p) => !p);
        }}
      >
        View Order
      </Button>

      <Button type="text" icon={<UndoOutlined />} onClick={handleUndoDelete}>
        Undo Order Deletion
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
        closeToggle={closeToggle}
      />
    </>
  );
};

const useFilterControl = (permissions) => {
  const filterOutByStatus = ({ id, data }) => {
    // admin is able to delete
    if (permissions?.["om.prod.woAdmin"]?.["canDelete"]) {
      if (id === "deleteOrder") {
        return false;
      }
    }

    // NOTE: same rule applies to popup edit button. if pending or cancelled cant edit
    if (data?.m_Status === WORKORDER_MAPPING.Pending.key) {
      if (id !== "viewOrder" && id !== "editPendingOrder") return true;
    } else {
      if (id === "editPendingOrder") {
        return true;
      }
    }
    if (data?.m_Status === WORKORDER_MAPPING.Cancelled.key) {
      if (
        id !== "viewOrder" &&
        id !== "deleteOrder" &&
        id !== "viewOrderHistory"
      )
        return true;
    }

    if (
      id === `doorStatus_${WORKORDER_MAPPING.DraftReservation.key}` ||
      id === `windowStatus_${WORKORDER_MAPPING.DraftReservation.key}`
    ) {
      if (permissions?.["om.prod.wo.statusReservation"]?.["canEdit"]) {
        return false;
      } else {
        return true;
      }
    }

    return false;
  };

  return {
    filterOutByStatus,
  };
};

export default WorkOrderActions;
