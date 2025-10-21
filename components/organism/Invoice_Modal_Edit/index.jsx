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
import Sec_OrderBasic from "./Sec_OrderBasic";
import Sec_InvoiceBasic from "./Sec_InvoiceBasic";

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
    initInvoiceId,
    onHide,
    onAnchor,
    onRestore,
    data,
    checkEditable,
    setIsEditable,
    editedGroup,
    existingAttachments,
    returnTrips,
    uIstatusObj,
    isDeleted = false,
  } = useContext(LocalDataContext);

  const [historyOrderMasterId, setHistoryInvoiceId] = useState(null);

  /* NOTE: <rule 250912_cancel_editable> */
  const isOnStatusAllowToEdit = ![
    WORKORDER_STATUS_MAPPING.Cancelled.key,
  ].includes(data?.[`status`]);
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
              Edit Invoice
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
              Undo Invoice Deletion
            </button>
          )}
        </PermissionBlock>
        Invoice # {data?.m_WorkOrderNo}
        {/* Add-on info */}
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
            <span onClick={() => onAnchor("returnTrips", true)}>
              Return Trips ({returnTrips?.length || 0})
            </span>{" "}
            |
            <span onClick={() => onAnchor("files", true)}>
              Attachments ({existingAttachments?.length || 0})
            </span>
            <PermissionBlock
              featureCodeGroup={constants.FEATURE_CODES["om.prod.history"]}
              op="canView"
            >
              <div>
                <button
                  className="btn btn-sm btn-outline-secondary ms-2"
                  onClick={() => setHistoryInvoiceId(initInvoiceId)}
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
      show={initInvoiceId}
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
        <div className={cn(styles.modalContentContainer)}>
          <div
            className={cn(styles.gridsOfMainInfo, {
              [styles.withLockout]: uiClass_withLockout,
            })}
          >
            <div className={cn(styles.mainItem, styles["grid-1"])}>
              <div className={cn(styles.sectionTitle)}>Invoice Information</div>
              <Sec_InvoiceBasic />
            </div>
            <div className={cn(styles.mainItem, styles["grid-1"])}>
              <div className={cn(styles.sectionTitle)}>Order Information</div>
              <Sec_OrderBasic />
            </div>
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
            </div>
          )}

          <hr />

          <div className="flex-column flex" style={{ gap: "10px" }}>
            <Toggle_Files title={"Attachments"} id={"files"} />
          </div>
        </div>
      </LoadingBlock>

      <Modal_OrderHistory
        initInvoiceId={historyOrderMasterId}
        onHide={() => setHistoryInvoiceId(null)}
        layer={1}
      />
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
