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

import TabLinksFull from "components/atom/TabLinksFull";
import SideMenu from "components/organism/SideMenu";

// styles
import styles from "./styles.module.scss";

const Com = ({children, onRefresh}) => {

  // ====== search
  const [drawerOpen, handleToggleDrawer] = useState(true);
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

  // ======
  const renderTool = () => {
    return (
      <div className="justify-content-between flex w-full gap-3">
        <div></div>
        <div className={cn(styles.manufacturingFacilityContainer)}>
          <RedoOutlined onClick={onRefresh} />
          <Tabs_ManufacturingFacility />
        </div>
        <div></div>
      </div>
    );
  };
  // ====== consts
  return (
    <div className={cn("w-full", styles.root)}>
      <InterruptModal>
        <Modal_StatusUpdate />
      </InterruptModal>
      <PageContainer>
        {/* layout of panels */}
        <div className={styles.mainContainer}>
          <div className={styles.tabContainer}>
            <TabLinksFull {...{ defaultTab, tabs, renderTool }} />
          </div>
          <div className={styles.twoColumns}>
            <div
              className={cn(
                styles.columnOfItems,
                styles[drawerOpen ? "drawerOpen" : "drawerClose"],
              )}
            >
              <div className={styles.toggleIcon}>
                <ToggleOfSidemenu {...{ drawerOpen, handleToggleDrawer }} />
              </div>
              <div className={styles.itemsDrawerContainer}>
                <div className={styles.itemsContainer}>
                  <div className={styles.itemsContainerTitle}>
                    <i className="fa-solid fa-list-check me-2"></i>Production
                    Status
                  </div>
                  <SideMenu />
                </div>
              </div>
            </div>
            <div className={styles.columnOfDetailPanel}>
              {children}

            </div>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

const ToggleOfSidemenu = ({ drawerOpen, handleToggleDrawer }) => {
  return (
    <Tooltip title={`${drawerOpen ? "Minimize" : "Expand"} Orders Menu`}>
      <Button
        className="z-10 mr-4 mt-1 w-[12px] rounded-full bg-white text-gray-600 hover:bg-blue-500 hover:text-red-400"
        onClick={() => handleToggleDrawer((prev) => !prev)}
      >
        <i
          className={cn(
            "fa-solid",
            drawerOpen ? "fa-chevron-left" : "fa-chevron-right",
          )}
        ></i>
      </Button>
    </Tooltip>
  );
};

export default Com;
