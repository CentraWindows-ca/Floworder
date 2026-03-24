import React, { useState, useContext, useEffect } from "react";
import cn from "classnames";
import _ from "lodash";
import constants, {
  ORDER_STATUS,
  WORKORDER_WORKFLOW,
  WORKORDER_STATUS_MAPPING,
  FACILITY_FROM_CODE,
  getStatusName,
} from "lib/constants";

import OverlayWrapper from "components/atom/OverlayWrapper";
import Editable from "components/molecule/Editable";
import Dropdown_MultiLayerControlled from "components/atom/Dropdown_MultiLayerControlled";

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

  const uIstatusObj =
    ORDER_STATUS?.find((a) => a.key === data?.[fieldCode]) || {};
  const { color, label, textColor } = uIstatusObj;
  const [options, setOptions] = useState([]);

  const addon = checkAddOnField({ id: fieldCode });
  const _isEditable = checkEditable({ fieldCode });

  useEffect(() => {
    let _options = facilities?.map((f) => {
      const { kind, facility, facilityCode } = f;
      const field = `${kind}_${facilityCode}_Status`;
      const current_status = data[field];
      const allowedStatus =
        WORKORDER_WORKFLOW[getStatusName(current_status)]?.map(
          (n) => WORKORDER_STATUS_MAPPING[n],
        ) || ORDER_STATUS.filter((a) => a.key);
      const currentStepObj =
        WORKORDER_STATUS_MAPPING[getStatusName(current_status)];

      const { label: currentLabel, color: currentColor } = currentStepObj || {};

      const _f = {
        kind,
        title: (
          <>
            <div className="d-flex align-items-center gap-2">
              <span
                style={{
                  width: 15,
                  height: 15,
                  backgroundColor: currentColor,
                  border: "1px solid #A0A0A0",
                }}
              />
              <b>{currentLabel || "- not set -"}</b>
              <span>({facility})</span>
            </div>
            <i className="fa-solid fa-angle-right"></i>
          </>
        ),
        facilityCode,
        className: styles.facilityDropdownItem,
        options: allowedStatus?.map((a) => {
          const { key, color, label, icon, textColor } = a;

          return {
            onSelect: () => {
              onUpdateStatus(key, kind, facilityCode);
            },
            title: (
              <div
                key={key}
                className={cn(
                  styles.statesContainer,
                  styles.statesContainerEditable,
                )}
                // style={{ color: textColor, backgroundColor: color }}
                style={{ minHeight: 36 }}
              >
                <div className="align-items-center flex gap-2">
                  Move to
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
                <div className="ms-2 text-slate-300">{icon}</div>
              </div>
            ),
            ...a,
          };
        }),
      };

      return _f;
    });

    if (_options?.length === 1) {
      _options = _options[0].options || [];
    }

    setOptions(_options);
  }, [initWithOriginalStructure]);

  const facilities = _.keys(initWithOriginalStructure)
    ?.map((k) => {
      const [kind, facilityCode] = k.split("_");
      return {
        kind,
        facility: FACILITY_FROM_CODE[facilityCode] || "",
        facilityCode,
      };
    })
    ?.filter(({ kind }) => kind === currentKind);

  return (
    <>
      <Dropdown_MultiLayerControlled
        disabled={!_isEditable}
        options={options}
        layer={2}
        className={cn(
          "align-items-center flex flex-row gap-2 font-normal",
          addon?.isSyncedFromParent ? styles.addonSync_status : "",
        )}
        classNamePopup={cn(
          styles.statesDropdownContainer,
          "flex-column flex gap-2 p-2",
        )}
        classNameItem={styles.item}
        title={
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
        }
      />
    </>
  );
};

export default Com;
