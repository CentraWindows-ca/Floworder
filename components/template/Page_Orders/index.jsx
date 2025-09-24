import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import constants, { WORKORDER_STATUS_MAPPING } from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";
// components

// import Search from "components/molecule/bak_Search";
import Framework_Production from "components/organism/Framework_Production";

import Panel_Production from "components/organism/Panel_Production";

// hooks
import useDataInit from "lib/hooks/useDataInit";
import useOrderListPermission from "lib/permissions/useOrderListPermission";

// styles
import styles from "./styles.module.scss";

const DEFAULT_SORT = (status) => {
  if (status === WORKORDER_STATUS_MAPPING.Scheduled.key) {
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

  const { applyPermissionsToExcludeStatuses } = useOrderListPermission();

  // ====== search
  const [filters, setFilters] = useState({});
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [isEnableFilter, setIsEnableFilter] = useState(true);

  const {
    status: statusFromParam,
    p = 0,
    facility: facilityFromParam,
    tab = "m",
    sort,
    isDeleted,
  } = router?.query || {};

  const filtersObj = {};
  const sortObj = {};
  let sortArr = [];

  const status = statusFromParam === "All" ? "" : statusFromParam
  const facility = facilityFromParam === "All" ? "" : facilityFromParam

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

  /* 
    NOTE: filtersObj is from big buttons; filters is from table header
  */
  const _conditions = [
    ..._.keys(filtersObj)?.map((k) => {
      return {
        ...filtersObj[k],
        field: k,
      };
    }),
    ..._.keys(isEnableFilter ? filters : {})?.map((k) => {
      return {
        operator: filters[k]?.operator || constants.FILTER_OPERATOR.Contains,
        value: filters[k]?.value,
        field: k,
      };
    }),
  ];

  const {excludeStatuses, conditions} = applyPermissionsToExcludeStatuses(_conditions);

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
    excludeStatuses
  });

  // use swr
  const { data, error, mutate } = useDataInit(endPoint);

  const handleRefreshWorkOrderList = () => {
    mutate(null);
  };

  // ====== consts
  return (
    <Framework_Production onRefresh={handleRefreshWorkOrderList}>
      <Panel_Production
        {...{
          filters,
          setFilters,
          isEnableFilter,
          setIsEnableFilter,
          data,
          error,
          mutate,
          sortObj,
        }}
      />
    </Framework_Production>
  );
};

export default Com;
