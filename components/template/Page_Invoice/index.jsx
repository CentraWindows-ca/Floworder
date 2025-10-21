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

const Com = ({}) => {
  const router = useRouter();

  const { applyPermissionsToExcludeStatuses } = useOrderListPermission();

  // ====== search
  const [filters, setFilters] = useState({});
  const [isEnableFilter, setIsEnableFilter] = useState(true);

  const {
    status: statusFromParam,
    p = 0,
    facility: facilityFromParam,
    tab = "m",
    sort,
    isDeleted,
  } = router?.query || {};

  const filtersObj = {...filters};
  const sortObj = {};
  let sortArr = [];

  const status = statusFromParam === "All" ? "" : statusFromParam;

  if (status) {
    filtersObj["invoiceStatus"] = {
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
    filters: _.keys(filtersObj)?.map(k => {
      const {operator = constants.VICTOR_FILTER_OPERATOR.Contains, value} = filtersObj[k]
      return {
        field: k,
        operator,
        values: [value],
        logic: "AND"
      }
    }),
    // filters: [
    //   {
    //     field: "DisplayName",
    //     operator: "like",
    //     values: ["LO_10"],
    //     logic: "AND",
    //   },
    //   {
    //     field: "CustomerName",
    //     operator: "=",
    //     values: ["BROADVIEW"],
    //     logic: "AND",
    //   },
    // ],
    page: (parseInt(p) || 0) + 1,
    pageSize: 50,
    sortOrder: {
      columnName: _.isEmpty(sortArr) ? DEFAULT_SORT : sortArr[0]?.field,
      descending: _.isEmpty(sortArr) ? true : sortArr[0]?.isDescending,
    },
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
          data: data?.data, //: { data: DUMMY },
          error,
          mutate,
          sortObj,
        }}
      />
    </Framework_Invoice>
  );
};

export default Com;
