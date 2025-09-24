import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { Button } from "antd";
import Tooltip from "components/atom/Tooltip";

// components
import PageContainer from "components/atom/PageContainer";

// styles
import styles from "./styles.module.scss";

const Com = ({ children, className, jsxTabs, jsxSideMenu }) => {
  // ====== search
  const [drawerOpen, handleToggleDrawer] = useState(true);

  // ====== consts
  return (
    <div className={cn("w-full", styles.root, className)}>
      <PageContainer>
        {/* layout of panels */}
        <div className={styles.mainContainer}>
          <div className={styles.tabContainer}>{jsxTabs}</div>
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
              <div className={styles.itemsDrawerContainer}>{jsxSideMenu}</div>
            </div>
            <div className={styles.columnOfDetailPanel}>{children}</div>
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
