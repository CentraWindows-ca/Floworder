import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import {labelMapping, applyField} from "lib/constants/production_constants_labelMapping";

import { getIsRequired } from "./hooks/vconfig";
import { Block } from "./Com";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, GeneralContext } from "./LocalDataProvider";

import { DisplayBlock, displayFilter } from "./Com";

const COMMON_FIELDS = applyField([
  {
    fieldCode: "m_ShippingStartDate",
  },
  {
    fieldCode: "m_ShippedDate",
  },
  {
    fieldCode: "m_RevisedDeliveryDate",
  },
  {
    fieldCode: "m_TransferredDate",
    displayId: "m_TransferredDate_display"
  },
  {
    fieldCode: "m_TransferredLocation",
    displayId: "m_TransferredLocation_display",
    Component: Editable.EF_SelectWithLabel,
    options: constants.WorkOrderSelectOptions.branches,
  },
]);
const WINDOW_FIELDS = applyField([
  {
    fieldCode: "w_CustomerDate",
  },
  {
    fieldCode: "w_ProductionStartDate",
    disabledCloseButton: true,
  },
  {
    fieldCode: "w_PaintStartDate",
  },
  {
    fieldCode: "w_GlassOrderDate",
  },
  {
    fieldCode: "w_GlassRecDate",
  },
]);
const DOOR_FIELDS = applyField([
  {
    fieldCode: "d_CustomerDate",
  },
  {
    fieldCode: "d_ProductionStartDate",
    disabledCloseButton: true,
  },
  {
    fieldCode: "d_PaintStartDate",
  },
  {
    fieldCode: "d_GlassOrderDate",
  },
]);

const Com = ({}) => {
  const { permissions } = useContext(GeneralContext);
  const { kind, uiOrderType } = useContext(LocalDataContext);

  const [doorInputs, setDoorInputs] = useState(null);
  const [windowInputs, setWindowInputs] = useState(null);

  useEffect(() => {
    setDoorInputs(
      displayFilter(DOOR_FIELDS, {
        kind,
        uiOrderType,
        permissions
      }),
    );

    setWindowInputs(
      displayFilter(WINDOW_FIELDS, {
        kind,
        uiOrderType,
        permissions
      }),
    );
  }, [kind, uiOrderType]);

  return (
    <>
      <div className={cn(styles.columnScheduledContainer)}>
        {COMMON_FIELDS?.map((a) => {
          const { title, fieldCode } = a;
          return <DisplayDate key={fieldCode} {...a} />;
        })}
      </div>

      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Windows</label>
          </div>
          <div className={cn(styles.columnScheduledContainer)}>
            {windowInputs?.map((a) => {
              const { title, fieldCode } = a;
              return <DisplayDate key={fieldCode} {...a} />;
            })}
          </div>
        </>
      )}

      {!_.isEmpty(doorInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Doors</label>
          </div>
          <div className={cn(styles.columnScheduledContainer)}>
            {doorInputs?.map((a) => {
              const { title, fieldCode } = a;
              return <DisplayDate key={fieldCode} {...a} />;
            })}
          </div>
        </>
      )}
    </>
  );
};

const DisplayDate = (props) => {
  const { fieldCode, displayId, title, Component, className, ...rest } = props
  const { data, initData, onChange, validationResult, checkEditable, checkAddOnField } =
    useContext(LocalDataContext);

  const field = fieldCode

  const className_required = getIsRequired(initData, fieldCode) && "required";
  const addon = checkAddOnField({ id: fieldCode });
  const addonClass = addon?.isSyncedFromParent ? styles.addonSync_input : "";


  if (Component) {
    return (
      <Block
        className_input={cn(
          styles.columnScheduledInput,
          "justify-content-end align-items-center flex",
          className_required,
        )}
        inputData={props}
      />
    );
  }
  return (
    <DisplayBlock fieldCode={displayId || fieldCode}>
      <label
        className={cn(
          "justify-content-start align-items-center flex",
          className_required,
        )}
      >
        {title}
      </label>
      <div className="justify-content-end align-items-center flex">
        <Editable.EF_DateOnly
          k={field}
          id={field}
          value={data?.[field]}
          initValue={initData?.[field]}
          isHighlightDiff
          onChange={(v) => {
            onChange(v, field);
          }}
          disabled={!checkEditable({ fieldCode })}
          errorMessage={validationResult?.[field]}
          className={cn(className, addonClass)}
          {...rest}
        />
      </div>
    </DisplayBlock>
  );
};

export default Com;
