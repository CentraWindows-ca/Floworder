import React, { useState, useEffect } from "react";
import { Table } from "antd";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import LoadingBlock from "components/atom/LoadingBlock";
import LabelDisplay from "components/atom/LabelDisplay";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";
import { WorkOrderSelectOptions, ORDER_STATUS } from "lib/constants";
import utils from "lib/utils";

const getValue = (k, arrName) => {
  const arr = WorkOrderSelectOptions[arrName];
  return arr.find((a) => a.key === k);
};

const Com = (props) => {
  const { onEdit, data, kind } = props;

  const isNotMaster = kind !== "m";
  const isWindow = kind === "w" || kind === "m";
  const isDoor = kind === "d" || kind === "m";

  const isWindowOnly = kind === "w";
  const jisDoorOnly = kind === "d";

  const [treatedData, setTreatedData] = useState(null);

  useEffect(() => {
    if (data) {
      runTreatement(data);
    }
  }, [data]);

  const columns = [
    {
      title: "Work Order",
      dataIndex: "m_WorkOrderNo",
      key: "m_WorkOrderNo",
      fixed: "left",
      render: (record) => {
        return (
          <td onClick={() => onEdit(record)}>
            <div className={cn(styles.orderNumber)}>{record.m_WorkOrderNo}</div>
          </td>
        );
      },
    },
    {
      title: "Branch",
      dataIndex: "m_Branch",
      key: "m_Branch",
    },
    {
      title: "Job Type",
      dataIndex: "m_JobType",
      key: "m_JobType",
    },
    {
      title: "Window Batch No",
      dataIndex: "w_BatchNo",
      key: "w_BatchNo",
      display: isWindow,
    },
    {
      title: "Window Block No",
      dataIndex: "w_BlockNo",
      key: "w_BlockNo",
      display: isWindow,
    },
    {
      title: "Door Batch No",
      dataIndex: "d_BatchNo",
      key: "d_BatchNo",
      display: isDoor,
    },
    {
      title: "Door Block No",
      dataIndex: "d_BlockNo",
      key: "d_BlockNo",
      display: isDoor,
    },
    {
      title: "Current status",
      dataIndex: "m_Status_display",
      key: "m_Status_display",
      render: (record) => {
        return (
          <td
            style={{
              color: record.m_Status_display?.textColor,
              backgroundColor: record.m_Status_display?.color,
            }}
          >
            <LabelDisplay>{record.m_Status_display?.label}</LabelDisplay>
          </td>
        );
      },
    },
    {
      title: "Windows status",
      dataIndex: "w_Status_display",
      key: "w_Status_display",
      display: isWindow,
      render: (record) => {
        return (
          <td
            style={{
              color: record.w_Status_display?.textColor,
              backgroundColor: record.w_Status_display?.color,
            }}
          >
            <LabelDisplay>{record.w_Status_display?.label}</LabelDisplay>
          </td>
        );
      },
    },
    {
      title: "Doors status",
      dataIndex: "d_Status_display",
      key: "d_Status_display",
      display: isDoor,
      render: (record) => {
        return (
          <td
            style={{
              color: record.d_Status_display?.textColor,
              backgroundColor: record.d_Status_display?.color,
            }}
          >
            <LabelDisplay> {record.d_Status_display?.label}</LabelDisplay>
          </td>
        );
      },
    },
    {
      title: "Windows",
      dataIndex: "m_NumberOfWindows",
      key: "m_NumberOfWindows",
      display: isWindow,
      className: 'text-right'
    },
    {
      title: "Patio Doors",
      dataIndex: "m_NumberOfPatioDoors",
      key: "m_NumberOfPatioDoors",
      display: isWindow,
      className: 'text-right'
    },
    {
      title: "Doors",
      dataIndex: "m_NumberOfDoors",
      key: "m_NumberOfDoors",
      display: isDoor,
      className: 'text-right'
    },
    {
      title: "Others",
      dataIndex: "m_NumberOfOthers",
      key: "m_NumberOfOthers",
      className: 'text-right'
    },
    {
      title: "INV Status",
      dataIndex: "m_InvStatus",
      key: "m_InvStatus",
    },
    {
      title: "Created On",
      dataIndex: "m_CreatedAt_display",
      key: "m_CreatedAt_display",
    },
    {
      title: "Created By",
      dataIndex: "m_ChangedBy",
      key: "m_ChangedBy",
    },
    {
      title: "Customer Date",
      dataIndex: "m_CustomerDate_display",
      key: "m_CustomerDate_display",
    },
    {
      title: "Glass Ordered Date",
      dataIndex: "w_GlassOrderedDate_display",
      key: "w_GlassOrderedDate_display",
      display: isWindow,
    },
  ]?.filter((a) => a.display === undefined || a.display);

  const runTreatement = (data) => {
    let _data = JSON.parse(JSON.stringify(data));

    _data = _data?.map((a) => {
      if (!a) return null;
      const { value } = a;
      const merged = { ...value?.d, ...value?.m, ...value?.w };
      const {
        m_Status,
        w_Status,
        d_Status,
        m_BranchId,
        m_JobType,
        m_ShippingType,
        m_CreatedAt,
        m_CustomerDate,
        w_GlassOrderedDate,
      } = merged;

      merged.m_Status_display = ORDER_STATUS?.find(
        (a) => a.key.toString() === m_Status?.toString(),
      );
      merged.w_Status_display = ORDER_STATUS?.find(
        (a) => a.key.toString() === w_Status?.toString(),
      );
      merged.d_Status_display = ORDER_STATUS?.find(
        (a) => a.key.toString() === d_Status?.toString(),
      );

      merged.m_BranchId_display = getValue(m_BranchId, "branches")?.label;
      merged.m_JobType_display = getValue(m_JobType, "jobTypes")?.label;
      merged.m_ShippingType_display = getValue(
        m_ShippingType,
        "shippingTypes",
      )?.label;

      merged.m_CreatedAt_display = utils.formatDate(m_CreatedAt);
      merged.m_CustomerDate_display = utils.formatDate(m_CustomerDate);
      merged.w_GlassOrderedDate_display = utils.formatDate(w_GlassOrderedDate);

      return merged;
    });

    setTreatedData(_data);
  };

  return (
    <div className={cn("w-full", styles.root)}>
      <LoadingBlock isLoading={!data}>
        {/* <Table
          size="small"
          dataSource={treatedData}
          columns={columns}
          pagination={false}
          scroll={{ y: '100%' }} 
        /> */}
        <table
          className={cn(
            styles.orderTable,
            "table-sm table-bordered table-hover table border text-xs",
          )}
          style={{ minWidth: 1500 }}
        >
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              {columns?.map((a) => {
                const { title, key, dataIndex } = a;
                return <th key={key}>{title}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {treatedData?.map((a) => {
              const { m_MasterId } = a;

              return (
                <tr key={m_MasterId}>
                  {columns?.map((b) => {
                    const { key, dataIndex, render, className } = b;
                    if (typeof render === "function") {
                      return <React.Fragment>{render(a, b)}</React.Fragment>;
                    }
                    return <td className={className} key={key}><LabelDisplay>{a[dataIndex]}</LabelDisplay></td>;
                  })}
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
