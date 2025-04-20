import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import constants, {WORKORDER_MAPPING} from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";
// components

// import Search from "components/molecule/bak_Search";
import Framework from "components/organism/Framework";

import Panel_OrderManagement from "components/organism/Panel_OrderManagement";

// hooks
import useDataInit from "lib/hooks/useDataInit";

// styles
import styles from "./styles.module.scss";

const DEFAULT_SORT = (status) => {
  if (status === WORKORDER_MAPPING.Scheduled.key) {
    return [
      {
        field: "m_LastModifiedAt",
        isDescending: true,
      },
    ]; 
  }

  return [
    {
      field: "m_CreatedAt",
      isDescending: true,
    },
  ];
};

const Com = ({}) => {
  const router = useRouter();

  // ====== search
  const [filters, setFilters] = useState({});
  const [applyFilter, setApplyFilter] = useState(true);

  const {
    status,
    p = 0,
    facility,
    tab = "m",
    sort,
    isDeleted,
  } = router?.query || {};

  const filtersObj = {};
  const sortObj = {};
  let sortArr = [];

  if (facility) {
    filtersObj[tab + "_ManufacturingFacility"] = {
      operator: constants.FILTER_OPERATOR.Equals,
      value: facility,
    };
  }

  if (status) {
    filtersObj[tab + "_Status"] = {
      operator: constants.FILTER_OPERATOR.Equals,
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

  const conditions = [
    ..._.keys(filtersObj)?.map((k) => {
      return {
        ...filtersObj[k],
        field: k,
      };
    }),
    ..._.keys(applyFilter ? filters : {})?.map((k) => {
      return {
        operator: constants.FILTER_OPERATOR.Contains,
        value: filters[k],
        field: k,
      };
    }),
  ];

  const endPoint = OrdersApi.initQueryWorkOrderHeaderWithPrefixAsync(null, {
    page: (parseInt(p) || 0) + 1,
    pageSize: 50,
    filterGroup: conditions?.length
      ? {
          logicOp: "AND",
          conditions: conditions?.filter((a) => a.value),
        }
      : undefined,
    orderByItems: _.isEmpty(sortArr) ? DEFAULT_SORT(status) : sortArr,
    kind: tab,
    isActive: isDeleted ? 0 : 1,
  });

  // use swr
  const { data, error, mutate } = useDataInit(endPoint);

  const handleRefreshWorkOrderList = () => {
    mutate(null);
  };

  // ====== consts
  return (
    <Framework onRefresh={handleRefreshWorkOrderList}>
      <Panel_OrderManagement
        {...{
          filters,
          setFilters,
          applyFilter,
          setApplyFilter,
          data,
          error,
          mutate,
          sortObj,
        }}
      />
    </Framework>
  );
};

export default Com;
