import React, { useState, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants, {
  INVOICE_STATUS,
  INVOICE_WORKFLOW,
  INVOICE_STATUS_MAPPING,
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
  } = useContext(LocalDataContext);

  const uIstatusObj =
    INVOICE_STATUS?.find((a) => a.key === data?.[`invh_invoiceStatus`]) || {};
  const { color, label, textColor } = uIstatusObj;


  return (
    <>
      <StatusUpdate/>
    </>
  );
};

const StatusUpdate = () => {
  const { data, onUpdateStatus, checkEditable } =
    useContext(LocalDataContext);

  const id = `invh_invoiceStatus`;

  const uIstatusObj = INVOICE_STATUS?.find((a) => a.key === data?.[id]) || {};
  const { color, label, textColor } = uIstatusObj;
  const [toggle, setToggle] = useState(false);

  return (
    <>
      <div
        className={cn(
          "align-items-center flex flex-row gap-2 font-normal",
        )}
      >
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
                {label}
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
              onUpdateStatus(v);
              setToggle((prev) => !prev);
            }}
            uIstatusObj={uIstatusObj}
          />
        </OverlayWrapper>
      </div>
    </>
  );
};

const PopoverEdit = ({ onChange, uIstatusObj, statusLabel }) => {
  const allowedStatusNames = INVOICE_WORKFLOW[uIstatusObj?.systemName];
  const allowedStatus =
    allowedStatusNames?.map((n) => INVOICE_STATUS_MAPPING[n]) ||
    INVOICE_STATUS.filter((a) => a.key);

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
