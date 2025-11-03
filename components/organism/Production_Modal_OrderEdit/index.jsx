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

    isInAddOnGroup,
    addonGroup,
  } = useContext(LocalDataContext);

  const [historyOrderMasterId, setHistoryOrderMasterId] = useState(null);

  const KindDisplay = {
    m: null,
    w: <b className="text-primary">[Windows]</b>,
    d: <b className="text-primary">[Doors]</b>,
  };

  /* NOTE: <rule 250912_cancel_editable> */
  const isOnStatusAllowToEdit = ![
    WORKORDER_STATUS_MAPPING.Cancelled.key,
  ].includes(data?.[`${kind}_Status`]);
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
        {/* Add-on info */}
        {isInAddOnGroup && (
          <small className="fw-normal">
            {addonGroup?.parent?.m_MasterId === initMasterId
              ? "(Parent)"
              : "(Add-on)"}
          </small>
        )}
        {isDeleted && (
          <div className="align-items-center flex gap-2 text-red-400">
            [DELETED]
          </div>
        )}
        <div className="align-items-center ms-2 flex gap-2">
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
              </CollapseContainer>
              {initDataSiteLockout ? (
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

export default (props) => {
  return (
    <LocalDataProvider {...props}>
      <Com />
    </LocalDataProvider>
  );
};
