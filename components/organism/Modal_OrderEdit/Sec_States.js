import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants, { ORDER_STATES } from "lib/constants";

import Modal from "components/molecule/Modal";
import OverlayWrapper from "components/atom/OverlayWrapper";
import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";

// styles
import styles from "./styles.module.scss";
import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";


const Com = ({ className, ...props }) => {
  const { data, kind, onChange, onUpdateStatus, isEditable, onHide } =
    useContext(LocalDataContext);

  const { color, label, textColor } = ORDER_STATES[data?.[kind]?.status] || {};

  console.log(data, kind)

  const [toggle, setToggle] = useState(false)

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
              <span>{label}</span>
              <div>
                <i className="fa-solid fa-angle-down" />
              </div>
            </div>
          )}
          toggle = {toggle}
        >
          <PopoverEdit onChange = {(k) => {
            onUpdateStatus(k)
            setToggle(prev => !prev)
          }}/>
        </OverlayWrapper>
      </div>
    </>
  );
};

const PopoverEdit = ({onChange}) => {
  return (
    <div
      className={cn(
        styles.statesDropdownContainer,
        "flex-column flex gap-2 p-2",
      )}
    >
      {ORDER_STATES?.map((a) => {
        const { key, color, label, textColor } = a
        return (
          <div
            key={key}
            className={cn(styles.statesContainer, styles.statesContainerEditable,)}
            style={{ color: textColor, backgroundColor: color }}
            onClick={() => onChange(key)}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default Com;
