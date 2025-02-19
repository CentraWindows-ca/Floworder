import React, { useState, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants, {
  ORDER_STATUS,
  WORKORDER_WORKFLOW,
  WORKORDER_MAPPING,
} from "lib/constants";

import OverlayWrapper from "components/atom/OverlayWrapper";
import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";
import { LocalDataContext } from "./LocalDataProvider";

const Com = ({ className, ...props }) => {
  const {
    initData,
    data,
    isEditable,
    onUpdateTransferredLocation,
    onChange,
    kind,
  } = useContext(LocalDataContext);

  const uIstatusObj =
    ORDER_STATUS?.find((a) => a.key === data?.[`m_Status`]) || {};
  const { color, label, textColor } = uIstatusObj;

  const isTransferred_w = [WORKORDER_MAPPING.Transferred.key].includes(
    data?.w_Status,
  );
  const isTransferred_d = [WORKORDER_MAPPING.Transferred.key].includes(
    data?.d_Status,
  );

  return (
    <>
      {kind === "m" && (
        <div
          className={cn(styles.statesContainer, "text-sm font-normal")}
          style={{ color: textColor, backgroundColor: color }}
        >
          <span>{label}</span>
        </div>
      )}

      {(kind === "w" || kind === "m") && (
        <StatusUpdate statusLabel="Window" currentKind="w" />
      )}
      {(kind === "d" || kind === "m") && (
        <StatusUpdate statusLabel="Door" currentKind="d" />
      )}
      {/* 
        either window or door in transfered status, allow to input location
      */}
      {(isTransferred_w || isTransferred_d) && (
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
      )}
    </>
  );
};

const StatusUpdate = ({ statusLabel, currentKind }) => {
  const {
    data,
    onUpdateStatus,
    isEditable,
    onUpdateTransferredLocation,
    onChange,
  } = useContext(LocalDataContext);

  const uIstatusObj =
    ORDER_STATUS?.find((a) => a.key === data?.[`${currentKind}_Status`]) || {};
  const { color, label, textColor } = uIstatusObj;
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <div
        className={cn(
          "align-items-center flex flex-row gap-2 text-sm font-normal",
        )}
      >
        <OverlayWrapper
          isLock={!isEditable}
          renderTrigger={(onTrigger) => (
            <div
              className={cn(
                styles.statesContainer,
                isEditable && styles.statesContainerEditable,
              )}
              style={{ color: textColor, backgroundColor: color }}
            >
              <span>
                {statusLabel}: {label}
              </span>
              {isEditable && (
                <div>
                  <i className="fa-solid fa-angle-down" />
                </div>
              )}
            </div>
          )}
          toggle={toggle}
        >
          <PopoverEdit
            onChange={(v) => {
              onUpdateStatus(v, currentKind);
              setToggle((prev) => !prev);
            }}
            uIstatusObj={uIstatusObj}
            statusLabel={statusLabel}
          />
        </OverlayWrapper>
      </div>
    </>
  );
};

const PopoverEdit = ({ onChange, uIstatusObj, statusLabel }) => {
  const allowedStatusNames = WORKORDER_WORKFLOW[uIstatusObj?.systemName];
  const allowedStatus =
    allowedStatusNames?.map((n) => WORKORDER_MAPPING[n]) || ORDER_STATUS.filter(a => a.key);

  return (
    <div
      className={cn(
        styles.statesDropdownContainer,
        "flex-column flex gap-2 p-2",
      )}
    >
      {allowedStatus?.map((a) => {
        const { key, color, label, icon, textColor } = a;
        return (
          <div
            key={key}
            className={cn(
              styles.statesContainer,
              styles.statesContainerEditable,
            )}
            // style={{ color: textColor, backgroundColor: color }}
            style={{ minHeight: 36 }}
            onClick={() => onChange(key)}
          >
            <div className="align-items-center flex gap-2">
              Move {statusLabel} To:
              <span
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: color,
                  border: "1px solid #A0A0A0",
                }}
              />
              <b>{label}</b>
            </div>
            <div className="text-blueGray-300">{icon}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Com;
