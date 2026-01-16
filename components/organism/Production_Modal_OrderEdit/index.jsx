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
import LoadingBlock from "components/atom/LoadingBlock";

import { DisplayBlock } from "./Com";
import constants, {
  ADDON_STATUS,
  WORKORDER_STATUS_MAPPING,
} from "lib/constants";

import Modal_OrderHistory from "components/organism/Production_Modal_OrderHistory";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import Main from "./Main";

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
              Return Trips ({tabCounts.returnTrips})
            </span>{" "}
            |
            <span onClick={() => onAnchor("images", true)}>
              Images ({tabCounts.existingImages})
            </span>
            |
            <span onClick={() => onAnchor("files", true)}>
              Attachments ({tabCounts.existingAttachments})
            </span>
            |
            <span onClick={() => onAnchor("productionItems", true)}>
              Items ({tabCounts.items})
            </span>
            |
            <span onClick={() => onAnchor("glassItems", true)}>
              Glass ({tabCounts.glass})
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
              <Modal_OrderHistory
                initMasterId={historyOrderMasterId}
                onHide={() => setHistoryOrderMasterId(null)}
                layer={1}
              />
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
      <Main />
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
