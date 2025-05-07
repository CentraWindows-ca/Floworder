import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import PermissionBlock from "components/atom/PermissionBlock";
import TableSortable from "components/atom/TableSortable";
import constants from "lib/constants";
import utils from "lib/utils";
import SubModal_Changes from "./SubModal_Changes";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const codeToTitleMap = {
  ScheduleOrder: "Schedule Order",
  AddRecord: "Add Record",
  AddRecordCalgary: "Add Record (Calgary)",
  UploadAttachments: "Upload Attachments",
  EditRecord2: "Edit Record",
  StartJob: "Start Job",
  MovedToDraft: "Moved to Draft",
  MovetoOnHold: "Move to On Hold",
  Create: "Create",
  EditRecord: "Edit Record",
  SyncPSQLData: "Sync PostgreSQL Data",
  MoveToTransferred: "Move to Transferred",
  SoftDelete: "Soft Delete",
  Update: "Update",
  MoveShipped: "Move to Shipped",
  CompleteReservation: "Complete Reservation",
  MarkReadyToShip: "Mark Ready to Ship",
  AddWOSupreme: "Add Work Order Supreme",
  AddWMWOBC: "Add WM Work Order BC",
  MovetoInProgress: "Move to In Progress",
  BackToInProgress: "Back to In Progress",
  BackToScheduled: "Back to Scheduled",
  DeleteAttachments: "Delete Attachments",
  MovebacktoDraftScheduled: "Move back to Draft (Scheduled)",
  MoveToTrash: "Move to Trash",
  AddWMWOAB: "Add WM Work Order AB",
  MoveToScheduled: "Move to Scheduled",
  RestoreFromTrash: "Restore from Trash",
  ScheduleOrder1: "Schedule Order (Alt)",
  MoveToScheduled1: "Move to Scheduled (Alt)",
  BackToReadytoShip: "Back to Ready to Ship",
  UndoSoftDelete: "Undo Soft Delete",
  Transit: "Transit",
  UpdateWorkOrder: "Update Work Order",
  UpdateWindowMakerData: "Update Window Maker Data",
  BacktoDraft: "Back to Draft",
  DeleteReturnTrip: "Delete Return Trip",
  UpdateReturnTrip: "Update Return Trip",
  CreateReturnTrip: "Create Return Trip",
  CreateShippingCallLog: "Create Shipping CallLog",
  UpdateShippingCallLog: "Update Shipping CallLog",
};

const Com = ({ layer = 1 }) => {
  const { isLoading, initMasterId, onHide, data, workOrderInfo } =
    useContext(LocalDataContext);

  const [idChanges, setIdChanges] = useState(null);
  const handleShowOrderChanges = setIdChanges;

  const columns = [
    {
      title: "Source App.",
      key: "Source",
    },
    {
      title: "Operation",
      key: "Operation",
      render: (v, record) => {
        return `${codeToTitleMap[record?.Operation] || record?.Operation}`;
      },
    },
    {
      title: "Operation time",
      key: "CreatedAt",
    },
    {
      title: "Changed by",
      key: "ChangedBy",
    },
    {
      title: "",
      render: (t, record) => {
        return (
          <div className="flex gap-2">
            {record.Source === "PlantProduction__history" ? (
              <div className="text-gray-300">-- Legacy Data--</div>
            ) : (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={() => handleShowOrderChanges(record)}
              >
                Detail
              </button>
            )}
          </div>
        );
      },
      isNotTitle: true,
    },
  ];

  // use swr later
  const jsxTitle = (
    <div className="justify-content-between align-items-center flex-grow-1 flex">
      <div className="align-items-center flex gap-2">
        Work Order # {workOrderInfo?.workOrderNo}
      </div>
    </div>
  );

  return (
    <>
      <Modal
        show={initMasterId}
        title={jsxTitle}
        size="xl"
        onHide={onHide}
        bodyClassName={styles.modalBody}
        titleClassName={"flex justify-content-between flex-grow-1"}
        layer={layer}
      >
        <LoadingBlock isLoading={isLoading}>
          <div className="p-2">
            <TableSortable
              {...{
                data: _.orderBy(data, ["CreatedAt", "Id"], ["desc", "desc"]),
                columns,
                keyField: "Id",
                keyFieldPrefix: `history_${initMasterId}`,
                isLockFirstColumn: false,
              }}
            />
          </div>
        </LoadingBlock>
      </Modal>
      <SubModal_Changes
        data={idChanges}
        onHide={() => setIdChanges(0)}
        layer={layer + 1}
      />
    </>
  );
};

export default (props) => {
  return (
    <LocalDataProvider {...props}>
      <Com />
    </LocalDataProvider>
  );
};
