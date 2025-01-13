import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import LoadingBlock from "components/atom/LoadingBlock";

import Sec_States from "./Sec_States"
import Sec_Contact from "./Sec_Contact"
import Sec_Address from "./Sec_Customer"
import Sec_OrderInfo from "./Sec_OrderInfo";
import Sec_OrderOptions from "./Sec_OrderOptions";
import Sec_Attachments from "./Sec_Attachments";
import Sec_Schedule from "./Sec_Schedule";
import Sec_Summary from "./Sec_Summary";

import Toggle_Notes from "./Toggle_Notes";
import Toggle_ProductionItems from "./Toggle_ProductionItems";
import Toggle_RemakeItems from "./Toggle_RemakeItems";
import Toggle_BackorderItems from "./Toggle_BackorderItems";
import Toggle_GlassItems from "./Toggle_GlassItems";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import Editable from "components/molecule/Editable";

const Com = (props) => {
  const { orderId, onHide, onAnchor, expands, setExpands } =
    useContext(LocalDataContext);

  const router = useRouter();
  const { state } = router?.query || {};

  // use swr later

  const jsxTitle = (
    <div className="flex gap-2">
      Work Order #AN0077R2
      <div className="flex gap-2 align-items-center">
        <Sec_States/>
        <Sec_Contact/>
      </div>
    </div>
  );

  return (
    <Modal
      show={orderId}
      title={jsxTitle}
      size="xl"
      onHide={onHide}
      fullscreen={true}
    >
      <div>
        <div className="justify-content-between flex mb-2 align-items-center">
          <div><Sec_Address/></div>
          <div className={cn(styles.anchors)}>
            <span onClick={() => onAnchor("productionItems", true)}>Items</span>
            <span onClick={() => onAnchor("remakeItems", true)}>Remake</span>
            <span onClick={() => onAnchor("backorderItems", true)}>Backorder</span>
            <span onClick={() => onAnchor("glassItems", true)}>Glass</span>
            <span onClick={() => onAnchor("notes", true)}>Notes</span>
          </div>
        </div>

        <div className={cn(styles.gridsOfMainInfo, "gap-2")}>
          <div className={cn(styles.mainItem, styles["mainItem-1"])}>
            <div className={cn(styles.sectionTitle)}>Order Information</div>
            <Sec_OrderInfo />
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-2"])}>
            <div className={cn(styles.sectionTitle)}>Order Options</div>
            <Sec_OrderOptions />
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-3"])}>
            <Sec_Attachments />
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-4"])}>
            <div className={cn(styles.sectionTitle)}>Purchase Orders</div>
            Purchase Order(s)
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-5"])}>
            <div className={cn(styles.sectionTitle)}>Schedule</div>
            <Sec_Schedule />
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-6"])}>
            <div className={cn(styles.sectionTitle)}>Summary</div>
            <Sec_Summary />
          </div>
        </div>
        <div className="justify-content-center my-2 flex bg-blueGray-100 p-2">
          <button className="btn btn-primary px-4">Save</button>
        </div>
        <hr/>
        <div className="flex-column flex gap-2">
          <Toggle_Notes />
          <Toggle_ProductionItems />
          <Toggle_RemakeItems />
          <Toggle_BackorderItems />
          <Toggle_GlassItems />
        </div>
      </div>
    </Modal>
  );
};

export default (props) => {
  return (
    <LocalDataProvider {...props}>
      <Com />
    </LocalDataProvider>
  );
};
