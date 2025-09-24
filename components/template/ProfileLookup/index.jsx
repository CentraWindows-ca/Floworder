import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import constants from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";
import Prod2FFApi from "lib/api/Prod2FFApi";

import Framework_ProfileLookup from "components/organism/Framework_ProfileLookup";
import Panel_ProfileLookup from "components/organism/Panel_ProfileLookup";

// hooks
import useDataInit from "lib/hooks/useDataInit";

const DEFAULT_SORT = [
  {
    field: "m_LastModifiedAt",
    isDescending: true,
  },
];

const Com = ({}) => {
  const router = useRouter();

  // ====== search
  const { q } = router?.query || {};

  const conditions = [
    {
      operator: constants.FILTER_OPERATOR.Contains,
      value: q,
      field: "m_WorkOrderNo",
    },
  ];

  const endPoint = q
    ? OrdersApi.initQueryWorkOrderHeaderWithPrefixAsync(null, {
        page: 0,
        pageSize: 0,
        filterGroup: conditions?.length
          ? {
              logicOp: "AND",
              conditions: conditions?.filter((a) => a.value),
            }
          : undefined,
        orderByItems: DEFAULT_SORT,
        kind: "m",
        isActive: 1,
      })
    : null;

  const endPointProfile = q
    ? Prod2FFApi.initGetOptimizedBarAsync({
        workOrderNo: q,
      })
    : null;

  // use swr
  const { data, error, mutate } = useDataInit(endPoint);
  const {
    data: dataProfile,
    errorProfile,
    mutate: mutateProfile,
  } = useDataInit(endPointProfile);

  const handleRefreshWorkOrderList = () => {
    mutate(null);
    mutateProfile(null);
  };

  // ====== consts
  return (
    <Framework_ProfileLookup onRefresh={handleRefreshWorkOrderList}>
      <Panel_ProfileLookup
        {...{
          data,
          dataProfile,
          onRefresh: handleRefreshWorkOrderList,
        }}
      />
    </Framework_ProfileLookup>
  );
};

export default Com;
