import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants, { ProductionStates } from "lib/constants";

import Modal from "components/molecule/Modal";
import OverlayWrapper from "components/atom/OverlayWrapper";
import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, orderId, onHide } =
    useContext(LocalDataContext);

  const { color, label, textColor } = ProductionStates["inProgress"];

  return (
    <>
      <div
        className={cn(
          "align-items-center flex flex-row gap-2 text-sm font-normal",
        )}
      >
        <OverlayWrapper
          isLock={!isEditable}
          renderTrigger={() => (
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
        >
          <PopoverEdit />
        </OverlayWrapper>
      </div>
    </>
  );
};

const PopoverEdit = () => {
  const { data, onChange, orderId, onHide } = useContext(LocalDataContext);

  const handleClick = (k) => {
    // onChange(k, 'states')
  };

  return (
    <div
      className={cn(
        styles.statesDropdownContainer,
        "flex-column flex gap-2 p-2",
      )}
    >
      {_.keys(ProductionStates)?.map((k) => {
        const { color, label, textColor } = ProductionStates[k] || "--";
        return (
          <div
            key={k}
            className={cn(styles.statesContainer)}
            style={{ color: textColor, backgroundColor: color }}
            onClick={() => handleClick(k)}
          >
            {label}
          </div>
        );
      })}
    </div>
  );
};

export default Com;
