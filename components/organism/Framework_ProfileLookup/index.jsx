import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { RedoOutlined } from "@ant-design/icons";
import { Button } from "antd";
import Tooltip from "components/atom/Tooltip";

import constants from "lib/constants";

// components
import PageContainer from "components/atom/PageContainer";
// import Search from "components/molecule/bak_Search";
import Tabs_ManufacturingFacility from "components/molecule/Tabs_ManufacturingFacility";
import { InterruptModal } from "lib/provider/InterruptProvider/InterruptModal";
import Modal_OrderStatusUpdate from "components/organism/Modal_OrderStatusUpdate";
import Framework from "components/molecule/Framework";

import TabLinksFull from "components/atom/TabLinksFull";
import SideMenu_Production from "components/organism/SideMenu_Production";

// styles
import styles from "./styles.module.scss";

const Com = ({ children, onRefresh }) => {
  const router = useRouter();
  const tab = router?.query?.["tab"] || "m";
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
      title: "Windows Orders",
    },
    {
      eventKey: "d",
      title: "Doors Orders",
    },
  ];

  // ======
  const renderTool = () => {
    return (
      <div className="justify-content-between flex w-full gap-3">
        <div></div>
        <div className={cn(styles.manufacturingFacilityContainer)}>
          <RedoOutlined onClick={onRefresh} />
          <Tabs_ManufacturingFacility disabled={tab === "m"} />
        </div>
        <div></div>
      </div>
    );
  };

  // ====== consts

  return (
    <Framework
      jsxSideMenu={
        <div className={styles.itemsContainer}>
          <div className={styles.itemsContainerTitle}>
            <i className="fa-solid fa-list-check me-2"></i>Production Status
          </div>
          <SideMenu_Production shallow={false} />
        </div>
      }
      className={styles.root}
    >
      <InterruptModal>
        <Modal_OrderStatusUpdate />
      </InterruptModal>
      {children}
    </Framework>
  );
};

export default Com;
