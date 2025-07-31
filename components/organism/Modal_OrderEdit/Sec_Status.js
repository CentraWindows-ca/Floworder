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

const Com = ({}) => {
  const {
    initData,
    data,
    checkEditable,
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
          className={cn(styles.statesContainer, "font-normal")}
          style={{
            color: textColor,
            backgroundColor: color,
            opacity: 0.6, // to follow the style of dropdowns
          }}
        >
          <span>{label}</span>
        </div>
      )}

      {(kind === "w" || kind === "m") && (
        <StatusUpdate statusLabel="Windows" currentKind="w" />
      )}
      {(kind === "d" || kind === "m") && (
        <StatusUpdate statusLabel="Doors" currentKind="d" />
      )}
      {/* 
        either window or door in transfered status, allow to input location
      */}
      {(isTransferred_w || isTransferred_d) && (
        <div>
          <div className="input-group">
            <Editable.EF_SelectWithLabel
              k="m_TransferredLocation"
              value={data?.m_TransferredLocation || ""}
              onChange={(v) => onChange(v, "m_TransferredLocation")}
              placeholder={"Transferred Location"}
              options={constants.WorkOrderSelectOptions.branches}
              disabled={!checkEditable({ id: "m_TransferredLocation" })}
            />

            <button
              className="btn btn-primary"
              disabled={
                initData?.m_TransferredLocation ===
                  data?.m_TransferredLocation ||
                !checkEditable({ id: "m_TransferredLocation" })
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
  const { data, onUpdateStatus, checkEditable } = useContext(LocalDataContext);

  const id = `${currentKind}_Status`;

  const uIstatusObj = ORDER_STATUS?.find((a) => a.key === data?.[id]) || {};
  const { color, label, textColor } = uIstatusObj;
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <div className={cn("align-items-center flex flex-row gap-2 font-normal")}>
        <OverlayWrapper
          isLock={!checkEditable({ id })}
          renderTrigger={(onTrigger) => (
            <div
              className={cn(
                styles.statesContainer,
                checkEditable({ id }) && styles.statesContainerEditable,
              )}
              style={{ color: textColor, backgroundColor: color }}
            >
              <span>
                {statusLabel}: {label}
              </span>
              {checkEditable({ id }) && (
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
    allowedStatusNames?.map((n) => WORKORDER_MAPPING[n]) ||
    ORDER_STATUS.filter((a) => a.key);

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
            <div className="text-slate-300">{icon}</div>
          </div>
        );
      })}
    </div>
  );
};

export default Com;
