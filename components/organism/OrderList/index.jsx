import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import LoadingBlock from "components/atom/LoadingBlock";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";
import { WorkOrderSelectOptions, ORDER_STATUS } from "lib/constants";

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

              {jsxWindow(<th>Window Batch No</th>)}
              {jsxWindow(<th>Window Block No</th>)}
              {jsxDoor(<th>Door Batch No</th>)}
              {jsxDoor(<th>Door Block No</th>)}

              <th>Current status</th>
              {jsxWindow(<th>Windows</th>)}
              {jsxWindow(<th>Patio Doors</th>)}
              {jsxDoor(<th>Doors</th>)}
              <th>Others</th>
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
                m_workOrderNo,
                m_changedBy,
                m_branch,
                m_branchId,
                m_jobType,
                m_shippingType,

                w_batchNo, // no master
                w_blockNo, // no master

                d_batchNo, // no master
                d_blockNo, // no master

                m_status,
                m_numberOfWindows,
                m_numberOfDoors,
                m_numberOfOthers,
                m_numberOfPatioDoors,
                m_invStatus,
                m_createdAt,
                m_customerDate,
                w_glassOrderedDate,
              } = a;

              const statusDisplay = ORDER_STATUS?.find(
                (a) => a.key.toString() === m_status,
              );

              return (
                <tr key={m_workOrderNo}>
                  <td onClick={() => onEdit(a)}>
                    <div className={cn(styles.orderNumber)}>{m_workOrderNo}</div>
                  </td>
                  <td>{getValue(m_branchId, "branches")?.label}</td>
                  <td>{getValue(m_jobType, "jobTypes")?.label}</td>
                  <td>{getValue(m_shippingType, "shippingTypes")?.label}</td>

                  {jsxWindow(<td>{w_batchNo}</td>)}
                  {jsxWindow(<td>{w_blockNo}</td>)}
                  {jsxDoor(<td>{d_batchNo}</td>)}
                  {jsxDoor(<td>{d_blockNo}</td>)}

                  <td
                    style={{
                      color: statusDisplay?.textColor,
                      backgroundColor: statusDisplay?.color,
                    }}
                  >
                    {statusDisplay?.label}
                  </td>

                  {jsxWindow(<td>{m_numberOfWindows}</td>)}
                  {jsxWindow(<td>{m_numberOfPatioDoors}</td>)}
                  {jsxDoor(<td>{m_numberOfDoors}</td>)}
                  <td>{m_numberOfOthers}</td>
                  <td>{m_invStatus}</td>
                  <td>{m_createdAt}</td>
                  <td>{m_changedBy}</td>
                  <td>{m_customerDate}</td>
                  {jsxWindow(<td>{w_glassOrderedDate}</td>)}
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
