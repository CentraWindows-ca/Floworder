import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import constants, { WORKORDER_MAPPING } from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";

import Framework_Invoice from "components/organism/Framework_Invoice";

// hooks
import useDataInit from "lib/hooks/useDataInit";
import useOrderListPermission from "lib/permissions/useOrderListPermission";

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

  const endPoint = ''
  // use swr
  const { data, error, mutate } = useDataInit(endPoint);

  const handleRefresh = () => {
    mutate(null);
  };

  // ====== consts
  return (
    <Framework_Invoice onRefresh={handleRefresh}>
      hi this is invoice
    </Framework_Invoice>
  );
};

export default Com;
