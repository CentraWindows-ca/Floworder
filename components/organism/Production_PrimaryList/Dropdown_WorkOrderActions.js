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
import Dropdown_MultiLayerControlled from "components/atom/Dropdown_MultiLayerControlled";

import cn from "classnames";
import _ from "lodash";
import OrdersApi from "lib/api/OrdersApi";
import WM2CWProdApi from "lib/api/WM2CWProdApi";
import Dropdown_Custom from "components/atom/Dropdown_Custom";
import PermissionBlock, {
  checkPermissionBlock,
  useCheckPermissionBlock,
} from "components/atom/PermissionBlock";

import constants, {
  DraftReservation,
  ORDER_STATUS,
  WORKORDER_WORKFLOW,
  WORKORDER_STATUS_MAPPING,
  ORDER_TRANSFER_FIELDS,
  FACILITY_FROM_CODE,
  getStatusName,
} from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";
import { getOrderKind } from "lib/utils";

const WorkOrderActions = ({
  data,
  onHistory,
  onEdit,
  onEditPending,
  onView,
  onUpdate,
  kind,
}) => {
  const {
    m_WorkOrderNo,
    m_IsActive,
    m_WinStatus,
    m_DoorStatus,
    internal_facilityList,
  } = data;

  const { toast, permissions } = useContext(GeneralContext);
  const { filterOutByStatus } = useFilterControl(permissions);
  const [options, setOptions] = useState([]);

  const { requestData } = useInterrupt();
  const { getIsShowByPermission } = useCheckPermissionBlock();

  // toggle it to close dropdown
  const [closeToggle, setCloseToggle] = useState(false);

  // statusIndex
  let allowedStatusWindow = [];
  let allowedStatusDoor = [];

  const isShowWindowStatus =
    kind === "m" || getOrderKind(data) === "m" || getOrderKind(data) === "w";

  const isShowDoorStatus =
    kind === "m" || getOrderKind(data) === "m" || getOrderKind(data) === "d";

  if (isShowWindowStatus) {
    allowedStatusWindow = WORKORDER_WORKFLOW[getStatusName(m_WinStatus)] || [];
  }

  if (isShowDoorStatus) {
    allowedStatusDoor = WORKORDER_WORKFLOW[getStatusName(m_DoorStatus)] || [];
  }

  const getStatusPayload = async (data, newStatus, _kind, facilityCode) => {
    const { m_WorkOrderNo, m_MasterId } = data;
    let payload = {
      m_WorkOrderNo,
      m_MasterId,
      newStatus,
    };
    const updatingStatusField = `${_kind}_${facilityCode}_Status`;
    payload["oldStatus"] = data[updatingStatusField];
    payload["isWindow"] = _kind === "w";
    payload["facility"] = FACILITY_FROM_CODE[facilityCode];

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

  const handleMoveTo = async (
    newStatus,
    _kind,
    isReservation,
    facilityCode,
  ) => {
    const payload = await getStatusPayload(
      data,
      newStatus,
      _kind,
      facilityCode,
    );
    if (payload === null) return null;
    if (
      !window.confirm(
        `For work order [${data?.m_WorkOrderNo}], are you sure to update Status to ${newStatus}?`,
      )
    ) {
      return null;
    }

    const res = await doMove(payload, isReservation);
    if (res?.message) {
      // log hidden message for devs
      console.log(res?.message);
    }

    toast("Status updated", { type: "success" });
    onUpdate();
  };

  const handleDelete = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to delete [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    await OrdersApi.softDeleteProductionsWorkOrder(null, null, data);
    toast("Work order moved to trash bin", { type: "success" });
    onUpdate();
  });

  const handleUndoDelete = useLoadingBar(async () => {
    if (!window.confirm(`Are you sure to delete [${data?.m_WorkOrderNo}]?`)) {
      return null;
    }

    await OrdersApi.undoSoftDeleteProductionsWorkOrder(null, null, data);
    toast("Work order restored", { type: "success" });
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
          masterId: data?.m_MasterId,
          workOrderNo: data?.m_WorkOrderNo,
        },
        data,
      );
    } else {
      await WM2CWProdApi.updateOnly_BC_WMByWorkOrderAsync(
        null,
        {
          masterId: data?.m_MasterId,
          workOrderNo: data?.m_WorkOrderNo,
        },
        data,
      );
    }

    toast("Work order updated from WindowMaker", { type: "success" });
    onUpdate();
  });

  const doMove = useLoadingBar(async (payload, isReservation) => {
    return await OrdersApi.updateWorkOrderStatus(null, payload, data);
  });

  useEffect(() => {
    let _options = [];

    if (m_IsActive) {
      _options.push({
        onSelect: onView,
        title: (
          <Button type="text" icon={<EyeOutlined />}>
            View Order
          </Button>
        ),
        display: getIsShowByPermission({
          isHidden: filterOutByStatus({ id: "viewOrder", data, kind }),
        }),
      });
      _options.push({
        onSelect: onEdit,
        title: (
          <Button type="text" icon={<EditOutlined />}>
            Edit Order
          </Button>
        ),
        display: getIsShowByPermission({
          featureCodeGroup: constants.FEATURE_CODES["om.prod.wo"],
          isHidden: filterOutByStatus({ id: "editOrder", data, kind }),
          op: "canEdit",
        }),
      });
      _options.push({
        onSelect: onEditPending,
        title: (
          <Button type="text" icon={<EditOutlined />}>
            Edit Pending Order
          </Button>
        ),
        display: getIsShowByPermission({
          featureCodeGroup: constants.FEATURE_CODES["om.prod.wo"],
          isHidden: filterOutByStatus({ id: "editPendingOrder", data, kind }),
          op: "canEdit",
        }),
      });

      // ======== status ========
      const getStatusDropdown = (current_kind) => {
        let _option_lvl2 = [];

        // split facilities
        const _fac = internal_facilityList
          ?.map((k) => {
            const [kind, facilityCode] = k.split("_");
            return {
              fkcode: k,
              kind,
              facility: FACILITY_FROM_CODE[facilityCode] || "",
              facilityCode,
            };
          })
          ?.filter(({ kind }) => kind === current_kind);

        // get status of facilities
        _option_lvl2 = _fac?.map((f) => {
          const { fkcode, kind, facility, facilityCode } = f;
          const field = `${fkcode}_Status`;
          const current_status = data[field];
          const allowedStatus =
            WORKORDER_WORKFLOW[getStatusName(current_status)]?.map(
              (n) => WORKORDER_STATUS_MAPPING[n],
            ) || ORDER_STATUS.filter((a) => a.key);
          const currentStepObj =
            WORKORDER_STATUS_MAPPING[getStatusName(current_status)];
          const { label: currentLabel, color: currentColor } =
            currentStepObj || {};

          return {
            kind,
            title: (
              <div
                className={cn(
                  styles.statesContainer,
                  styles.statesContainerEditable,
                  "justify-content-between",
                )}
              >
                <div className="d-flex align-items-center gap-2">
                  <span
                    style={{
                      width: 15,
                      height: 15,
                      backgroundColor: currentColor,
                      border: "1px solid #A0A0A0",
                    }}
                  />
                  <b>{currentLabel || "- not set -"}</b>
                  <span>({facility})</span>
                </div>
                <i className="fa-solid fa-angle-right"></i>
              </div>
            ),
            facilityCode,
            className: styles.facilityDropdownItem,
            options: allowedStatus?.map((step) => {
              const { label, color, key, isReservation } = step || {};
              let idPrefix = "";
              if (kind === "w") {
                idPrefix = "windowStatus_";
              } else {
                idPrefix = "doorStatus";
              }

              return {
                onSelect: () => {
                  handleMoveTo(key, kind, isReservation, facilityCode);
                },
                isHidden: filterOutByStatus({
                  id: idPrefix + "_" + key,
                  data,
                  kind,
                }),
                title: (
                  <div
                    key={key}
                    className={cn(
                      styles.statesContainer,
                      styles.statesContainerEditable,
                    )}
                    style={{ minHeight: 36 }}
                  >
                    Move to
                    <span
                      style={{
                        width: 15,
                        height: 15,
                        backgroundColor: color,
                        border: "1px solid #A0A0A0",
                      }}
                    />
                    <b>{label}</b>
                  </div>
                ),
              };
            }),
          };
        });

        // if there is one facility. dont show it
        if (_option_lvl2?.length === 1) {
          _option_lvl2 = _option_lvl2[0].options;
        }

        return _option_lvl2;
      };
      // window:
      const _winCurrentStepObj =
        WORKORDER_STATUS_MAPPING[getStatusName(m_WinStatus)];
      const { label: winStatusLabel, color: winStatusColor } =
        _winCurrentStepObj || {};

      if (!_.isEmpty(allowedStatusWindow)) {
        const _optionsForWin = {
          title: (
            <Button type="text" icon={<ArrowRightOutlined />}>
              <div className="d-flex align-items-center justify-content-between w-full gap-2">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: winStatusColor,
                      border: "1px solid #A0A0A0",
                    }}
                  />
                  <b>Window Status</b>
                </div>
                <span>
                  <i className="fa-solid fa-angle-right" />
                </span>{" "}
              </div>
            </Button>
          ),
          key: "windowStatus",
          options: getStatusDropdown("w"),
          display: getIsShowByPermission({
            featureCode: constants.FEATURE_CODES["om.prod.wo.status.window"],
          }),
        };
        _options.push(_optionsForWin);
      }

      // door:
      const _doorCurrentStepObj =
        WORKORDER_STATUS_MAPPING[getStatusName(m_WinStatus)];
      const { label: doorStatusLabel, color: doorStatusColor } =
        _doorCurrentStepObj || {};

      if (!_.isEmpty(allowedStatusDoor)) {
        const _optionsForDoor = {
          title: (
            <Button type="text" icon={<ArrowRightOutlined />}>
              <div className="d-flex align-items-center justify-content-between w-full gap-2">
                <div className="d-flex align-items-center gap-2">
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      backgroundColor: doorStatusColor,
                      border: "1px solid #A0A0A0",
                    }}
                  />
                  <b>Door Status</b>
                </div>
                <span>
                  <i className="fa-solid fa-angle-right" />
                </span>{" "}
              </div>
            </Button>
          ),
          key: "doorStatus",
          options: getStatusDropdown("d"),
          display: getIsShowByPermission({
            featureCode: constants.FEATURE_CODES["om.prod.wo.status.door"],
          }),
        };
        _options.push(_optionsForDoor);
      }

      // ======== status ========

      _options.push({
        onSelect: handleDelete,
        title: (
          <Button type="text" icon={<DeleteOutlined />}>
            Delete Order
          </Button>
        ),
        display: getIsShowByPermission({
          featureCode: [
            constants.FEATURE_CODES["om.prod.wo"],
            constants.FEATURE_CODES["om.prod.woAdmin"],
          ],
          isHidden: filterOutByStatus({
            id: "deleteOrder",
            data,
            permissions,
            kind,
          }),
          op: "canDelete",
        }),
      });

      _options.push({
        onSelect: handleGetWindowMaker,
        title: (
          <Button
            type="text"
            icon={<i className="fa-solid fa-cloud-arrow-down"></i>}
          >
            Get WindowMaker
          </Button>
        ),
        display: getIsShowByPermission({
          featureCode: constants.FEATURE_CODES["om.prod.woGetWindowMaker"],
          isHidden: filterOutByStatus({
            id: "syncFromWindowMaker",
            data,
            kind,
          }),
          op: "canEdit",
        }),
      });

      _options.push({
        onSelect: onHistory,
        title: (
          <Button
            type="text"
            icon={<i className="fa-solid fa-clock-rotate-left"></i>}
          >
            View Order History
          </Button>
        ),
        display: getIsShowByPermission({
          featureCode: constants.FEATURE_CODES["om.prod.history"],
          isHidden: filterOutByStatus({ id: "viewOrderHistory", data, kind }),
          op: "canView",
        }),
      });
    } else {
      _options.push({
        onSelect: onView,
        title: (
          <Button type="text" icon={<EyeOutlined />}>
            View Order
          </Button>
        ),
        display: getIsShowByPermission({
          isHidden: filterOutByStatus({ id: "viewOrder", data, kind }),
        }),
      });
      _options.push({
        onSelect: handleUndoDelete,
        title: (
          <Button type="text" icon={<UndoOutlined />}>
            Undo Order Deletion
          </Button>
        ),
        display: true,
      });

      _options.push({
        onSelect: handleHardDelete,
        title: (
          <Button type="text" icon={<DeleteOutlined />}>
            Permenantly Delete Order
          </Button>
        ),
        disabled: !getIsShowByPermission({
          featureCode: constants.FEATURE_CODES["om.prod.woHardDelete"],
          op: "canDelete",
        }),
        display: true,
      });
    }

    _options = _options?.filter((a) => a.display);

    setOptions(_options);
  }, [data, getIsShowByPermission]);

  return (
    <>
      <Dropdown_MultiLayerControlled
        title={<span style={{ cursor: "pointer" }}>{m_WorkOrderNo}</span>}
        options={options}
        hasContainer={false}
        classNamePopup={cn(styles.workorderActionsContainer)}
        layer={1}
      />
      {/* <Dropdown_Custom
        renderTrigger={(onClick) => {
          return (
            <span style={{ cursor: "pointer" }} onClick={onClick}>
              {m_WorkOrderNo}
            </span>
          );
        }}
        content={m_IsActive ? actionsActive : actionsTrash}
        closeToggle={closeToggle}
      /> */}
    </>
  );
};

