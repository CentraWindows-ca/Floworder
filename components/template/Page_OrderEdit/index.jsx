import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import constants, { FACILITY_CODE_FROM_NAME, getStatusFieldByKind } from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";
// components

import Production_Modal_OrderEdit_Page from "components/organism/Production_Modal_OrderEdit/index_page";

const Com = (props) => {
  const router = useRouter();

  const {
    status: statusFromParam,
    facility: facilityFromParam,
    kind = "m",
    sort,
    masterId,
  } = router?.query || {};

  // const filtersObj = {};
  // const sortObj = {};
  // let sortArr = [];

  // const status = statusFromParam === "All" ? "" : statusFromParam;
  // const facility = facilityFromParam === "All" ? "" : facilityFromParam;

  // if (facility) {
  //   const facilityField = [kind, FACILITY_CODE_FROM_NAME[facility], "ManufacturingFacility"]?.filter(Boolean)?.join("_")
  //   filtersObj[facilityField] = {
  //     operator: constants.FILTER_OPERATOR.Equals,
  //     value: facility,
  //   };
  // }

  // if (status) {
  //   const statusField = getStatusFieldByKind(kind);
  //   filtersObj[statusField] = {
  //     operator: constants.FILTER_OPERATOR.Equals,
  //     value: status,
  //   };
  // }

  // if (sort) {
  //   sort?.split(",")?.map((sortKey) => {
  //     const [field, dir] = sortKey?.split(":");
  //     sortObj[field] = dir;
  //   });

  //   sortArr = _.keys(sortObj)?.map((k) => ({
  //     field: k,
  //     isDescending: sortObj[k]?.toLocaleLowerCase() === "desc",
  //   }));
  // }

  // ====== consts
  return (
    <Production_Modal_OrderEdit_Page
      {...props}
      initMasterId={masterId}
      initIsEditable={true}
      kind={kind}
    />
  );
};

export default Com;
