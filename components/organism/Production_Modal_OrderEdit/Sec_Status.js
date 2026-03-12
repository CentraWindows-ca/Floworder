import React, { useState, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants, {
  ORDER_STATUS,
  WORKORDER_WORKFLOW,
  WORKORDER_STATUS_MAPPING,
  FACILITY_FROM_CODE,
} from "lib/constants";

import OverlayWrapper from "components/atom/OverlayWrapper";
import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";
import { LocalDataContext, LocalDataContext_data } from "./LocalDataProvider";

const Com = ({}) => {
  const { data } = useContext(LocalDataContext_data);
  const {
    initData,
    checkEditable,
    onUpdateTransferredLocation,
    onChange,
    kind,
  } = useContext(LocalDataContext);

  const uIstatusObj =
    ORDER_STATUS?.find((a) => a.key === data?.[`m_Status`]) || {};
  const { color, label, textColor } = uIstatusObj;

  const isTransferred_w = [WORKORDER_STATUS_MAPPING.Transferred.key].includes(
    data?.m_WinStatus,
  );
  const isTransferred_d = [WORKORDER_STATUS_MAPPING.Transferred.key].includes(
    data?.m_DoorStatus,
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
        <StatusUpdate
          statusLabel="Windows"
          currentKind="w"
          fieldCode="m_WinStatus"
        />
      )}
      {(kind === "d" || kind === "m") && (
        <StatusUpdate
          statusLabel="Doors"
          currentKind="d"
          fieldCode="m_DoorStatus"
        />
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
              disabled={!checkEditable({ fieldCode: "m_TransferredLocation" })}
            />

            <button
              className="btn btn-primary"
              disabled={
                initData?.m_TransferredLocation ===
                  data?.m_TransferredLocation ||
                !checkEditable({ fieldCode: "m_TransferredLocation" })
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

const StatusUpdate = ({ statusLabel, currentKind, fieldCode }) => {
  const { data } = useContext(LocalDataContext_data);
  const {
    onUpdateStatus,
    checkEditable,
    checkAddOnField,
    initWithOriginalStructure,
  } = useContext(LocalDataContext);

  const field = fieldCode;

  const uIstatusObj = ORDER_STATUS?.find((a) => a.key === data?.[field]) || {};
  const { color, label, textColor } = uIstatusObj;
  const [toggle, setToggle] = useState(false);
  const addon = checkAddOnField({ id: fieldCode });

  const _isEditable = checkEditable({ fieldCode });

  const facilities = _.keys(initWithOriginalStructure)
    ?.map((k) => {
      const [kind, facilityCode] = k.split("_");
      return {
        kind,
        facility: FACILITY_FROM_CODE[facilityCode] || "",
        facilityCode
      };
    })
    ?.filter(({ kind }) => kind === currentKind);

  return (
    <>
      <div
        className={cn(
          "align-items-center flex flex-row gap-2 font-normal",
          addon?.isSyncedFromParent ? styles.addonSync_status : "",
        )}
      >
        <OverlayWrapper
          isLock={!_isEditable}
          renderTrigger={(onTrigger) => (
            <div
              className={cn(
                styles.statesContainer,
                _isEditable && styles.statesContainerEditable,
              )}
              style={{ color: textColor, backgroundColor: color }}
            >
              <span>
                {statusLabel}: {label}
              </span>
              {_isEditable && (
                <div>
                  <i className="fa-solid fa-angle-down" />
                </div>
              )}
            </div>
          )}
          toggle={toggle}
        >
          <PopoverEdit
            onChange={(v, facilityCode) => {
              onUpdateStatus(v, currentKind, facilityCode);
              setToggle((prev) => !prev);
            }}
            uIstatusObj={uIstatusObj}
            statusLabel={statusLabel}
            facilities={facilities}
          />
        </OverlayWrapper>
      </div>
    </>
  );
};

const PopoverEdit = ({ onChange, uIstatusObj, statusLabel, facilities }) => {
  const allowedStatusNames = WORKORDER_WORKFLOW[uIstatusObj?.systemName];
  const allowedStatus =
    allowedStatusNames?.map((n) => WORKORDER_STATUS_MAPPING[n]) ||
    ORDER_STATUS.filter((a) => a.key);

  const jsxStatusList = (a, _facilityCode) => {
    const { key, color, label, icon, textColor } = a;
    return (
      <div
        key={key}
        className={cn(styles.statesContainer, styles.statesContainerEditable)}
        // style={{ color: textColor, backgroundColor: color }}
        style={{ minHeight: 36 }}
        onClick={() => onChange(key, _facilityCode)}
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
  };

  return (
    <div
      className={cn(
        styles.statesDropdownContainer,
        "flex-column flex gap-2 p-2",
      )}
    >
      {facilities?.map((f) => {
        const { facility, facilityCode } = f;

        return (
          <React.Fragment key={facility}>
            <div className={cn(styles.columnFacility)}>
              <span>{facility}</span>
            </div>
            {allowedStatus?.map((a) => {
              return jsxStatusList(a, facilityCode);
            })}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Com;
