import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import { format } from "date-fns";
import { GeneralContext } from "lib/provider/GeneralProvider";
import OrdersApi from "lib/api/OrdersApi";

import Editable from "components/molecule/Editable";

import LabelDisplay from "components/atom/LabelDisplay";
import Table_PrimaryList from "components/molecule/Table_PrimaryList";

// styles
import styles from "./styles.module.scss";
import Dropdown_WorkOrderActions from "./Dropdown_WorkOrderActions";
import constants, {
  ORDER_STATUS,
  INVOICE_STATUS_MAPPING,
  WORKORDER_STATUS_MAPPING,
} from "lib/constants";
import { applyField } from "lib/constants/invoice_constants_labelMapping";

import utils from "lib/utils";

import { COLUMN_SEQUENCE_FOR_STATUS } from "./_constants";

const today = format(new Date(), "yyyy-MM-dd");

const Com = (props) => {
  const {
    onEdit,
    onUpdate,
    onHistory,
    data,
    error,
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
          autoClose: 500,
        },
      );
    } catch (err) {}
  };

  const columns = applyField(
    [
      {
        key: "invoiceId",
        fixed: "left",
        render: (text, record) => {
          return (
            <div className={cn(styles.orderNumber)}>
              <Dropdown_WorkOrderActions
                data={record}
                {...{
                  onEdit: () => onEdit(record?.invoiceId),
                  onHistory: () => onHistory(record?.invoiceId),
                  onUpdate,
                }}
              />
              {copied === record?.invoiceId ? (
                <i
                  title="copy invoice number"
                  className={cn("fa-solid fa-check ms-1", styles.notCopiedIcon)}
                />
              ) : (
                <i
                  title="copy invoice number"
                  className={cn("fa-solid fa-copy ms-1", styles.copiedIcon)}
                  onClick={() => copyToClipboard(record?.invoiceId)}
                />
              )}
            </div>
          );
        },
      },
      {
        key: "workOrderNo",
      },
      // ========= status ========
      {
        key: "invoiceStatus_display",
        title: "Invoice Status",
        initKey: "invoiceStatus",
        display: !isDeleted,
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
                color: record?.invoiceStatus_display?.textColor,
                backgroundColor: record?.invoiceStatus_display?.color,
              }}
            >
              <LabelDisplay>
                {record?.invoiceStatus_display?.label}
              </LabelDisplay>
            </div>
          );
        },
      },
      {
        key: "customerName",
      },
      {
        key: "branch",
      },
      {
        key: "email",
      },
      {
        key: "phoneNumber",
      },
      {
        key: "address",
      },
      {
        key: "city",
      },
      {
        key: "completeDate_display",
        title: "Complete Date",
        initKey: "completeDate",
        width: 145,
      },  
      {
        key: "invoiceAmount",
        className: "text-right",
      },
      {
        key: "salesRep",
      },
      {
        key: "createdAt_display",
        title: "Created At",
        initKey: "createdAt",
        width: 145,
      },
      {
        key: "lastModifiedBy",
      },
    ]?.filter((a) => a.display === undefined || a.display),
  );

  const runTreatement = async (data) => {
    let _data = JSON.parse(JSON.stringify(data));

    _data = _data?.map((a) => {
      if (!a) return null;
      const merged = { ...a };
      const { invoiceStatus, createdAt, completeDate, orderObj } = a;
      const { WOStatus, WorkOrderNo } = orderObj || {};

      const orderStatusList = _.values(ORDER_STATUS);
      merged.m_Status_display = WOStatus
        ? orderStatusList?.find(
            (a) => a.key.toString() === WOStatus?.toString(),
          )
        : null;

      const invoiceStatusList = _.values(INVOICE_STATUS_MAPPING);

   
      merged.invoiceStatus_display = invoiceStatus
        ? invoiceStatusList?.find(
            (a) => a.key.toString() === invoiceStatus?.toString(),
          )
        : null;

      merged.createdAt_display = utils.formatDate(createdAt);
      merged.completeDate_display = utils.formatDate(completeDate);

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
        keyField: "tmp_invoiceNumber",
      }}
    />
  );
};

export default Com;
