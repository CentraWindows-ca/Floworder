import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";
import { Block, DisplayBlock } from "./Com";
import labelMapping, {
  applyField,
} from "lib/constants/invoice_constants_labelMapping";
import utils from "lib/utils";
import { PORTAL_WEBCAL } from "lib/api/SERVER";

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_Label,
    id: "m_WorkOrderNo",
    className: "form-control d-block",
    style: { background: "var(--bs-secondary-bg)" },
    renderValue: (v, data) => {
      return (
        <>
          <a
            href={`${PORTAL_WEBCAL}/?page=month&work-order-number=${v}&department=production`}
            target="_blank"
          >
            {v}
          </a>
          <i className="fa-solid fa-arrow-up-right-from-square text-gray-400 ms-2 small"></i>
        </>
      );
    },
  },
  {
    Component: Editable.EF_Input,
    id: "m_CustomerNo",
    disabled: true,
  },
  {
    Component: Editable.EF_Text,
    id: "m_CustomerName",
    rows: 1,
  },
  {
    Component: Editable.EF_Input,
    id: "m_Branch",
    disabled: true,
  },
  {
    Component: Editable.EF_Input,
    id: "m_JobType",
    disabled: true,
  },
  {
    Component: Editable.EF_Input,
    id: "m_Address",
  },
  {
    Component: Editable.EF_Input,
    id: "m_City",
  },
  {
    Component: Editable.EF_Input,
    id: "m_SalesRep",
    disabled: true,
  },
  {
    Component: Editable.EF_Input,
    id: "m_Email",
  },
  {
    Component: Editable.EF_Input,
    id: "m_PhoneNumber",
  },
  {
    Component: Editable.EF_Label,
    id: "m_CompleteDate",
    className: "form-control d-block",
    style: { background: "var(--bs-secondary-bg)" },
    renderValue: (v, data) => {
      return utils.formatDateForMorganLegacy(v);
    },
    placeholder: "-"
  },
  {
    Component: Editable.EF_Label,
    id: "inv_createdAt",
    className: "form-control d-block",
    style: { background: "var(--bs-secondary-bg)" },
    renderValue: (v, data) => {
      return utils.formatDate(v);
    },
    placeholder: "-"
  },
]);

const Com = ({}) => {
  const { data, initData, onChange, checkEditable, validationResult } =
    useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnInputsContainer)}>
      {COMMON_FIELDS?.map((a, i) => {
        const { id, Component, title, overrideOnChange, ...rest } = a;
        if (Component) {
          return <Block inputData={a} key={id}/>;
        }
      })}
    </div>
  );
};

export default Com;
