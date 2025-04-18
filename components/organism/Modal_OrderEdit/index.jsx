import React, { useContext } from "react";
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
import constants, { WORKORDER_MAPPING } from "lib/constants";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = ({}) => {
  const {
    isLoading,
    initMasterId,
    onHide,
    onAnchor,
    onSave,
    onRestore,
    onGetWindowMaker,

    data,

    kind,
    checkEditable,
    setIsEditable,
    existingAttachments,
    existingImages,
    windowItems,
    doorItems,
    glassTotal,
    uIstatusObj,
    isDeleted = false,
  } = useContext(LocalDataContext);

  // use swr later

  const KindDisplay = {
    m: null,
    w: <b className="text-primary">[Windows]</b>,
    d: <b className="text-primary">[Doors]</b>,
  };

  const isOnStatusAllowToEdit = ![WORKORDER_MAPPING.Pending.key].includes(
    data?.["m_Status"],
  );

  const jsxTitle = (
    <div className="justify-content-between align-items-center flex-grow-1 flex">
      <div className="align-items-center flex gap-2">
        <PermissionBlock
          featureCodeGroup={constants.FEATURE_CODES["om.prod.wo"]}
          op="canEdit"
        >
          {!checkEditable() && !isDeleted && isOnStatusAllowToEdit && (
            <button
              className="btn btn-outline-success me-2"
              onClick={() => setIsEditable(true)}
            >
              <i className="fa-solid fa-pen-to-square me-2" />
              Edit Work Order
            </button>
          )}
        </PermissionBlock>
        <PermissionBlock
          featureCode={constants.FEATURE_CODES["om.prod.wo"]}
          op="canAdd"
        >
          {!checkEditable() && !isDeleted && (
            <button
              className="btn btn-primary me-2"
              onClick={() => onGetWindowMaker()}
            >
              <i className="fa-solid fa-cloud-arrow-down me-2"></i>
              Get WindowMaker
            </button>
          )}
        </PermissionBlock>
        <PermissionBlock
          featureCode={constants.FEATURE_CODES["om.prod.wo"]}
          op="canDelete"
        >
          {isDeleted && (
            <button
              className="btn btn-outline-success me-2"
              onClick={() => onRestore()}
            >
              <i className="fa-solid fa-trash-can-arrow-up me-2" />
              Restore
            </button>
          )}
        </PermissionBlock>
        {KindDisplay[kind]} Work Order # {data?.m_WorkOrderNo}
        {isDeleted && (
          <div className="align-items-center flex gap-2 text-red-400">
            [DELETED]
          </div>
        )}
        <div className="align-items-center flex gap-2">
          <Sec_Status />
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
          <div className={cn(styles.anchors)}>
            <span onClick={() => onAnchor("basic", true)}>Basic</span> |
            <span onClick={() => onAnchor("notes", true)}>Notes</span> |
            <span onClick={() => onAnchor("images", true)}>
              Images ({existingImages?.length || 0})
            </span>
            |
            <span onClick={() => onAnchor("files", true)}>
              Attachment Files ({existingAttachments?.length || 0})
            </span>
            |
            <span onClick={() => onAnchor("productionItems", true)}>
              Items ({(windowItems?.length || 0) + (doorItems?.length || 0)})
            </span>
            |
            <span onClick={() => onAnchor("glassItems", true)}>
              Glass ({glassTotal?.qty || 0}/{glassTotal?.glassQty || 0})
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      show={initMasterId}
      title={jsxTitle}
      size="xl"
      onHide={onHide}
      fullscreen={true}
      bodyClassName={styles.modalBody}
      headerClassName={styles.modalHeader}
      titleClassName={"flex justify-content-between flex-grow-1"}
    >
      <span id="basic" />
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
          </div>
          <div
            className="flex-column flex"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <Toggle_Notes />
          </div>
          {checkEditable() && (
            <div
              className={cn(
                "justify-content-center flex p-2",
                styles.buttonContainer,
              )}
              style={{ margin: "10px 0px" }}
            >
              <button
                className="btn btn-primary px-4"
                disabled={!data?.m_WorkOrderNo}
                onClick={onSave}
              >
                Save
              </button>
            </div>
          )}

          <hr />

          <div className="flex-column flex" style={{ gap: "10px" }}>
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
