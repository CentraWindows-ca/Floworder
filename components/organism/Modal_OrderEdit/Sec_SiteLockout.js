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

const COMMON_FIELDS = constants.applyField([
  {
    id: "lo_scheduledLockoutDate",
    title: "Schedule Date",
    Component: Editable.EF_DateOnly,
    disabled: true,
    isHighlightDiff: false,
    renderValue: (v, data, context) => {
      return context?.initDataSiteLockout?.scheduledLockoutDate
    }
  },
  {
    id: "lo_displayName",
    title: "Lockout Number",
    Component: Editable.EF_Input,
    disabled: true,
    isHighlightDiff: false,
        renderValue: (v, data, context) => {
      return context?.initDataSiteLockout?.displayName || "--"
    }
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
