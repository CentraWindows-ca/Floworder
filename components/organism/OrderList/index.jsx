import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";
import { Spin } from "antd";

import TableSortable from "components/atom/TableSortable";
import FiltersManager from "components/atom/TableSortable/FilterManager";

import LabelDisplay from "components/atom/LabelDisplay";
import constants from "lib/constants";

// styles
import styles from "./styles.module.scss";
import Dropdown_WorkOrderActions from "./Dropdown_WorkOrderActions";
import {
  WorkOrderSelectOptions,
  ORDER_STATUS,
  WORKORDER_MAPPING,
} from "lib/constants";
import utils from "lib/utils";

const getValue = (k, arrName) => {
  const arr = WorkOrderSelectOptions[arrName];
  return arr.find((a) => a.key === k);
};

const Com = (props) => {
  const {
    onEdit,
    onView,
    onUpdate,
    onHistory,
    data,
    kind,
    uiIsShowWindow,
    uiIsShowDoor,
    filters,
    setFilters,
    applyFilter,
    onApplyFilter,
    sort,
    setSort,
    isLoading,
    status,
    isDeleted,
  } = props;

  const { toast } = useContext(GeneralContext);

  const isWindow = kind === "w" || (kind === "m" && uiIsShowWindow);
  const isDoor = kind === "d" || (kind === "m" && uiIsShowDoor);

  const [treatedData, setTreatedData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (data) {
      runTreatement(data);
    }
  }, [data]);

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(text);
      toast(
        <div>
          <b>{text}</b> Copied To Clipboard
        </div>,
        {
          type: "info",
        },
      );
    } catch (err) {}
  };

  const isPending = status === WORKORDER_MAPPING.Pending.key;
  const columns = constants.applyField(
    [
      {
        key: "m_WorkOrderNo",
        fixed: "left",
        render: (text, record) => {
          return (
            <div className={cn(styles.orderNumber)}>
              <Dropdown_WorkOrderActions
                data={record}
                {...{
                  onEdit: () => onEdit(record?.m_WorkOrderNo),
                  onView: () => onView(record?.m_WorkOrderNo),
                  onHistory: () => onHistory(record?.m_WorkOrderNo),
                  onUpdate,
                  kind,
                }}
              />

              {copied === record?.m_WorkOrderNo ? (
                <i
                  title="copy work order number"
                  className={cn("fa-solid fa-check ms-1", styles.notCopiedIcon)}
                />
              ) : (
                <i
                  title="copy work order number"
                  className={cn("fa-solid fa-copy ms-1", styles.copiedIcon)}
                  onClick={() => copyToClipboard(record?.m_WorkOrderNo)}
                />
              )}
            </div>
          );
        },
        width: 115,
      },
      {
        title: "Created On",
        key: "m_CreatedAt_display",
        display: isPending,
        initKey: "m_CreatedAt",
        width: 125,
      },
      {
        key: "m_CreatedBy",
        display: isPending,
      },
      {
        key: "m_Status_display",
        initKey: "m_Status",
        display: !isPending && !isDeleted,
        onCell: (record) => ({
          style: {
            position: "relative",
            padding: 0,
          },
        }),
        onWrapper: () => ({
          className: styles.tableStatusBlock,
        }),
        render: (text, record) => {
          return (
            <div
              className={cn(styles.tableStatusColor)}
              style={{
                color: record?.m_Status_display?.textColor,
                backgroundColor: record?.m_Status_display?.color,
              }}
            >
              <LabelDisplay>{record?.m_Status_display?.label}</LabelDisplay>
            </div>
          );
        },
      },
      {
        key: "w_Status_display",
        initKey: "w_Status",
        display: isWindow && !isPending && !isDeleted,
        onCell: (record) => ({
          style: {
            position: "relative",
            padding: 0,
          },
        }),
        onWrapper: () => ({
          className: styles.tableStatusBlock,
        }),
        render: (text, record) => {
          return (
            <div
              className={cn(styles.tableStatusColor)}
              style={{
                color: record?.w_Status_display?.textColor,
                backgroundColor: record?.w_Status_display?.color,
              }}
            >
              <LabelDisplay>{record?.w_Status_display?.label}</LabelDisplay>
            </div>
          );
        },
      },
      {
        key: "d_Status_display",
        initKey: "d_Status",
        display: isDoor && !isPending && !isDeleted,
        onCell: (record) => ({
          style: {
            position: "relative",
            padding: 0,
          },
        }),
        onWrapper: () => ({
          className: styles.tableStatusBlock,
        }),
        render: (text, record) => {
          return (
            <div
              className={cn(styles.tableStatusColor)}
              style={{
                color: record?.d_Status_display?.textColor,
                backgroundColor: record?.d_Status_display?.color,
              }}
            >
              <LabelDisplay>{record?.d_Status_display?.label}</LabelDisplay>
            </div>
          );
        },
      },
      {
        key: "m_FormStatus",
        display: isPending && !isDeleted,
      },
      {
        key: "m_Branch",
        width: 80,
      },
      {
        key: "m_JobType",
        width: 95,
      },
      {
        title: "Windows",
        key: "m_NumberOfWindows",
        display: isWindow,
        className: "text-right",
        width: 95,
      },
      {
        title: "Patio Doors",
        key: "m_NumberOfPatioDoors",
        display: isWindow,
        className: "text-right",
        width: 115,
      },
      {
        title: "Exterior Doors",
        key: "m_NumberOfDoors",
        display: isDoor,
        className: "text-right",
        width: 135,
      },
      {
        title: "Swing Doors",
        key: "m_NumberOfSwingDoors",
        display: isDoor,
        className: "text-right",
        width: 135,
      },
      {
        title: "Others",
        key: "m_NumberOfOthers",
        className: "text-right",
        width: 80,
      },
      {
        key: "w_BatchNo",
        display: isWindow,
        width: 140,
        display: !isPending,
      },
      {
        key: "w_BlockNo",
        display: isWindow,
        width: 140,
        display: !isPending,
      },
      {
        key: "d_BatchNo",
        display: isDoor,
        width: 120,
        display: !isPending,
      },
      {
        key: "d_BlockNo",
        display: isDoor,
        width: 120,
        display: !isPending,
      },
     
      {
        key: "m_InvStatus",
        width: 105,
        display: !isPending,
      },
      {
        title: "Created On",
        key: "m_CreatedAt_display",
        display: !isPending,
        initKey: "m_CreatedAt",
        width: 125,
      },
      {
        key: "m_CreatedBy",
        display: !isPending,
      },
      {
        title: "Window Customer Date",
        key: "w_CustomerDate_display",
        initKey: "w_CustomerDate",
        width: 195,
        display: isWindow,
      },
      {
        title: "Door Customer Date",
        key: "d_CustomerDate_display",
        initKey: "w_CustomerDate",
        width: 195,
        display: isDoor,
      },
      // NOTE: it should generated data and it should be multiple lines
      // {
      //   title: "Glass Ordered Date",
      //   key: "w_GlassOrderDate_display",
      //   initKey: "w_GlassOrderDate",
      //   display: isWindow,
      //   minWidth: 50,
      // },
    ]?.filter((a) => a.display === undefined || a.display),
  );

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
        w_GlassOrderDate,
        w_CustomerDate,
        d_CustomerDate,
      } = merged;

      console.log();

      merged.m_Status_display = m_Status
        ? ORDER_STATUS?.find((a) => a.key.toString() === m_Status?.toString())
        : null;
      merged.w_Status_display = w_Status
        ? ORDER_STATUS?.find((a) => a.key.toString() === w_Status?.toString())
        : null;
      merged.d_Status_display = d_Status
        ? ORDER_STATUS?.find((a) => a.key.toString() === d_Status?.toString())
        : null;

      merged.m_BranchId_display = getValue(m_BranchId, "branches")?.label;
      merged.m_JobType_display = getValue(m_JobType, "jobTypes")?.label;
      merged.m_ShippingType_display = getValue(
        m_ShippingType,
        "shippingTypes",
      )?.label;

      merged.m_CreatedAt_display = utils.formatDate(m_CreatedAt);
      merged.m_CustomerDate_display = utils.formatDate(m_CustomerDate);

      merged.w_CustomerDate_display = utils.formatDate(w_CustomerDate);
      merged.d_CustomerDate_display = utils.formatDate(d_CustomerDate);

      // merged.w_GlassOrderDate_display = utils.formatDate(w_GlassOrderDate);

      return merged;
    });

    setTreatedData(_data);
  };

  return (
    <>
      {isLoading && (
        <div className={cn(styles.tableLoading)}>
          <Spin spinning={true} size="large">
            <div>Content that is loading...</div>
          </Spin>
        </div>
      )}
      <TableSortable
        {...{
          data: treatedData,
          filters,
          applyFilter,
          setFilters,
          columns,
          sort,
          setSort,
          className: styles.table,
        }}
      />
      <FiltersManager
        {...{
          columns,
          filters,
          applyFilter,
          onApplyFilter,
          setFilters,
        }}
      />
    </>
  );
};

/* <TableFullHeight
          size="small"
          dataSource={treatedData}
          columns={columns}
          pagination={false}
          className={cn(styles.orderTable)}
          components={{
            header: {
              wrapper: (props) => (
                <thead {...props}>
                  {props.children}
                  <CustomHeader />
                </thead>
              ),
            },
          }}
        />  */
export default Com;
