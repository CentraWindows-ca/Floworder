import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import LoadingBlock from "components/atom/LoadingBlock";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";
import { WorkOrderSelectOptions, ORDER_STATES } from "lib/constants";

const getValue = (k, arrName) => {
  const arr = WorkOrderSelectOptions[arrName];
  return arr.find((a) => a.key === k);
};

const Com = (props) => {
  const { onEdit, data, kind } = props;

  const jsxNotMaster = (jsx) => (kind !== "MASTER" ? jsx : null);
  const jsxWindow = (jsx) => (kind === "WIN" || kind === "MASTER" ? jsx : null);
  const jsxDoor = (jsx) => (kind === "DOOR" || kind === "MASTER" ? jsx : null);

  return (
    <div className={cn("w-full", styles.root)}>
      <LoadingBlock isLoading={!data}>
        <table
          className={cn(
            styles.orderTable,
            "table-sm table-bordered table-hover table border text-xs",
          )}
          style={{ minWidth: 1500 }}
        >
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th>Work Order</th>
              <th>Branch</th>
              <th>Job Type</th>
              <th>Shipping Type</th>
              {jsxNotMaster(<th>Batch No</th>)}
              {jsxNotMaster(<th>Block No</th>)}
              <th>Current status</th>
              {jsxWindow(<th>Windows</th>)}
              {jsxWindow(<th>Patio Doors</th>)}
              {jsxDoor(<th>Doors</th>)}
              <th>INV Status</th>
              <th>Created On</th>
              <th>Created By</th>
              <th>Customer Date</th>
              {jsxWindow(<th>Glass Ordered Date</th>)}
            </tr>
          </thead>
          <tbody>
            {data?.map((a) => {
              const {
                workOrderNo,
                changedBy,
                branch,
                branchId,
                jobType,
                shippingType,
                batchNo, // no master
                blockNo, // no master
                status,
                numberOfWindows,
                numberOfDoors,
                numberOfOthers,
                numberOfPatioDoors,
                invStatus,
                createdAt,
                customerDate,
                glassOrderedDate,
              } = a;

              console.log(a);

              const statusDisplay = ORDER_STATES?.find(
                (a) => a.key.toString() === status,
              );

              return (
                <tr key={workOrderNo}>
                  <td onClick={() => onEdit(a)}>
                    <div className={cn(styles.orderNumber)}>{workOrderNo}</div>
                  </td>
                  <td>{getValue(branchId, "branches")?.label}</td>
                  <td>{getValue(jobType, "jobTypes")?.label}</td>
                  <td>{getValue(shippingType, "shippingTypes")?.label}</td>
                  {jsxNotMaster(<td>{batchNo}</td>)}
                  {jsxNotMaster(<td>{blockNo}</td>)}

                  <td
                    style={{
                      color: statusDisplay?.textColor,
                      backgroundColor: statusDisplay?.color,
                    }}
                  >
                    {statusDisplay?.label}
                  </td>

                  {jsxWindow(<td>{numberOfWindows}</td>)}
                  {jsxWindow(<td>{numberOfPatioDoors}</td>)}
                  {jsxDoor(<td>{numberOfDoors}</td>)}
                  <td>{invStatus}</td>
                  <td>{createdAt}</td>
                  <td>{changedBy}</td>
                  <td>{customerDate}</td>
                  {jsxWindow(<td>{glassOrderedDate}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </LoadingBlock>
    </div>
  );
};

const ColumnLogic = () => {};

export default Com;
