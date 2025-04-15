import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";

const COMMON_FIELDS = constants.applyField([
  {
    Component: Editable.EF_Input,
    id: "m_SiteContact",
  },
  {
    Component: Editable.EF_Input,
    id: "m_SiteContactPhoneNumber",
  },
  {
    Component: Editable.EF_Input,
    id: "m_SiteContactEmail",
  },
  {
    Component: Editable.EF_Text,
    id: "m_CustomerName",
    rows: 1,
  },
  {
    Component: Editable.EF_Text,
    id: "m_ProjectName",
    rows: 1,
  },
  {
    Component: Editable.EF_SelectEmployee,
    id: "m_ProjectManager",
    placeholder: "-",
    group: "projectManagerList",
    overrideOnChange: (onChange, params) => {
      const [v, id, o] = params;
      onChange(v, "m_ProjectManager");
      onChange(o?.name, "m_ProjectManagerName");
    },
  },
  {
    Component: Editable.EF_Input,
    id: "m_Comment_1",
  },
  {
    Component: Editable.EF_Input,
    id: "m_City",
  },
  {
    Component: Editable.EF_Text,
    id: "m_Address",
    rows: 1,
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
    Component: Editable.EF_Input,
    id: "m_OtherContactNumber",
  },
  {
    Component: Editable.EF_Community,
    id: "m_Community",
  },
]);

const Com = ({}) => {
  const { data, onChange, isEditable } = useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnInputsContainer)}>
      {COMMON_FIELDS?.map((a, i) => {
        const { id, Component, title, overrideOnChange, ...rest } = a;

        return (
          <DisplayBlock id={id} key={id}>
            <label>{title}</label>
            <div>
              <Component
                id={id}
                value={data?.[id] || ""}
                onChange={(v, ...o) => {
                  if (typeof overrideOnChange === "function") {
                    overrideOnChange(onChange, [v, ...o]);
                  } else {
                    onChange(v, id);
                  }
                }}
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
