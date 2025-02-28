import React, { createContext, useContext, useState, useEffect } from "react";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";

import utils from "lib/utils";

import OrdersApi from "lib/api/OrdersApi";
import GlassApi from "lib/api/GlassApi";

import useLoadingBar from "lib/hooks/useLoadingBar";
import constants, { ORDER_STATUS } from "lib/constants";
import { getOrderKind } from "lib/utils";

import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";

export const LocalDataContext = createContext(null);

const DUMMY = [
  {
    Id: 1,
    MasterId: "e8bde1d9-7741-4b4f-b6b1-33c25a729f9f",
    WorkOrderNo: "WO-1001",
    PreData: "Initial Setup",
    Version: 1,
    ChangedData: [
      { Field: "Status", OldValue: "New", NewValue: "In Progress" },
    ],
    Operation: "Create",
    CreatedAt: "2023-10-01T10:15:00Z",
    ChangedBy: "john.doe",
  },
  {
    Id: 2,
    MasterId: "5f9d8f8e-2a58-472a-b0d4-682c5c88c7e3",
    WorkOrderNo: "WO-1002",
    PreData: "Pre-check completed",
    Version: 2,
    ChangedData: [{ Field: "Priority", OldValue: "Low", NewValue: "High" }],
    Operation: "Update",
    CreatedAt: "2023-10-02T09:30:00Z",
    ChangedBy: "jane.smith",
  },
  {
    Id: 3,
    MasterId: "c6d1e3f9-4d27-4ad5-90b9-4c9b2b3c8c15",
    WorkOrderNo: "WO-1003",
    PreData: "Data review",
    Version: 1,
    ChangedData: [
      { Field: "DueDate", OldValue: "2023-10-10", NewValue: "2023-10-15" },
    ],
    Operation: "Edit",
    CreatedAt: "2023-10-03T11:45:00Z",
    ChangedBy: "mike.jones",
  },
  {
    Id: 4,
    MasterId: "b8d2a7e0-7d3b-42f2-84e2-5f982a6b6d92",
    WorkOrderNo: "WO-1004",
    PreData: "Initial submission",
    Version: 1,
    ChangedData: [
      { Field: "AssignedTo", OldValue: "Team A", NewValue: "Team B" },
    ],
    Operation: "Reassign",
    CreatedAt: "2023-10-04T13:20:00Z",
    ChangedBy: "linda.white",
  },
  {
    Id: 5,
    MasterId: "9c3e3b8a-80ab-4c97-aeb7-7287a5b5c2d6",
    WorkOrderNo: "WO-1005",
    PreData: "Review pending",
    Version: 2,
    ChangedData: [
      { Field: "Status", OldValue: "Pending", NewValue: "Completed" },
    ],
    Operation: "Close",
    CreatedAt: "2023-10-05T14:05:00Z",
    ChangedBy: "susan.king",
  },
  {
    Id: 6,
    MasterId: "3d3b3c7b-5c6b-4f8e-8d72-7a2b9b3d5d8e",
    WorkOrderNo: "WO-1006",
    PreData: "New order created",
    Version: 1,
    ChangedData: [{ Field: "Amount", OldValue: "100", NewValue: "150" }],
    Operation: "Update",
    CreatedAt: "2023-10-06T15:45:00Z",
    ChangedBy: "emma.green",
  },
  {
    Id: 7,
    MasterId: "2b3d4e5f-6a7b-4c8d-9e2f-5b1a7c8d9e0f",
    WorkOrderNo: "WO-1007",
    PreData: "Work scheduled",
    Version: 1,
    ChangedData: [
      { Field: "StartDate", OldValue: "2023-10-20", NewValue: "2023-10-22" },
    ],
    Operation: "Reschedule",
    CreatedAt: "2023-10-07T16:30:00Z",
    ChangedBy: "william.brown",
  },
  {
    Id: 8,
    MasterId: "5a6b7c8d-9e0f-4b1a-8c2d-3e4f5b6c7d8e",
    WorkOrderNo: "WO-1008",
    PreData: "Inspection required",
    Version: 1,
    ChangedData: [{ Field: "Inspector", OldValue: "John", NewValue: "Sarah" }],
    Operation: "Reassign",
    CreatedAt: "2023-10-08T17:10:00Z",
    ChangedBy: "chris.martin",
  },
  {
    Id: 9,
    MasterId: "7c8d9e0f-5b1a-4c2d-8e3f-6a7b8c9d0e1f",
    WorkOrderNo: "WO-1009",
    PreData: "Waiting for approval",
    Version: 3,
    ChangedData: [
      { Field: "ApprovalStatus", OldValue: "Pending", NewValue: "Approved" },
    ],
    Operation: "Approve",
    CreatedAt: "2023-10-09T18:00:00Z",
    ChangedBy: "david.clark",
  },
  {
    Id: 10,
    MasterId: "9e0f1a2b-3c4d-5e6f-7b8c-9d0e1f2a3b4c",
    WorkOrderNo: "WO-1010",
    PreData: "Quality check",
    Version: 2,
    ChangedData: [
      {
        Field: "QualityStatus",
        OldValue: "Check Required",
        NewValue: "Checked",
      },
    ],
    Operation: "Complete",
    CreatedAt: "2023-10-10T19:30:00Z",
    ChangedBy: "olivia.wilson",
  },
];

export const LocalDataProvider = ({
  children,
  initWorkOrder,
  kind: initKind,
  facility,
  onSave,
  onHide,
  initIsEditable,
  ...props
}) => {
  const generalContext = useContext(GeneralContext);
  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  // only display. upload/delete will directly call function
  useEffect(() => {
    if (initWorkOrder) {
      init(initWorkOrder);
    }
  }, [initWorkOrder]);

  // ====== api calls
  const clear = () => {
    setData(null);
  };

  const init = async (initWorkOrderNo) => {
    setIsLoading(true);
    setData(null);

    // fetch data
    const res =  DUMMY //await Wrapper_OrdersApi.getWorkOrder(initWorkOrderNo);

    if (res) {
      setData(
        res.map((a) => {
          return {
            ...a,
            CreatedAt: utils.formatDate(a.CreatedAt),
          };
        }),
      );
    }

    setIsLoading(false);
  };

  const context = {
    ...generalContext,
    ...props,
    isLoading,
    initWorkOrder,
    data,
    setData,
    onHide
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
