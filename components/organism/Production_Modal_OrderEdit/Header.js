import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import PermissionBlock from "components/atom/PermissionBlock";
import Sec_Status from "./Sec_Status";

import { DisplayBlock } from "./Com";
import constants, { WORKORDER_STATUS_MAPPING } from "lib/constants";

import Modal_OrderHistory from "components/organism/Production_Modal_OrderHistory";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";

const Com = ({}) => {
  const {
    initMasterId,
    onAnchor,
    onRestore,
    onGetWindowMaker,
    data,
    kind,
    display_sections,
    checkEditable,
    setIsEditable,
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
    <div
      className={cn(
        "justify-content-between align-items-center flex-grow-1 flex",
        styles.modalToolBar,
      )}
    >
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
        <div className={cn("justify-content-between align-items-center flex")}>
          <div className={cn(styles.anchors)}>
            {display_sections.basic && (
              <span onClick={() => onAnchor("basic", true)}>Basic</span>
            )}
            {display_sections.notes && (
              <span onClick={() => onAnchor("notes", true)}>Notes</span>
            )}
            {display_sections.returnTrips && (
              <span onClick={() => onAnchor("returnTrips", true)}>
                Return Trips ({tabCounts.returnTrips})
              </span>
            )}
            {display_sections.images && (
              <span onClick={() => onAnchor("images", true)}>
                Images ({tabCounts.existingImages})
              </span>
            )}
            {display_sections.files && (
              <span onClick={() => onAnchor("files", true)}>
                Attachments ({tabCounts.existingAttachments})
              </span>
            )}
            {display_sections.productionItems && (
              <span onClick={() => onAnchor("productionItems", true)}>
                Items ({tabCounts.items})
              </span>
            )}
            {display_sections.glassItems && (
              <span onClick={() => onAnchor("glassItems", true)}>
                Glass ({tabCounts.glass})
              </span>
            )}
          </div>
          <div>
            {display_sections.history && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return jsxTitle;
};

export default Com;
