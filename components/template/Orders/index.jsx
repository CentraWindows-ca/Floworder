import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { RedoOutlined } from "@ant-design/icons";
import { Button } from "antd";

import constants from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";
// components
import PageContainer from "components/atom/PageContainer";
// import Search from "components/molecule/bak_Search";
import Tabs_ManufacturingFacility from "components/molecule/Tabs_ManufacturingFacility";

import TabLinksFull from "components/atom/TabLinksFull";
import States from "components/organism/States";
import OrderManagementPanel from "components/organism/OrderManagementPanel";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";
import useDataInit from "lib/hooks/useDataInit";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const router = useRouter();

  // ====== search
  const [filters, setFilters] = useState({});
  const [applyFilter, setApplyFilter] = useState(true);
  const { status, q, p = 0, facility, tab = "m", sort } = router?.query || {};

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
  const sortObj = {};
  let sortArr = [];

  if (q) {
    filtersObj["m_WorkOrderNo"] = {
      operator: constants.FILTER_OPERATOR.Contains,
      value: q,
    };
  }

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

  const endPoint = OrdersApi.initQueryWorkOrderHeaderWithPrefixAsync({
    page: (parseInt(p) || 0) + 1,
    pageSize: 50,
    filterGroup: conditions?.length
      ? {
          logicOp: "AND",
          conditions: conditions?.filter((a) => a.value),
        }
      : undefined,
    orderByItems: sortArr,
    kind: tab,
  });

  // use swr
  const { data, error, mutate } = useDataInit(endPoint);

  const handleRefreshWorkOrderList = () => {
    mutate("*");
  };

  // ======
  const renderTool = () => {
    return (
      <div className="justify-content-between flex w-full gap-3">
        <div></div>
        <div className={cn(styles.manufacturingFacilityContainer)}>
          <RedoOutlined onClick={handleRefreshWorkOrderList} />
          <Tabs_ManufacturingFacility />
        </div>
        <div></div>
      </div>
    );
  };
  // ====== consts
  return (
    <div className={cn("w-full", styles.root)}>
      <PageContainer>
        {/* layout of panels */}
        <div className={styles.mainContainer}>
          <div className={styles.tabContainer}>
            <TabLinksFull {...{ defaultTab, tabs, renderTool }} />
          </div>
          <div className={styles.twoColumns}>
            <div className={styles.columnOfItems}>
              <div className={styles.itemsContainer}>
                <States />
              </div>
            </div>
            <div className={styles.columnOfDetailPanel}>
              <OrderManagementPanel
                {...{
                  filters,
                  setFilters,
                  applyFilter,
                  setApplyFilter,
                  data,
                  mutate,
                  sortObj,
                }}
              />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
export default Com;
