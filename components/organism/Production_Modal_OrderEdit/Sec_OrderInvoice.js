import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import { applyField } from "lib/constants/production_constants_labelMapping";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_Input,
    id: "m_DepositValue",
    className: "text-right"
  },
  {
    Component: Editable.EF_Input,
    id: "m_ListPrice",
    className: "text-right"
  },
  {
    Component: Editable.EF_Input,
    id: "m_Commission",
    className: "text-right"
  },
  {
    Component: Editable.EF_Input,
    id: "m_PaymentType",
  },
  {
    Component: Editable.EF_Input,
    id: "m_Discount",
    className: "text-right"
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "m_Tax",
    placeholder: "-",
    options: _.keys(constants.InvoiceTax)?.map((k) => ({
      label: k,
      value: k,
      key: k,
    })),
  },
  {
    Component: Editable.EF_Input,
    id: "m_PSTExemptionNumber",
    onIsDisplay: (item, data) => {
      return [
        constants.InvoiceTax["GST+PST"],
        constants.InvoiceTax["PST Exempt"],
      ].includes(data?.m_Tax);
    },
    className: "text-right"
  },
  {
    Component: Editable.EF_Input,
    id: "m_PO",
  },
]);

const Com = ({}) => {
  const {
    data,
    initData,
    onChange,
    checkEditable,
    checkAddOnField,
    validationResult,
  } = useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnInputsContainer)}>
      {COMMON_FIELDS?.map((a, i) => {
        const { id, Component, title, overrideOnChange, onIsDisplay, className, ...rest } =
          a;
        const addon = checkAddOnField({ id });
        const addonClass = addon?.isSyncedFromParent
          ? styles.addonSync_input
          : "";

        if (typeof onIsDisplay === "function") {
          const _isDisplay = onIsDisplay(a, data);
          if (!_isDisplay) return null;
        }

        return (
          <DisplayBlock id={id} key={id}>
            <label>{title}</label>
            <div>
              <Component
                id={id}
                value={data?.[id] || ""}
                initValue={initData?.[id] || ""}
                isHighlightDiff
                onChange={(v, ...o) => {
                  if (typeof overrideOnChange === "function") {
                    overrideOnChange(onChange, [v, ...o]);
                  } else {
                    onChange(v, id);
                  }
                }}
                errorMessage={validationResult?.[id]}
                disabled={!checkEditable({ id })}
                className={cn(addonClass, className)}
                {...rest}
              />
            </div>
          </DisplayBlock>
        );
      })}
    </div>
  );
};

export default Com;
