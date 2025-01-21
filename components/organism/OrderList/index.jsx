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

  const jsxNotMaster = (jsx) => (kind !== "m" ? jsx : null);
  const jsxWindow = (jsx) => (kind === "w" || kind === "m" ? jsx : null);
  const jsxDoor = (jsx) => (kind === "d" || kind === "m" ? jsx : null);

  const jsxWindowOnly = (jsx) => (kind === "w" ? jsx : null);
  const jsxDoorOnly = (jsx) => (kind === "d" ? jsx : null);

  console.log(data)

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

              {jsxWindow(<th>Windows status</th>)}
              {jsxDoor(<th>Doors status</th>)}

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
              const { keyValue, value } = a;
              const merged =  { ...value?.d, ...value?.m, ...value?.w }
              const {
                m_WorkOrderNo,
                m_ChangedBy,
                m_Branch,
                m_BranchId,
                m_JobType,
                m_ShippingType,

                w_BatchNo, // no master
                w_BlockNo, // no master

                d_BatchNo, // no master
                d_BlockNo, // no master

                m_Status,
                w_Status,
                d_Status,
                m_NumberOfWindows,
                m_NumberOfDoors,
                m_NumberOfOthers,
                m_NumberOfPatioDoors,
                m_InvStatus,
                m_CreatedAt,
                m_CustomerDate,
                w_GlassOrderedDate,
              } = merged;

              const m_statusDisplay = ORDER_STATUS?.find(
                (a) => a.key.toString() === m_Status?.toString(),
              );
              const w_statusDisplay = ORDER_STATUS?.find(
                (a) => a.key.toString() === w_Status?.toString(),
              );
              const d_statusDisplay = ORDER_STATUS?.find(
                (a) => a.key.toString() === d_Status?.toString(),
              );
          
              return (
                <tr key={keyValue}>
                  <td onClick={() => onEdit(merged)}>
                    <div className={cn(styles.orderNumber)}>
                      {m_WorkOrderNo}
                    </div>
                  </td>
                  <td>{getValue(m_BranchId, "branches")?.label}</td>
                  <td>{getValue(m_JobType, "jobTypes")?.label}</td>
                  <td>{getValue(m_ShippingType, "shippingTypes")?.label}</td>

                  {jsxWindow(<td>{w_BatchNo}</td>)}
                  {jsxWindow(<td>{w_BlockNo}</td>)}
                  {jsxDoor(<td>{d_BatchNo}</td>)}
                  {jsxDoor(<td>{d_BlockNo}</td>)}

                  <td
                    style={{
                      color: m_statusDisplay?.textColor,
                      backgroundColor: m_statusDisplay?.color,
                    }}
                  >
                    {m_statusDisplay?.label}
                  </td>

                  {jsxWindow(
                    <td
                      style={{
                        color: w_statusDisplay?.textColor,
                        backgroundColor: w_statusDisplay?.color,
                      }}
                    >
                      {w_statusDisplay?.label}
                    </td>,
                  )}

                  {jsxDoor(
                    <td
                      style={{
                        color: d_statusDisplay?.textColor,
                        backgroundColor: d_statusDisplay?.color,
                      }}
                    >
                      {d_statusDisplay?.label}
                    </td>,
                  )}

                  {jsxWindow(<td>{m_NumberOfWindows}</td>)}
                  {jsxWindow(<td>{m_NumberOfPatioDoors}</td>)}
                  {jsxDoor(<td>{m_NumberOfDoors}</td>)}
                  <td>{m_NumberOfOthers}</td>
                  <td>{m_InvStatus}</td>
                  <td>{m_CreatedAt}</td>
                  <td>{m_ChangedBy}</td>
                  <td>{m_CustomerDate}</td>
                  {jsxWindow(<td>{w_GlassOrderedDate}</td>)}
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
