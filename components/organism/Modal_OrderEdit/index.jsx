import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import LoadingBlock from "components/atom/LoadingBlock";

import Sec_Status from "./Sec_Status";
import Sec_Contact from "./Sec_Contact";
import Sec_Address from "./Sec_Customer";
import Sec_OrderInfo from "./Sec_OrderInfo";
import Sec_OrderOptions from "./Sec_OrderOptions";
import Sec_Attachments from "./Sec_Attachments";
import Sec_PurchaseOrders from "./Sec_PurchaseOrders";
import Sec_Schedule from "./Sec_Schedule";
import Sec_Summary from "./Sec_Summary";

import Toggle_Notes from "./Toggle_Notes";
import Toggle_ProductionItems from "./Toggle_ProductionItems";
import Toggle_GlassItems from "./Toggle_GlassItems";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import Editable from "components/molecule/Editable";

const Com = (props) => {
  const {
    initWorkOrder,
    onHide,
    onAnchor,
    onSave,
    expands,
    setExpands,
    data,
    onChange,
    dictionary,
  } = useContext(LocalDataContext);

  // use swr later

  const jsxTitle = (
    <div className="align-items-center flex gap-2">
      Work Order # {initWorkOrder?.m_WorkOrderNo}
      <div className="align-items-center flex gap-2">
        <Sec_Status />
        <Sec_Contact />
      </div>
    </div>
  );

  return (
    <Modal
      show={initWorkOrder}
      title={jsxTitle}
      size="xl"
      onHide={onHide}
      fullscreen={true}
    >
      <div>
        <div className="justify-content-between align-items-center mb-2 flex">
          <div>
            <Sec_Address />
          </div>
          <div className={cn(styles.anchors)}>
            <span onClick={() => onAnchor("productionItems", true)}>Items</span>
            <span onClick={() => onAnchor("remakeItems", true)}>Remake</span>
            <span onClick={() => onAnchor("backorderItems", true)}>
              Backorder
            </span>
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
            <Sec_PurchaseOrders />
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
        <div className="flex-column flex mt-2 gap-2">
          <Toggle_Notes />
        </div>
        <div className="justify-content-center my-2 flex bg-blueGray-100 p-2">
          <button
            className="btn btn-primary px-4"
            disabled={!data?.m_WorkOrderNo}
            onClick={onSave}
          >
            Save
          </button>
        </div>
        <hr />
        <div className="flex-column flex gap-2">
          <Toggle_ProductionItems
            title={"Production Items"}
            id={"productionItems"}
          />
          <Toggle_ProductionItems title={"Remake Items"} id={"remakeItems"} />
          <Toggle_ProductionItems
            title={"Backorder Items"}
            id={"backorderItems"}
          />
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
