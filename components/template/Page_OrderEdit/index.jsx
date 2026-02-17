import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import constants, { WORKORDER_STATUS_MAPPING } from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";
// components

import Production_Modal_OrderEdit_Page from "components/organism/Production_Modal_OrderEdit/index_page";

const Com = (props) => {
  const router = useRouter();

  const {
    status: statusFromParam,
    facility: facilityFromParam,
    tab = "m",
    sort,
    masterId,
  } = router?.query || {};

  const filtersObj = {};
  const sortObj = {};
  let sortArr = [];

  const status = statusFromParam === "All" ? "" : statusFromParam;
  const facility = facilityFromParam === "All" ? "" : facilityFromParam;

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

  // ====== consts
  return (
    <Production_Modal_OrderEdit_Page
      {...props}
      initMasterId={masterId}
      initIsEditable={true}
      kind={tab}
    />
  );
};

export default Com;
