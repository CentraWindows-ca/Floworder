import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { RedoOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Tooltip from "components/atom/Tooltip";

import constants from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";
import Prod2FFApi from "lib/api/Prod2FFApi";
// components
import PageContainer from "components/atom/PageContainer";
// import Search from "components/molecule/bak_Search";
import Tabs_ManufacturingFacility from "components/molecule/Tabs_ManufacturingFacility";
import { InterruptModal } from "lib/provider/InterruptProvider/InterruptModal";
import Modal_StatusUpdate from "components/organism/Modal_StatusUpdate";

import Framework from "components/organism/Framework";
import TabLinksFull from "components/atom/TabLinksFull";
import SideMenu from "components/organism/SideMenu";
import Panel_ProfileLookup from "components/organism/Panel_ProfileLookup";

// hooks
import useDataInit from "lib/hooks/useDataInit";

// styles
import styles from "./styles.module.scss";
import useLoadingBar from "lib/hooks/useLoadingBar";

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
    <Framework onRefresh={handleRefreshWorkOrderList}>
      <Panel_ProfileLookup
        {...{
          data,
          dataProfile,
          onRefresh: handleRefreshWorkOrderList,
        }}
      />
    </Framework>
  );
};

export default Com;
