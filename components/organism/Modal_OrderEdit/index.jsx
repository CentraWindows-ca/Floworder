import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import PermissionBlock from "components/atom/PermissionBlock";

import Sec_Status from "./Sec_Status";

import Sec_OrderInfo from "./Sec_OrderInfo";
import Sec_OrderBasic from "./Sec_OrderBasic";
import Sec_OrderOptions from "./Sec_OrderOptions";
import Sec_Schedule from "./Sec_Schedule";
import Sec_Summary from "./Sec_Summary";

import Toggle_Notes from "./Toggle_Notes";
import Toggle_ProductionItems from "./Toggle_ProductionItems";
import Toggle_GlassItems from "./Toggle_GlassItems";
import Toggle_Images from "./Toggle_Images";
import Toggle_Files from "./Toggle_Files";
import { DisplayBlock } from "./Com";
import constants from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = (props) => {
  const {
    isLoading,
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
    setIsEditable,
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
    w: <b className="text-primary">[Window]</b>,
    d: <b className="text-primary">[Door]</b>,
  };

  const jsxTitle = (
    <div className="justify-content-between align-items-center flex-grow-1 flex">
      <div className="align-items-center flex gap-2">
        {KindDisplay[kind]} Work Order # {initWorkOrder}
        <div className="align-items-center flex gap-2">
          <Sec_Status />         
          <PermissionBlock
            featureCode={constants.FEATURE_CODES["om.prod.wo"]}
            op="canEdit"
          >
            {!isEditable && (
              <button
                className="btn btn-sm btn-outline-warning"
                onClick={() => setIsEditable(true)}
              >
                <i className="fa-solid fa-pen-to-square me-2" />
                Edit Work Order
              </button>
            )}
          </PermissionBlock>

          {["Shipped"].includes(uIstatusObj?.key) &&
            data?.m_TransferredLocation && (
              <DisplayBlock id="m_TransferredLocation">
                <label className="text-base font-normal">
                  Transferred to:{" "}
                </label>
                <div className="text-base">{data?.m_TransferredLocation}</div>
              </DisplayBlock>
            )}
        </div>
      </div>
      <div>
        <div
          className={cn(
            "justify-content-between align-items-center me-4 flex",
            styles.modalToolBar,
          )}
        >
          <div className={cn(styles.anchors, "text-sm")}>
            <span onClick={() => onAnchor("images", true)}>
              Images ({existingImages?.length || 0})
            </span>{" "}
            |
            <span onClick={() => onAnchor("files", true)}>
              Attachment Files ({existingAttachments?.length || 0})
            </span>{" "}
            |
            <span onClick={() => onAnchor("productionItems", true)}>
              Items ({(windowItems?.length || 0) + (doorItems?.length || 0)})
            </span>{" "}
            |
            <span onClick={() => onAnchor("glassItems", true)}>
              Glass ({glassTotal?.qty || 0}/{glassTotal?.glassQty || 0})
            </span>{" "}
            |<span onClick={() => onAnchor("notes", true)}>Notes</span>
          </div>
        </div>
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
      titleClassName={"flex justify-content-between flex-grow-1"}
    >
      <LoadingBlock isLoading={isLoading}>
        <div className={cn(styles.modalContentContainer)}>
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
            <div className={cn(styles.mainItem, styles["mainItem-2"])}>
              <div className={cn(styles.sectionTitle)}>Schedule</div>
              <CollapseContainer id="schedule">
                <Sec_Schedule />
              </CollapseContainer>
            </div>
          </div>
          <div>
            <div className={cn(styles.mainItem, styles["mainItem-3"])}>
              <div className={cn(styles.sectionTitle)}>Summary</div>
              <CollapseContainer id="summary">
                <Sec_Summary />
              </CollapseContainer>
            </div>
            {/* <div className={cn(styles.mainItem, styles["mainItem-4"])}>
            <div className={cn(styles.sectionTitle)}>Lbr.</div>
            <CollapseContainer id="lbr">
              <Sec_Lbr />
            </CollapseContainer>
          </div> */}
          </div>
          <div className="flex-column flex" style={{ marginTop: "5px" }}>
            <Toggle_Notes />
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
      </LoadingBlock>
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
