import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import { Spin } from "antd";
import { LoadingOutlined, SaveOutlined } from "@ant-design/icons";
import Modal from "components/molecule/Modal";
import PermissionBlock from "components/atom/PermissionBlock";
import Sec_Status from "./Sec_Status";
import { GeneralContext } from "lib/provider/GeneralProvider";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import OverlayWrapper from "components/atom/OverlayWrapper";
import Sec_OrderInfo from "./Sec_OrderInfo";
import Sec_OrderBasic from "./Sec_OrderBasic";
import Sec_OrderOptions from "./Sec_OrderOptions";
import Sec_Schedule from "./Sec_Schedule";
import Sec_Summary from "./Sec_Summary";
import Sec_SiteLockout from "./Sec_SiteLockout";

import Toggle_Notes from "./Toggle_Notes";
import Toggle_ProductionItems from "./Toggle_ProductionItems";
import Toggle_GlassItems from "./Toggle_GlassItems";
import Toggle_Images from "./Toggle_Images";
import Toggle_Files from "./Toggle_Files";
import Toggle_ReturnTrips from "./Toggle_ReturnTrips";

import { DisplayBlock } from "./Com";
import constants, { ADDON_STATUS, WORKORDER_MAPPING } from "lib/constants";

import Modal_OrderHistory from "components/organism/Modal_OrderHistory";
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
    onDetachAddOn,

    data,
    initDataSiteLockout,

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
  } = useContext(LocalDataContext);

  // use swr later
  const [historyOrderMasterId, setHistoryOrderMasterId] = useState(null);

  const KindDisplay = {
    m: null,
    w: <b className="text-primary">[Windows]</b>,
    d: <b className="text-primary">[Doors]</b>,
  };

  const isOnStatusAllowToEdit = true; // ![WORKORDER_MAPPING.Pending.key].includes( data?.["m_Status"]);
  const uiClass_withLockout = true;

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
          featureCode={constants.FEATURE_CODES["om.prod.woGetWindowMaker"]}
          op="canEdit"
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
              Undo Order Deletion
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
                <div className="text-base">
                  {constants.WorkOrderSelectOptions.branches?.find(
                    (a) => a.key === data?.m_TransferredLocation,
                  )?.label || "--"}
                </div>
              </DisplayBlock>
            )}
        </div>
      </div>
      <div>
        <div
          className={cn(
            "justify-content-between align-items-center me-2 flex",
            styles.modalToolBar,
          )}
        >
          <div className={cn(styles.anchors)}>
            <span onClick={() => onAnchor("basic", true)}>Basic</span> |
            <span onClick={() => onAnchor("notes", true)}>Notes</span> |
            <span onClick={() => onAnchor("returnTrips", true)}>
              Return Trips ({returnTrips?.length || 0})
            </span>{" "}
            |
            <span onClick={() => onAnchor("images", true)}>
              Images ({existingImages?.length || 0})
            </span>
            |
            <span onClick={() => onAnchor("files", true)}>
              Attachments ({existingAttachments?.length || 0})
            </span>
            |
            <span onClick={() => onAnchor("productionItems", true)}>
              Items ({(windowItems?.length || 0) + (doorItems?.length || 0)})
            </span>
            |
            <span onClick={() => onAnchor("glassItems", true)}>
              Glass ({glassTotal?.qty || 0}/{glassTotal?.glassQty || 0})
            </span>
            <PermissionBlock
              featureCodeGroup={constants.FEATURE_CODES["om.prod.history"]}
              op="canView"
            >
              <div>
                <button
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() => setHistoryOrderMasterId(initMasterId)}
                >
                  <i className="fa-solid fa-clock-rotate-left"></i>
                </button>
              </div>
            </PermissionBlock>
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
      bodyClassName={cn(styles.modalBody)}
      headerClassName={styles.modalHeader}
      titleClassName={"flex justify-content-between flex-grow-1"}
    >
      {constants.DEV_HOLDING_FEATURES.v20250815_addon && <AddOnSelector />}
      <span id="basic" />
      <LoadingBlock isLoading={isLoading}>
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
              </CollapseContainer>
              {!constants.DEV_HOLDING_FEATURES.v20250815_sitelockout_display &&
              initDataSiteLockout ? (
                <>
                  <div className={cn(styles.sectionTitle)}>Site Lockout</div>
                  <CollapseContainer id="sitelockout">
                    <CollapseContainer id="sitelockout">
                      <Sec_SiteLockout />
                    </CollapseContainer>
                  </CollapseContainer>
                </>
              ) : null}
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
              <PermissionBlock
                featureCodeGroup={
                  constants.FEATURE_CODES["om.prod.woDetachAddOn"]
                }
                isValidationInactive={true}
              >
                {data?.m_ParentMasterId ? (
                  <button
                    className="btn btn-outline-primary align-items-center flex gap-2 px-3"
                    disabled={
                      !data?.m_WorkOrderNo ||
                      isSaving ||
                      data?.m_AddOnStatus === ADDON_STATUS.detached // if already detached, disable
                    }
                    onClick={onDetachAddOn}
                  >
                    Detach AddOn
                  </button>
                ) : null}
              </PermissionBlock>
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

      <Modal_OrderHistory
        initMasterId={historyOrderMasterId}
        onHide={() => setHistoryOrderMasterId(null)}
        layer={1}
      />
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

const AddOnSelector = ({}) => {
  const { data, addonGroup, isInAddOnGroup } = useContext(LocalDataContext);

  if (!isInAddOnGroup || !addonGroup.parent) {
    return null;
  }

  const { onRoute } = useContext(GeneralContext);

  const handleSwitch = (masterId) => {
    onRoute({ masterId });
  };

  const { parent, addons } = addonGroup || {};

  return (
    <>
      <div className={cn(styles.addonContainer)}>
        <div className={cn(styles.addonMainContainer)}>
          <span className={cn(styles.addonLabel, "me-2")}>
            {/* <div className={styles.addonParentIcon}></div>  */}
            <i className={cn("fas fa-box me-1", styles.addonParentIcon)} />
            Parent order:
          </span>

          <div
            className={cn(
              styles.addonParent,
              parent?.m_MasterId === data?.m_MasterId ? styles.active : "",
            )}
            onClick={() => handleSwitch(parent?.m_MasterId)}
          >
            {parent.m_WorkOrderNo}
          </div>

          {!_.isEmpty(addons) && (
            <>
              <span className={cn(styles.addonLabel, "me-2 ms-3")}>
                <i
                  className={cn(
                    "fa-solid fa-file-circle-plus",
                    styles.addonChildIcon,
                  )}
                />{" "}
                AddOns:
              </span>
              <div className={cn(styles.addonListContainer)}>
                {addons?.map((a) => {
                  return (
                    <div
                      className={cn(
                        styles.addonItem,
                        a?.m_MasterId === data?.m_MasterId ? styles.active : "",
                      )}
                      onClick={() => handleSwitch(a?.m_MasterId)}
                    >
                      {a.m_WorkOrderNo}
                    </div>
                  );
                })}
              </div>

              <OverlayWrapper
                renderTrigger={() => (
                  <i
                    className={cn(
                      styles.addonIconInfo,
                      "fa-solid fa-circle-info ms-2",
                    )}
                  />
                )}
              >
                <div className="d-flex align-items-center p-2">
                  background color <div className={cn(styles.addonIcon)}></div>{" "}
                  means inherited data from {parent.m_WorkOrderNo}
                </div>
              </OverlayWrapper>
            </>
          )}
        </div>
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
