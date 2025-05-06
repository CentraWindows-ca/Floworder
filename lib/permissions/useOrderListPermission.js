import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";
import constants, { FEATURE_CODES, WORKORDER_MAPPING } from "lib/constants";

const hook = () => {
  const { permissions } = useContext(GeneralContext);

  const applyPermissionsToExcludeStatuses = (conditions) => {
    let excludeStatuses = {};
    const newConditions = [];
    // not everyone able to see reservations
    const _allRsv = _.values(WORKORDER_MAPPING)
      .filter((v) => v.isReservation)
      ?.map((a) => a.key);

    // == able to see reservations
    if (FEATURE_CODES["om.prod.reservationList"]) {
      if (!permissions?.[FEATURE_CODES["om.prod.reservationList"]]?.canView) {
        excludeStatuses = {
          windowStatuses: _allRsv,
          doorStatuses: _allRsv,
        };
      }  
    }

    // == able to see SO
    if (FEATURE_CODES["om.prod.woList.so"]) {
      if (!permissions?.[FEATURE_CODES["om.prod.woList.so"]]?.canView) {
        newConditions.push({
          field: "m_JobType",
          operator: "NotEquals",
          value: "SO",
        });
      }
    }

    // == able to see SI
    if (FEATURE_CODES["om.prod.woList.si"]) {
      if (!permissions?.[FEATURE_CODES["om.prod.woList.si"]]?.canView) {
        newConditions.push({
          field: "m_JobType",
          operator: "NotEquals",
          value: "SI",
        });
      }
    }

    return {
      conditions: [...conditions, ...newConditions],
      excludeStatuses,
    };
  };

  return {
    applyPermissionsToExcludeStatuses,
  };
};

export default hook;
