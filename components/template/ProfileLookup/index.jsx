import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { RedoOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Tooltip from "components/atom/Tooltip";

import constants from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";
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

const DEFAULT_SORT = [
  {
    field: "m_LastModifiedAt",
    isDescending: true,
  },
];

const Com = ({}) => {
  const router = useRouter();

  // ====== search
  const [filters, setFilters] = useState({});
  const [applyFilter, setApplyFilter] = useState(true);

  const { q, p = 0 } = router?.query || {};

  const defaultTab = "m";
  const tabs = [
    {
      eventKey: "m",
      title: "Master Orders",
    },
    {
      eventKey: "w",
      title: "Window Orders",
    },
    {
      eventKey: "d",
      title: "Door Orders",
    },
  ];

  const filtersObj = {};
  let sortArr = [];

  const conditions = [
    {
      operator: constants.FILTER_OPERATOR.Contains,
      value: q,
      field: "m_WorkOrderNo",
    },
  ];

  const endPoint = OrdersApi.initQueryWorkOrderHeaderWithPrefixAsync(
    q
      ? {
          page: (parseInt(p) || 0) + 1,
          pageSize: 50,
          filterGroup: conditions?.length
            ? {
                logicOp: "AND",
                conditions: conditions?.filter((a) => a.value),
              }
            : undefined,
          orderByItems: DEFAULT_SORT,
          kind: "m",
          isActive: 1,
        }
      : null,
  );

  const endPointProfile = null

  // use swr
  const { data, error, mutate } = useDataInit(endPoint);
  const { dataProfile, errorProfile, mutateProfile } = useDataInit(endPointProfile);
  

  const handleRefreshWorkOrderList = () => {
    mutate(null);
    mutateProfile(null)
  };

  // ====== consts
  return (
    <Framework onRefresh={handleRefreshWorkOrderList}>
      <Panel_ProfileLookup
        {...{
          data,
          dataProfile,
        }}
      />
    </Framework>
  );
};

export default Com;
