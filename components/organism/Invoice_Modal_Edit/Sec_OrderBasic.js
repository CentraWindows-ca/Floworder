import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import {applyField} from "lib/constants/production_constants_labelMapping";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_Text,
    id: "m_CustomerName",
    rows: 1,
  },
  {
    Component: Editable.EF_Input,
    id: "m_OtherContactNumber",
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
    id: "m_SiteContact",
  },
]);

const Com = ({}) => {
  const { data, initData, onChange, checkEditable,validationResult} = useContext(LocalDataContext);

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
                initValue = {initData?.[id] || ""}
                isHighlightDiff
                onChange={(v, ...o) => {
                  if (typeof overrideOnChange === "function") {
                    overrideOnChange(onChange, [v, ...o]);
                  } else {
                    onChange(v, id);
                  }
                }}
                errorMessage = {validationResult?.[id]}
                disabled={!checkEditable({id})}
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
