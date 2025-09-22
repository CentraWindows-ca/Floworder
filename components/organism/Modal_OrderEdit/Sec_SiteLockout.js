import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import { getIsRequired } from "./hooks/vconfig";
import { Block } from "./Com";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock, displayFilter } from "./Com";
import { PORTAL_WEBCAL } from "lib/api/SERVER";

const COMMON_FIELDS = constants.applyField([
  {
    id: "lo_scheduledLockoutDate",
    title: "Schedule Date",
    Component: Editable.EF_DateOnly,
    disabled: true,
    isHighlightDiff: false,
    renderValue: (v, data, context) => {
      return context?.initDataSiteLockout?.scheduledLockoutDate;
    },
  },
  {
    id: "lo_displayName",
    title: "Lockout Number",
    Component: Editable.EF_Renderer,
    disabled: true,
    isHighlightDiff: false,
    renderValue: (v, data, context) => {
      return (
        <div
          style={{ width: 140, height: 34 }}
          className="d-flex align-items-center justify-content-center"
        >
          <a
            href={`${PORTAL_WEBCAL}/?page=month&work-order-number=${context?.initDataSiteLockout?.siteLockoutId}&department=service&isLockout=1`}
            target="_blank"
          >
            {context?.initDataSiteLockout?.displayName ||
              `LO_${context?.initDataSiteLockout?.siteLockoutId}` ||
              "--"}{" "}
            <i
              className="fa-solid fa-arrow-up-right-from-square ms-1"
              style={{ fontSize: 11 }}
            ></i>
          </a>
        </div>
      );
    },
  },
]);

const Com = ({}) => {
  return (
    <>
      <div className={cn(styles.columnScheduledContainer)}>
        {COMMON_FIELDS?.map((a) => {
          const { title, id } = a;
          return <DisplayDate key={id} {...a} />;
        })}
      </div>
    </>
  );
};

const DisplayDate = (props) => {
  const { id, displayId, title, Component, className, ...rest } = props;
  const { data, initDataSiteLockout, checkAddOnField } =
    useContext(LocalDataContext);

  if (Component) {
    return (
      <Block
        className_input={cn(
          styles.columnScheduledInput,
          "justify-content-end align-items-center flex",
        )}
        inputData={props}
      />
    );
  }
};

export default Com;
