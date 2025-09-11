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
    id: "m_ShippingStartDate",
  },
  {
    id: "m_ShippedDate",
  },
  {
    id: "m_RevisedDeliveryDate",
  },
  {
    id: "m_TransferredDate",
    displayId: "m_TransferredDate_display"
  },
  {
    id: "m_TransferredLocation",
    displayId: "m_TransferredLocation_display",
    Component: Editable.EF_SelectWithLabel,
    options: constants.WorkOrderSelectOptions.branches,
  },
]);
const WINDOW_FIELDS = constants.applyField([
  {
    id: "w_CustomerDate",
  },
  {
    id: "w_ProductionStartDate",
    disabledCloseButton: true,
  },
  {
    id: "w_PaintStartDate",
  },
  {
    id: "w_GlassOrderDate",
  },
  {
    id: "w_GlassRecDate",
  },
]);
const DOOR_FIELDS = constants.applyField([
  {
    id: "d_CustomerDate",
  },
  {
    id: "d_ProductionStartDate",
    disabledCloseButton: true,
  },
  {
    id: "d_PaintStartDate",
  },
  {
    id: "d_GlassOrderDate",
  },
]);

const Com = ({}) => {
  const { kind, uiOrderType, permissions } = useContext(LocalDataContext);

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
          const { title, id } = a;
          return <DisplayDate key={id} {...a} />;
        })}
      </div>

      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Windows</label>
          </div>
          <div className={cn(styles.columnScheduledContainer)}>
            {windowInputs?.map((a) => {
              const { title, id } = a;
              return <DisplayDate key={id} {...a} />;
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
              const { title, id } = a;
              return <DisplayDate key={id} {...a} />;
            })}
          </div>
        </>
      )}
    </>
  );
};

const DisplayDate = (props) => {
  const { id, displayId, title, Component, className, ...rest } = props
  const { data, initData, onChange, validationResult, checkEditable, checkAddOnField } =
    useContext(LocalDataContext);

  const className_required = getIsRequired(initData, id) && "required";
  const addon = checkAddOnField({ id });
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
    <DisplayBlock id={displayId || id}>
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
          k={id}
          id={id}
          value={data?.[id]}
          initValue={initData?.[id]}
          isHighlightDiff
          onChange={(v) => {
            onChange(v, id);
          }}
          disabled={!checkEditable({ id })}
          errorMessage={validationResult?.[id]}
          className={cn(className, addonClass)}
          {...rest}
        />
      </div>
    </DisplayBlock>
  );
};

export default Com;
