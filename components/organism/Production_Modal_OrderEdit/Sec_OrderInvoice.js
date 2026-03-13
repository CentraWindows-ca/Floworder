import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import { applyField } from "lib/constants/production_constants_labelMapping";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataContext_data } from "./LocalDataProvider";

import { DisplayBlock, Block } from "./Com";

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_Input,
    fieldCode: "m_DepositValue",
    className: "text-right",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_ListPrice",
    className: "text-right",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_Commission",
    className: "text-right",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_PaymentType",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_Discount",
    className: "text-right",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "m_Tax",
    placeholder: "-",
    options: _.keys(constants.InvoiceTax)?.map((k) => ({
      label: k,
      value: k,
      key: k,
    })),
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_PSTExemptionNumber",
    onIsDisplay: (item, data) => {
      return [
        constants.InvoiceTax["GST+PST"],
        constants.InvoiceTax["PST Exempt"],
      ].includes(data?.m_Tax);
    },
    className: "text-right",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_PO",
  },
]);

const Com = ({}) => {
  const { data } = useContext(LocalDataContext_data);

  return (
    <div className={cn(styles.columnInputsContainer)}>
      {COMMON_FIELDS?.map((a, i) => {
        const { fieldCode, onIsDisplay } = a;

        if (typeof onIsDisplay === "function") {
          const _isDisplay = onIsDisplay(a, data);
          if (!_isDisplay) return null;
        }

        return <Block fieldCode={fieldCode} key={fieldCode} inputData={a} />;
      })}
    </div>
  );
};

export default Com;
