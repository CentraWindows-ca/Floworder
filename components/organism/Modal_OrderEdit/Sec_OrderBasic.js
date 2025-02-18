import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
import constants from "lib/constants";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";

const LIST = [
  {
    Component: Editable.EF_Input,
    title: "Site Contact",
    id: "m_SiteContact",
  },
  {
    Component: Editable.EF_Input,
    title: "Site Contact Number",
    id: "m_SiteContactPhoneNumber",
  },
  {
    Component: Editable.EF_Input,
    title: "Site Contact Email",
    id: "m_SiteContactEmail",
  },
  {
    Component: Editable.EF_Text,
    title: "Customer Name",
    id: "m_CustomerName",
    rows: 1,
  },
  {
    Component: Editable.EF_Text,
    title: "Project Name",
    id: "m_ProjectName",
    rows: 1,
  },
  {
    Component: Editable.EF_Input,
    title: "Project Manager",
    id: "m_ProjectManager",
  },
  {
    Component: Editable.EF_Input,
    title: "Comment",
    id: "m_Comment_1",
  },
  {
    Component: Editable.EF_Input,
    title: "City",
    id: "m_City",
  },
  {
    Component: Editable.EF_Text,
    title: "Address",
    id: "m_Address",
    rows: 1,
  },
  {
    Component: Editable.EF_Input,
    title: "Email",
    id: "m_Email",
  },
  {
    Component: Editable.EF_Input,
    title: "Phone Number",
    id: "m_PhoneNumber",
  },
  {
    Component: Editable.EF_Input,
    title: "Other Contact Number",
    id: "m_OtherContactNumber",
  },
];

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, onHide, dictionary } =
    useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnInputsContainer)}>
      {LIST?.map((a, i) => {
        const { id, Component, title, ...rest } = a;
        return (
          <DisplayBlock id={id} key={id}>
            <label>{title}</label>
            <div>
              <Component
                id={id}
                value={data?.[id] || ""}
                onChange={(v) => onChange(v, id)}
                disabled={!isEditable}
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
