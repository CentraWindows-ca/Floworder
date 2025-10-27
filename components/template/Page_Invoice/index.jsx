import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import constants, { WORKORDER_STATUS_MAPPING } from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";
import InvoiceApi from "lib/api/InvoiceApi";

import Framework_Invoice from "components/organism/Invoice_Framework";
import Panel_Invoice from "components/organism/Invoice_Panel";

// hooks
import useDataInit from "lib/hooks/useDataInit";
import useOrderListPermission from "lib/permissions/useOrderListPermission";
import DUMMY from "./dummy";

// styles
import styles from "./styles.module.scss";

const DEFAULT_SORT = "createdAt";

const stripPrefix = (field) => {
  if (typeof field !== 'string') return field; // keep non-strings unchanged
  const i = field.indexOf('_');
  return i === -1 ? field : field.slice(i + 1);
};

const Com = ({}) => {
  const router = useRouter();

  // ====== search
  const [filters, setFilters] = useState({});
  const [isEnableFilter, setIsEnableFilter] = useState(true);

  const {
    status: statusFromParam,
    p = 0,
    sort,
    isDeleted,
  } = router?.query || {};

  const filtersObj = {...filters};
  const sortObj = {};
  let sortArr = [];

  const status = statusFromParam === "All" ? "" : statusFromParam;

  if (status) {
    filtersObj["invh_invoiceStatus"] = {
      operator: constants.VICTOR_FILTER_OPERATOR.Equals,
      value: status,
    };
  }

  if (sort) {
    sort?.split(",")?.map((sortKey) => {
      const [field, dir] = sortKey?.split(":");
      sortObj[field] = dir;
    });

    sortArr = _.keys(sortObj)?.map((k) => ({
      field: k,
      isDescending: sortObj[k]?.toLocaleLowerCase() === "desc",
    }));
  }

  // Victor convention (different from OM)
  const endPoint = InvoiceApi.initReadInvoicesByPage(null, {
    filters: !_.isEmpty(filtersObj) ? _.keys(filtersObj)?.map(k => {
      const {operator = constants.VICTOR_FILTER_OPERATOR.Contains, value} = filtersObj[k]

      /* 
        because its disassembled fields. need to remove prefix before search
        backend has its magic to find corresponding fields
      */

      const field = stripPrefix(k)
      return {
        field,
        operator,
        values: [value],
        logic: "AND"
      }
    }) : undefined,
    page: (parseInt(p) || 0) + 1,
    pageSize: 50,
    sortOrders: [{
      columnName: _.isEmpty(sortArr) ? DEFAULT_SORT : sortArr[0]?.field,
      descending: _.isEmpty(sortArr) ? true : sortArr[0]?.isDescending,
    }],
  });

  // use swr
  const { data, error, mutate } = useDataInit(endPoint);

  // ====== consts
  return (
    <Framework_Invoice>
      <Panel_Invoice
        {...{
          filters,
          setFilters,
          isEnableFilter,
          setIsEnableFilter,
          //data: { data: DUMMY },
          data: data?.data, 
          error,
          mutate,
          sortObj,
        }}
      />
    </Framework_Invoice>
  );
};

export default Com;
