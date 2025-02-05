import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import LoadingBlock from "components/atom/LoadingBlock";

import Sec_Status from "./Sec_Status";


import Sec_OrderInfo from "./Sec_OrderInfo";
import Sec_OrderBasic from "./Sec_OrderBasic";
import Sec_OrderOptions from "./Sec_OrderOptions";
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
    uiShowMore,
    setUiShowMore,
    initData,
    onUpdateTransferredLocation,
  } = useContext(LocalDataContext);

  // use swr later

  const KindDisplay = {
    m: null,
    w: <b className="text-amber-100">[Window]</b>,
    d: <b className="text-amber-100">[Door]</b>,
  };

  console.log(data?.m_TransferredLocation, initData?.m_TransferredLocation);

  const jsxTitle = (
    <div className="align-items-center flex gap-2">
      Work Order # {initWorkOrder} {KindDisplay[kind]}
      <div className="align-items-center flex gap-2">
        <Sec_Status />
        {/* <Sec_Contact /> */}
        {["Ready To Ship"].includes(uIstatusObj?.key) && (
          <DisplayBlock id="m_TransferredLocation">
            <div>
              <div className="input-group input-group-sm">
                <Editable.EF_Input
                  k="m_TransferredLocation"
                  value={data?.m_TransferredLocation || ""}
                  onChange={(v) => onChange(v, "m_TransferredLocation")}
                  placeholder={"Transferred Location"}
                />
                <button
                  className="btn btn-primary"
                  disabled={
                    initData?.m_TransferredLocation ===
                      data?.m_TransferredLocation || !isEditable
                  }
                  onClick={onUpdateTransferredLocation}
                >
                  Save
                </button>
              </div>
            </div>
          </DisplayBlock>
        )}

        {["Shipped"].includes(uIstatusObj?.key) &&
          data?.m_TransferredLocation && (
            <DisplayBlock id="m_TransferredLocation">
              <label className="text-base font-normal">Transferred to: </label>
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
      bodyClassName={styles.modalBody}
    >
      <div className="">
        <div className="justify-content-between align-items-center mb-2 flex">
          <div>
            <div className="input-group input-group-sm">
              <button
                className={cn(
                  "btn",
                  uiShowMore ? "btn-primary" : "btn-outline-primary",
                )}
                onClick={() => setUiShowMore(true)}
              >
                Show More
              </button>
              <button
                className={cn(
                  "btn",
                  uiShowMore ? "btn-outline-primary" : "btn-primary",
                )}
                onClick={() => setUiShowMore(false)}
              >
                Show Less
              </button>
            </div>
          </div>
          <div className={cn(styles.anchors)}>
            <span onClick={() => onAnchor("images", true)}>
              Images ({existingImages?.length || 0})
            </span>{" "}
            |
            <span onClick={() => onAnchor("files", true)}>
              Attachment Files ({existingAttachments?.length || 0})
            </span>{" "}
            |
            <span onClick={() => onAnchor("productionItems", true)}>
              Items ({windowItems?.length || 0 + (doorItems?.length || 0)})
            </span>{" "}
            |
            <span onClick={() => onAnchor("glassItems", true)}>
              Glass ({glassTotal?.qty || 0}/{glassTotal?.glassQty || 0})
            </span>{" "}
            |<span onClick={() => onAnchor("notes", true)}>Notes</span>
          </div>
        </div>
        <div className={cn(styles.gridsOfMainInfo)}>
          <div className={cn(styles.mainItem, styles["grid-1"])}>
            <div className={cn(styles.sectionTitle)}>Order Information</div>
            <CollapseContainer id="orderInformation">
              <Sec_OrderInfo />
            </CollapseContainer>
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-1"])}>
            <div className={cn(styles.sectionTitle)}>Order Options</div>
            <CollapseContainer id="orderOptions">
              <Sec_OrderOptions />
            </CollapseContainer>
          </div>
          <div className={cn(styles.mainItem, styles["grid-2"])}>
            <div className={cn(styles.sectionTitle)}>Basic Information</div>
            <CollapseContainer id="basicInformation">
              <Sec_OrderBasic />
            </CollapseContainer>
          </div>
        </div>
        <div className={cn(styles.gridsOfBelowInfo)}>
          <div className={cn(styles.mainItem, styles["mainItem-2"])}>
            <div className={cn(styles.sectionTitle)}>Schedule</div>
            <CollapseContainer id="schedule">
              <Sec_Schedule />
            </CollapseContainer>
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-3"])}>
            <div className={cn(styles.sectionTitle)}>Summary</div>
            <CollapseContainer id="summary">
              <Sec_Summary />
            </CollapseContainer>
          </div>
          <div className={cn(styles.mainItem, styles["mainItem-4"])}>
            <div className={cn(styles.sectionTitle)}>Lbr.</div>
            <CollapseContainer id="lbr">
              <Sec_Lbr />
            </CollapseContainer>
          </div>
        </div>
        <div className="flex-column flex" style={{ marginTop: "5px" }}>
          <Toggle_Notes />
          {/* <div className={cn(styles.mainItem)}>
            <div className={cn(styles.sectionTitle)}>Notes</div>
            <Toggle_Notes />
          </div> */}
        </div>
        <div
          className="justify-content-center flex bg-slate-100 p-2"
          style={{ margin: "5px 0px" }}
        >
          <button
            className="btn btn-primary px-4"
            disabled={!data?.m_WorkOrderNo || !isEditable}
            onClick={onSave}
          >
            Save
          </button>
        </div>
        <div className="flex-column flex" style={{ gap: "5px" }}>
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

const CollapseContainer = ({ id, children }) => {
  const { uiShowMore, setUiShowMore } = useContext(LocalDataContext);

  const handleClick = () => {
    setUiShowMore((prev) => ({
      ...prev,
      [id]: prev?.id,
    }));
  };

  return (
    <>
      <div
        className={cn(
          styles.collapseContainer,
          uiShowMore ? styles.showingContainer : styles.hiddingContainer,
        )}
      >
        {children}
      </div>
      {/* <div className={styles.showmore} onClick={handleClick}>
        Show More
      </div> */}
    </>
  );
};

export default (props) => {
  return (
    <LocalDataProvider {...props}>
      <Com />
    </LocalDataProvider>
  );
};
