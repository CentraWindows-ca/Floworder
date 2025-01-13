import React from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

// components
import PageContainer from "components/atom/PageContainer";
import Search from "components/molecule/Search";
import Tabs_ManufacturingFacility from "components/molecule/Tabs_ManufacturingFacility";

import TabLinksFull from "components/atom/TabLinksFull";
import States from "components/organism/States";
import OrderManagementPanel from "components/organism/OrderManagementPanel";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const { basePath } = props || {};
  const router = useRouter();
  const defaultTab = "master";
  const tabs = [
    {
      eventKey: "master",
      title: "Master Orders",
    },
    {
      eventKey: "window",
      title: "Window Orders",
    },
    {
      eventKey: "door",
      title: "Door Orders",
    },
  ];

  const renderTool = () => {
    return (
      <div className="flex justify-content-between w-full gap-3">
        <div className={cn(styles.manufacturingFacilityContainer)}>
          <Tabs_ManufacturingFacility />
        </div>
        <div>
          <Search />
        </div>
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
            <TabLinksFull {...{ defaultTab, tabs, renderTool }}></TabLinksFull>
          </div>
          <div className={styles.twoColumns}>
            <div className={styles.columnOfItems}>
              <div className={styles.itemsContainer}>
                <States />
              </div>
            </div>
            <div className={styles.columnOfDetailPanel}>
              <OrderManagementPanel />
            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};
export default Com;
