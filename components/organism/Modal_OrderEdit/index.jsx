import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import LoadingBlock from "components/atom/LoadingBlock";

import Sec_Status from "./Sec_Status";

// import Sec_Customer from "./Sec_Customer";
import Sec_OrderInfo from "./Sec_OrderInfo";
import Sec_OrderBasic from "./Sec_OrderBasic";
import Sec_OrderOptions from "./Sec_OrderOptions";
// import Sec_Attachments from "./Sec_Attachments";

import Sec_Lbr from "./Sec_Lbr";

import Sec_Schedule from "./Sec_Schedule";
import Sec_Summary from "./Sec_Summary";

import Toggle_Notes from "./Toggle_Notes";
import Toggle_ProductionItems from "./Toggle_ProductionItems";
import Toggle_GlassItems from "./Toggle_GlassItems";
import Toggle_Images from "./Toggle_Images";
import Toggle_Files from "./Toggle_Files";
import { DisplayBlock } from "./Com";

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
    kind,
    dictionary,
    isEditable,
    existingAttachments,
    existingImages,
    windowItems,
    doorItems,
    glassItems,
    glassTotal,
    uIstatusObj,
  } = useContext(LocalDataContext);

  // use swr later

  const KindDisplay = {
    m: null,
    w: <b className="text-amber-100">[Window]</b>,
    d: <b className="text-amber-100">[Door]</b>,
  };

  const jsxTitle = (
    <div className="align-items-center flex gap-2">
      Work Order # {initWorkOrder?.m_WorkOrderNo} {KindDisplay[kind]}
      <div className="align-items-center flex gap-2">
        <Sec_Status />
        {/* <Sec_Contact /> */}
        {["Ready to Ship"].includes(uIstatusObj?.key) && (
          <DisplayBlock id="m_TransferredLocation">
            <div>
              <Editable.EF_Input
                k="m_TransferredLocation"
                value={data?.m_TransferredLocation || ""}
                onChange={(v) => onChange(v, "m_TransferredLocation")}
                placeholder={"Transferred Location"}
              />
            </div>
          </DisplayBlock>
        )}

        {["Shipped"].includes(uIstatusObj?.key) &&
          data?.m_TransferredLocation && (
            <DisplayBlock id="m_TransferredLocation">
              <label className="font-normal text-base">Transferred to: </label>
              <div className="text-base">{data?.m_TransferredLocation}</div>
            </DisplayBlock>
          )}
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
          <div>{/* <Sec_Customer /> */}</div>
          <div className={cn(styles.anchors)}>
            <span onClick={() => onAnchor("notes", true)}>Notes</span>
            <span onClick={() => onAnchor("images", true)}>
              Images ({existingImages?.length || 0})
            </span>
            <span onClick={() => onAnchor("files", true)}>
              Attachment Files ({existingAttachments?.length || 0})
            </span>

            <span onClick={() => onAnchor("productionItems", true)}>
              Items ({windowItems?.length || 0 + (doorItems?.length || 0)})
            </span>
            <span onClick={() => onAnchor("glassItems", true)}>
              Glass ({glassTotal?.qty || 0} / {glassTotal?.glassQty || 0})
            </span>
          </div>
        </div>
        <div className={cn(styles.gridsOfMainInfo)}>
          <div className={cn(styles.mainItem, styles["grid-1"])}>
            <div className={cn(styles.sectionTitle)}>Order Information</div>
            <Sec_OrderInfo />
          </div>
          <div className={cn(styles.mainItem, styles["grid-2"])}>
            <div className={cn(styles.sectionTitle)}>Basic Information</div>
            <Sec_OrderBasic />
          </div>
        </div>
        <div className={cn(styles.gridsOfBelowInfo)}>
          <div className={cn(styles.mainItem, styles["mainItem-1"])}>
            <div className={cn(styles.sectionTitle)}>Order Options</div>
            <Sec_OrderOptions />
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-2"])}>
            <div className={cn(styles.sectionTitle)}>Schedule</div>
            <Sec_Schedule />
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-3"])}>
            <div className={cn(styles.sectionTitle)}>Summary</div>
            <Sec_Summary />
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-4"])}>
            <div className={cn(styles.sectionTitle)}>Lbr.</div>
            <Sec_Lbr />
          </div>
        </div>
        <div className="flex-column mt-2 flex gap-2">
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
          <Toggle_Images title={"Images"} id={"images"} />
          <Toggle_Files title={"Attachment Files"} id={"files"} />
          <Toggle_ProductionItems
            title={"Production Items"}
            id={"productionItems"}
          />
          <Toggle_GlassItems id={"glassItems"} />
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
