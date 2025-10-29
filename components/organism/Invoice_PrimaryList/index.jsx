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
        key: "inv_invoiceId",
        title: "Invoice Id",
        fixed: "left",
        render: (text, record) => {
          return (
            <div className={cn(styles.orderNumber)}>
              <Dropdown_WorkOrderActions
                data={record}
                {...{
                  onEdit: () => onEdit(record?.inv_invoiceId),
                  onHistory: () => onHistory(record?.inv_invoiceId),
                  onUpdate,
                }}
              />
              {copied === record?.inv_invoiceId ? (
                <i
                  title="copy invoice number"
                  className={cn("fa-solid fa-check ms-1", styles.notCopiedIcon)}
                />
              ) : (
                <i
                  title="copy invoice number"
                  className={cn("fa-solid fa-copy ms-1", styles.copiedIcon)}
                  onClick={() => copyToClipboard(record?.invoiceHeaderId)}
                />
              )}
            </div>
          );
        },
      },
      {
        key: "inv_workOrderNo",
        title: "Work Order#",
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
        key: "m_CustomerName",
        title: "Customer Name",
      },
      {
        key: "m_Branch",
        title: "Branch",
      },
      {
        key: "m_Email",
        title: "Email",
      },
      {
        key: "m_PhoneNumber",
        title: "Phone",
      },
      {
        key: "m_Address",
        title: "Address",
      },
      {
        key: "m_City",
        title: "City"
      },
      {
        key: "completeDate_display",
        title: "Actual Shipped Date",
        initKey: "completeDate",
        width: 170,
      },
      {
        key: "invoiceAmount_display",
        title: "Invoice Amount",
        className: "text-right",
      },
      {
        key: "m_SalesRep",
        title: "Sales Rep",
      },
      {
        key: "createdAt_display",
        title: "Created",
        initKey: "createdAt",
        width: 145,
      },
      {
        key: "invh_lastModifiedBy",
        title: "Modified By",
      },
    ]?.filter((a) => a.display === undefined || a.display),
  );

  const runTreatement = async (data) => {
    let _data = JSON.parse(JSON.stringify(data));

    _data = _data?.map((a) => {
      if (!a) return null;
      const merged = { ...a };
      const { invh_invoiceStatus, invh_createdAt, m_InvoiceAmount, m_CompleteDate, m_WOStatus } = a;

      const orderStatusList = _.values(ORDER_STATUS);
      merged.m_Status_display = m_WOStatus
        ? orderStatusList?.find(
            (a) => a.key.toString() === m_WOStatus?.toString(),
          )
        : null;

      const invoiceStatusList = _.values(INVOICE_STATUS_MAPPING);

      merged.invoiceStatus_display = invh_invoiceStatus
        ? invoiceStatusList?.find(
            (a) => a.key.toString() === invh_invoiceStatus?.toString(),
          )
        : null;
      merged.invoiceAmount_display = utils.formatCurrency2Decimal(m_InvoiceAmount)

      merged.createdAt_display = utils.formatDate(invh_createdAt);
      merged.completeDate_display = utils.formatDateForMorganLegacy(m_CompleteDate);

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