const useFilterControl = (permissions) => {
  const filterOutByStatus = ({ id, data, kind }) => {
    const _isStatusUpdate =
      id?.startsWith("doorStatus_") || id?.startsWith("windowStatus_");

    // admin is able to delete
    if (permissions?.["om.prod.woAdmin"]?.["canDelete"]) {
      if (id === "deleteOrder") {
        return false;
      }
    }

    let _statusField = "m_Status";
    if (kind === "w") {
      _statusField = "m_WinStatus";
    }
    if (kind === "d") {
      _statusField = "m_DoorStatus";
    }

    // if kind status is pending
    if (data?.[_statusField] === WORKORDER_STATUS_MAPPING.Pending.key) {
      if (
        id !== "viewOrder" &&
        id !== "editPendingOrder" &&
        id !== "viewOrderHistory" &&
        !_isStatusUpdate
      )
        return true;
    } else {
      if (id === "editPendingOrder") {
        return true;
      }
    }

    /*NOTE: <rule 250912_cancel_editable> same rule applies to popup edit button. if cancelled cant edit */
    if (data?.[_statusField] === WORKORDER_STATUS_MAPPING.Cancelled.key) {
      if (
        id !== "viewOrder" &&
        id !== "deleteOrder" &&
        id !== "viewOrderHistory" &&
        !_isStatusUpdate
      ) {
        return true;
      }
    }

    // ========== temporary solution: @250423_handle_reservation: allow between regular and reservation ===========
    // ========== temporary solution: @260323 for facility split
    const temporaryReserv = [
      data?.m_DoorStatus === WORKORDER_STATUS_MAPPING.Draft.key &&
        id === `doorStatus_${WORKORDER_STATUS_MAPPING.DraftReservation.key}`,
      data?.m_WinStatus === WORKORDER_STATUS_MAPPING.Draft.key &&
        id === `windowStatus_${WORKORDER_STATUS_MAPPING.DraftReservation.key}`,
      data?.m_DoorStatus === WORKORDER_STATUS_MAPPING.Scheduled.key &&
        id ===
          `doorStatus_${WORKORDER_STATUS_MAPPING.ConfirmedReservation.key}`,
      data?.m_WinStatus === WORKORDER_STATUS_MAPPING.Scheduled.key &&
        id ===
          `windowStatus_${WORKORDER_STATUS_MAPPING.ConfirmedReservation.key}`,
      data?.m_DoorStatus === WORKORDER_STATUS_MAPPING.DraftReservation.key &&
        id === `doorStatus_${WORKORDER_STATUS_MAPPING.Draft.key}`,
      data?.m_WinStatus === WORKORDER_STATUS_MAPPING.DraftReservation.key &&
        id === `windowStatus_${WORKORDER_STATUS_MAPPING.Draft.key}`,
      data?.m_DoorStatus === WORKORDER_STATUS_MAPPING.ConfirmedReservation.key &&
        id === `doorStatus_${WORKORDER_STATUS_MAPPING.Scheduled.key}`,
      data?.m_WinStatus === WORKORDER_STATUS_MAPPING.ConfirmedReservation.key &&
        id === `windowStatus_${WORKORDER_STATUS_MAPPING.Scheduled.key}`,
    ];



    if (_.some(temporaryReserv)) {
      if (permissions?.["om.prod.wo.statusReservation"]?.["canEdit"]) {
        return false;
      } else {
        return true;
      }
    }
    // ========== temporary solution: @250423_handle_reservation: allow between regular and reservation ===========

    return false;
  };

  return {
    filterOutByStatus,
  };
};

export default WorkOrderActions;
