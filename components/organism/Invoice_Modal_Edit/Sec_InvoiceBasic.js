import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import { applyField } from "lib/constants/invoice_constants_labelMapping";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";
import labelMapping from "lib/constants/invoice_constants_labelMapping";

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_Input,
    id: "inv_invoiceAmount",
    className: "text-right",  
    placeholder: "0.00",
  },
  {
    Component: Editable.EF_Input,
    id: "invh_bcInvoiceNo",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "invh_rejectReason",
    options: constants.InvoiceSelectOptions.rejectReasonList,
  },
  {
    Component: Editable.EF_Text,
    id: "invh_rejectNotes",
    rows: 1,
  },
]);

const Com = ({}) => {
  const { data, initData, onChange, checkEditable, validationResult } =
    useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnInputsContainer)}>
      {COMMON_FIELDS?.map((a, i) => {
        const { id, Component, title, overrideOnChange, onIsDisplay, ...rest } = a;
        const _defaultTitle = labelMapping[id]?.title;

        return (
          <DisplayBlock id={id} key={id}>
            <label>{_defaultTitle || title}</label>
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
