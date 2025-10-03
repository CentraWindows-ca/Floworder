import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import { format } from "date-fns";
import { GeneralContext } from "lib/provider/GeneralProvider";
import OrdersApi from "lib/api/OrdersApi";

import Editable from "components/molecule/Editable";

import LabelDisplay from "components/atom/LabelDisplay";
import Table_PrimaryList from "components/molecule/Table_PrimaryList"

// styles
import styles from "./styles.module.scss";
import Dropdown_WorkOrderActions from "./Dropdown_WorkOrderActions";
import constants, {
  WorkOrderSelectOptions,
  ORDER_STATUS,
  WORKORDER_STATUS_MAPPING,
} from "lib/constants";
import {labelMapping, applyField} from "lib/constants/production_constants_labelMapping";

import utils from "lib/utils";

import { COLUMN_SEQUENCE_FOR_STATUS } from "./_constants";

const getValue = (k, arrName) => {
  const arr = WorkOrderSelectOptions[arrName];
  return arr.find((a) => a.key === k);
};

const today = format(new Date(), "yyyy-MM-dd");

const Com = (props) => {
  const {
    onEdit,
    onEditPending,
    onView,
    onUpdate,
    onHistory,
    data,
    error,
    kind,
    uiIsShowWindow,
    uiIsShowDoor,
    uiIsShowBreakdown,
    filters,
    setFilters,
    isEnableFilter,
    onEnableFilter,
    sort,
    setSort,
    isLoading,
    status,
    isDeleted,
  } = props;

  const { toast } = useContext(GeneralContext);

  const isWindow = kind === "w" || (kind === "m" && uiIsShowWindow);
  const isDoor = kind === "d" || (kind === "m" && uiIsShowDoor);
  const isMasterOnly = uiIsShowWindow && uiIsShowDoor;
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
          autoClose: 500
        },
      );
    } catch (err) {}
  };

  const isPending = status === WORKORDER_STATUS_MAPPING.Pending.key;

  const COLUMN_PRODUCT_NUMBERS = !uiIsShowBreakdown
    ? [
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
          title: "Swing Doors",
          key: "m_NumberOfSwingDoors",
          display: isWindow,
          className: "text-right",
          width: 135,
        },
        {
          title: "Exterior Doors",
          key: "m_NumberOfDoors",
          display: isDoor,
          className: "text-right",
          width: 135,
        },
        {
          title: "Others",
          key: "m_NumberOfOthers",
          className: "text-right",
          display: isMasterOnly,
          width: 80,
        },
      ]
    : [];

  const _breakdownbackground = () => ({
    style: { backgroundColor: "#F0F0F0" },
  });
  const COLUMN_PRODUCT_NUMBERS_BREAKDOWN = uiIsShowBreakdown
    ? [
        {
          key: "w__26CA",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__26HY",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__27DS",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__29CA",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__29CM",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__52PD",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__61DR",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__68CA",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__68SL",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__68VS",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__88SL",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "w__88VS",
          display: isWindow,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "d__REDR",
          display: isDoor,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "d__CDLD",
          display: isDoor,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          key: "d__RESD",
          display: isDoor,
          onCell: _breakdownbackground,
          className: "text-right",
          width: 80,
        },
        {
          title: "Others",
          key: "m_NumberOfOthers",
          className: "text-right",
          display: isMasterOnly,
          onCell: _breakdownbackground,
          width: 80,
        },
      ]
    : [];

  const columns = applyField(
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
                  onEdit: () => onEdit(record?.m_MasterId),
                  onEditPending: () => onEditPending(record?.m_MasterId),
                  onView: () => onView(record?.m_MasterId),
                  onHistory: () => onHistory(record?.m_MasterId),
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

      // ========= status ========
      {
        key: "m_InstallStatus",
        initKey: "m_InstallStatus",
        display: !isDeleted,
        isNotSortable: true,
        isNotFilter: true,
        width: 180,
      },
      {
        key: "m_RebateIcon",
        initKey: "m_RebateIcon",
        display: !isDeleted,
        isNotSortable: true,
        isNotFilter: true,
        width: 80,
      },
      {
        key: "m_TypeofGrant",
        initKey: "m_TypeofGrant",
        display: !isDeleted,
        isNotSortable: true,
        isNotFilter: true,
        width: 130,
      },
      {
        key: "m_GrantStatus",
        initKey: "m_GrantStatus",
        display: !isDeleted,
        isNotSortable: true,
        isNotFilter: true,
        width: 120,
      },
      {
        key: "m_GovGrantExpiryDate_display",
        initKey: "m_GovGrantExpiryDate_display",
        display: !isDeleted,
        isNotSortable: true,
        isNotFilter: true,
        width: 195,
      },
      {
        key: "m_Status_display",
        initKey: "m_Status",
        display: !isDeleted,
        onCell: (record) => ({
          style: {
            position: "relative",
            padding: 0,
          },
        }),
        width: 180,
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
        display: isWindow && !isDeleted,
        width: 180,
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
        display: isDoor && !isDeleted,
        width: 180,
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
        display: !isDeleted,
      },
      // ========= status ========

      // ========= addon ========
      {
        key: "m_AddOnsCount",
        width: 100,
        display: !constants.DEV_HOLDING_FEATURES.v20250815_addon,
        renderFilter: ({ key }) => {
          return (
            <div className="w-full text-center">
              <Editable.EF_Checkbox
                {...{
                  id: key,
                  value: !!filters?.[key]?.field,
                  onChange: (v) => {
                    setFilters((prev) => {
                      const _v = JSON.parse(JSON.stringify(prev)) || {};
                      if (v) {
                        _v[key] = {
                          operator: "GreaterOrEqual",
                          value: "1",
                          field: key,
                        };
                      } else {
                        delete _v[key];
                      }

                      return _v;
                    });
                  },
                }}
              />
            </div>
          );
        },
      },
      // ========= addon ========
      {
        key: "m_ShippingStartDate",
      },
      {
        key: "m_TransferredDate",
      },
      {
        key: "m_ShippedDate",
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
        key: "w_ProductionStartDate",
        display: isWindow,
      },
      {
        key: "d_ProductionStartDate",
        display: isDoor,
      },
      {
        title: "Window Production Date",
        key: "w_ProductionStartDate_colored",
        width: 210,
        display: isWindow,
        onCell: (record) => {
          if (record?.w_ProductionStartDate < today) {
            return {
              style: {
                color: "red",
              },
            };
          }
        },
      },
      {
        title: "Door Production Date",
        key: "d_ProductionStartDate_colored",
        width: 210,
        display: isDoor,
        onCell: (record) => {
          if (record?.d_ProductionStartDate < today) {
            return {
              style: {
                color: "red",
              },
            };
          }
        },
      },
      ...COLUMN_PRODUCT_NUMBERS,
      ...COLUMN_PRODUCT_NUMBERS_BREAKDOWN,
      {
        key: "m_TotalLBRMin",
        className: "text-right",
        width: 100,
      },
      {
        key: "w_BatchNo",
        display: isWindow,
        width: 145,
        display: isWindow,
      },
      {
        key: "w_BlockNo",
        display: isWindow,
        width: 145,
        display: isWindow,
      },
      {
        key: "d_BatchNo",
        display: isDoor,
        width: 125,
        display: isDoor,
      },
      {
        key: "d_BlockNo",
        display: isDoor,
        width: 125,
        display: isDoor,
      },

      {
        key: "m_InvStatus",
        width: 105,
      },
      {
        key: "m_CreatedAt_display",
        initKey: "m_CreatedAt",
        width: 125,
      },
      {
        key: "m_CreatedBy",
      },
      {
        key: "m_LastModifiedAt_display",
        initKey: "m_LastModifiedAt",
        width: 125,
      },
      {
        key: "m_LastModifiedBy",
      },
      {
        title: "Windows Customer Date",
        key: "w_CustomerDate_display",
        initKey: "w_CustomerDate",
        width: 200,
        display: isWindow,
      },
      {
        title: "Doors Customer Date",
        key: "d_CustomerDate_display",
        initKey: "d_CustomerDate",
        width: 195,
        display: isDoor,
      },
      {
        key: "m_CustomerName",
      },
      {
        key: "m_ProjectName",
        width: 200,
      },
      {
        key: "m_ProjectManagerName",
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

  const runTreatement = async (data) => {
    let _data = JSON.parse(JSON.stringify(data));

    let resInstallStatusMapping = {};
    // if its pending, get install status
    if (isPending && !_.isEmpty(_data)) {
      try {
        resInstallStatusMapping =
          await OrdersApi.getWorkOrdersInstallationInfoAsync(null, {
            workOrderNoList: _data?.map(
              (data) => data?.value?.m?.m_WorkOrderNo,
            ),
          });
      } catch (error) {
        console.log("error when catching intallation status", error);
      }
    }

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
        m_LastModifiedAt,
        m_CustomerDate,
        w_GlassOrderDate,
        w_CustomerDate,
        d_CustomerDate,
        w_ProductionStartDate,
        d_ProductionStartDate,
      } = merged;

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
      merged.m_LastModifiedAt_display = utils.formatDate(m_LastModifiedAt);

      merged.m_CustomerDate_display = m_CustomerDate;

      merged.w_CustomerDate_display = w_CustomerDate;
      merged.d_CustomerDate_display = d_CustomerDate;

      merged.w_ProductionStartDate_colored = w_ProductionStartDate;
      merged.d_ProductionStartDate_colored = d_ProductionStartDate;

      merged.m_InstallStatus =
        resInstallStatusMapping?.[merged.m_WorkOrderNo]?.currentStateName ||
        null;

      merged.m_RebateIcon =
        resInstallStatusMapping?.[merged.m_WorkOrderNo]?.rebateIcon || null;

      merged.m_TypeofGrant =
        resInstallStatusMapping?.[merged.m_WorkOrderNo]?.typeofGrant || null;

      merged.m_GrantStatus =
        resInstallStatusMapping?.[merged.m_WorkOrderNo]?.grantStatus || null;

      merged.m_GovGrantExpiryDate =
        resInstallStatusMapping?.[merged.m_WorkOrderNo]?.govGrantExpiryDate ||
        null;

      merged.m_GovGrantExpiryDate_display = merged.m_GovGrantExpiryDate;

      return merged;
    });

    setTreatedData(_data);
  };

  return (
    <Table_PrimaryList
      {...{
        error,
        isLoading,
        data: treatedData,
        filters,
        isEnableFilter,
        setFilters,
        columns: COLUMN_SEQUENCE_FOR_STATUS(status, columns),
        sort,
        setSort,
        onEnableFilter,
      }}
    />
  );
};

export default Com;
