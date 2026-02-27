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
const ComFetchButton = React.memo(({ fieldCode }) => {
  const { onGetWindowMaker_comment, checkEditable } =
    useContext(LocalDataContext);
  const disabled = !checkEditable({ fieldCode });
  return (
    <i
      className={cn("fa-solid fa-arrows-rotate", {
        [styles.iconFetchButton]: true,
        [styles.disabled]: disabled,
      })}
      title = {"Fill From Windowmaker"}
      onClick={() => (disabled ? null : onGetWindowMaker_comment())}
    />
  );
});

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_Text,
    fieldCode: "m_CustomerName",
    rows: 1,
  },
  {
    Component: Editable.EF_Text,
    fieldCode: "m_ProjectName",
    rows: 1,
  },
  {
    Component: Editable.EF_Text,
    fieldCode: "m_Address",
    rows: 1,
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_City",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_Email",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_PhoneNumber",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_OtherContactNumber",
  },
  {
    Component: Editable.EF_SelectEmployee,
    fieldCode: "m_ProjectManager",
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
    fieldCode: "m_SiteContact",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_SiteContactPhoneNumber",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "m_SiteContactEmail",
  },
  {
    Component: Editable.EF_Input,
    title: (
      <span>
        Comment <ComFetchButton fieldCode="m_Comment_1" />
      </span>
    ),
    fieldCode: "m_Comment_1",
  },
  {
    Component: Editable.EF_Community,
    fieldCode: "m_Community",
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
        const { fieldCode, Component, title, overrideOnChange, ...rest } = a;
        const addon = checkAddOnField({ id: fieldCode });
        const addonClass = addon?.isSyncedFromParent
          ? styles.addonSync_input
          : "";

        const field = fieldCode

        return (
          <DisplayBlock fieldCode={fieldCode} key={field}>
            <label>{title}</label>
            <div>
              <Component
                id={field}
                value={data?.[field] || ""}
                initValue={initData?.[field] || ""}
                isHighlightDiff
                onChange={(v, ...o) => {
                  if (typeof overrideOnChange === "function") {
                    overrideOnChange(onChange, [v, ...o]);
                  } else {
                    onChange(v, field);
                  }
                }}
                errorMessage={validationResult?.[field]}
                disabled={!checkEditable({ fieldCode })}
                className={cn(addonClass)}
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
