import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import { Spin } from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import Modal from "components/molecule/Modal";
import PermissionBlock from "components/atom/PermissionBlock";
import Sec_Status from "./Sec_Status";
import Sec_OrderInfo from "./Sec_OrderInfo";
import Sec_OrderBasic from "./Sec_OrderBasic";
import Sec_OrderOptions from "./Sec_OrderOptions";
import Sec_Schedule from "./Sec_Schedule";
import Sec_Summary from "./Sec_Summary";
import Sec_LinkedService from "./Sec_LinkedService";
import Sec_OrderInvoice from "./Sec_OrderInvoice";
import Sec_AddonSelector from "./Sec_AddOnSelector";

import Toggle_Notes from "./Toggle_Notes";
import Toggle_ProductionItems from "./Toggle_ProductionItems";
import Toggle_GlassItems from "./Toggle_GlassItems";
import Toggle_Images from "./Toggle_Images";
import Toggle_Files from "./Toggle_Files";
import Toggle_ReturnTrips from "./Toggle_ReturnTrips";

import { DisplayBlock } from "./Com";
import constants, {
  ADDON_STATUS,
  WORKORDER_STATUS_MAPPING,
} from "lib/constants";

import Modal_OrderHistory from "components/organism/Production_Modal_OrderHistory";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = ({}) => {
  const {
    isSaving,
    onSave,
    isLoading,
    initMasterId,
    onHide,
    onAnchor,
    onRestore,
    onGetWindowMaker,
    onUnlinkAddOn,
    onLinkAddOn,
    data,
    initDataSiteLockout,
    initDataService,
    kind,
    checkEditable,
    setIsEditable,
    editedGroup,
    existingAttachments,
    existingImages,
    windowItems,
    doorItems,
    returnTrips,
    glassTotal,
    uIstatusObj,
    isDeleted = false,
    tabCounts,
    isInAddOnGroup,
    addonGroup,
  } = useContext(LocalDataContext);

  const uiClass_withLockout = true;


  return (
    <>
      <span id="basic" />
      <LoadingBlock isLoading={isLoading}>
        {!constants.DEV_HOLDING_FEATURES.v20250815_addon && (
          <Sec_AddonSelector />
        )}
        <div className={cn(styles.modalContentContainer)}>
          <div
            className={cn(styles.gridsOfMainInfo, {
              [styles.withLockout]: uiClass_withLockout,
            })}
          >
            <div className={cn(styles.mainItem, styles["grid-1"])}>
              <div className={cn(styles.sectionTitle)}>Basic Information</div>
              <CollapseContainer id="basicInformation">
                <Sec_OrderBasic />
              </CollapseContainer>
              {!constants.DEV_HOLDING_FEATURES.v20251016_invoice ? (
                <PermissionBlock
                  featureCode={constants.FEATURE_CODES["om.prod.wo.invoice"]}
                  op="canView"
                >
                  <div className={cn(styles.sectionTitle)}>Invoice</div>
                  <CollapseContainer id="invoice">
                    <Sec_OrderInvoice />
                  </CollapseContainer>
                </PermissionBlock>
              ) : null}
            </div>
            <div className={cn(styles.mainItem, styles["grid-2"])}>
              <div className={cn(styles.sectionTitle)}>Order Information</div>
              <CollapseContainer id="orderInformation">
                <Sec_OrderInfo />
              </CollapseContainer>
            </div>
            <div className={cn(styles.mainItem, styles["grid-3"])}>
              <div className={cn(styles.sectionTitle)}>Order Options</div>
              <CollapseContainer id="orderOptions">
                <Sec_OrderOptions />
              </CollapseContainer>
            </div>
            <div className={cn(styles.mainItem, styles["grid-4-up"])}>
              <div className={cn(styles.sectionTitle)}>Schedule</div>
              <CollapseContainer id="schedule">
                <Sec_Schedule />
                <Sec_LinkedService />
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

          <div
            className="flex-column flex"
            style={{ marginTop: "10px", marginBottom: "10px" }}
          >
            <Toggle_ReturnTrips title={"Return Trips"} id={"returnTrips"} />
          </div>

          {checkEditable() && (
            <div
              className={cn(
                "justify-content-center flex gap-2 p-2",
                styles.buttonContainer,
              )}
              style={{
                margin: "10px 0px",
                position: "sticky",
                bottom: "0px",
                zIndex: 5,
              }}
            >
              {/* save button */}
              <button
                className="btn btn-primary align-items-center flex gap-2 px-3"
                disabled={
                  !data?.m_WorkOrderNo || isSaving || _.isEmpty(editedGroup) // if there is any unsaved update
                }
                onClick={onSave}
              >
                {!isSaving ? (
                  <SaveOutlined size="small" />
                ) : (
                  <Spin
                    size="small"
                    indicator={<LoadingOutlined />}
                    spinning={isSaving}
                    style={{ color: "white" }}
                  />
                )}
                Save
              </button>

              {/* detach button */}
              {/* if it has parent */}
              {isInAddOnGroup && (
                <PermissionBlock
                  featureCode={constants.FEATURE_CODES["om.prod.woUnlinkAddOn"]}
                  // isValidationInactive={false}
                >
                  {data?.m_ParentMasterId ? (
                    <>
                      {data?.m_AddOnLinked !== ADDON_STATUS.detached ? (
                        <button
                          className="btn btn-outline-danger align-items-center flex gap-2 px-3"
                          disabled={!data?.m_WorkOrderNo || isSaving}
                          onClick={onUnlinkAddOn}
                        >
                          <img
                            src="/unlinked.svg"
                            className={styles.addonIcon}
                          />
                          Unlink Add-on
                        </button>
                      ) : (
                        <button
                          className="btn btn-outline-success align-items-center flex gap-2 px-3"
                          disabled={!data?.m_WorkOrderNo || isSaving}
                          onClick={onLinkAddOn}
                        >
                          <img src="/linked.svg" className={styles.addonIcon} />
                          Link Add-on
                        </button>
                      )}
                    </>
                  ) : null}
                </PermissionBlock>
              )}
            </div>
          )}

          <hr />

          <div className="flex-column flex" style={{ gap: "10px" }}>
            <Toggle_Images title={"Images"} id={"images"} />
            <Toggle_Files title={"Attachments"} id={"files"} />
            <Toggle_ProductionItems
              title={"Production Items"}
              id={"productionItems"}
            />
            <Toggle_GlassItems id={"glassItems"} />
          </div>
        </div>
      </LoadingBlock>
    </>
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
  return <Com />;
};
