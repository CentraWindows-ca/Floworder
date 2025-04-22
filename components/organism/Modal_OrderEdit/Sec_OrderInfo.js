import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock, displayFilter } from "./Com";

const group = 'information'

const COMMON_FIELDS = constants.applyField([
  {
    Component: Editable.EF_SelectWithLabel,
    id: "m_BranchId",
    options: constants.WorkOrderSelectOptions.branches,
    overrideOnChange: (onChange, params) => {
      const [v, id, o] = params;
      onChange(v, "m_BranchId");
      onChange(o?.label, "m_Branch");
    },
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "m_ManufacturingFacility",
    options: _.keys(constants.ManufacturingFacilities)?.map((k) => ({
      label: k,
      value: k,
      key: k,
    })),
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "m_ShippingType",
    options: constants.WorkOrderSelectOptions.shippingTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "m_ResidentialType",
    options: constants.WorkOrderSelectOptions.residentialTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "m_JobType",
    options: constants.WorkOrderSelectOptions.jobTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "m_CustomerType",
    options: constants.WorkOrderSelectOptions.customerTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "m_Project",
    options: constants.WorkOrderSelectOptions.project,
  },
  {
    Component: Editable.EF_SelectEmployee,
    id: "m_SalesRepKeyAccount",
    placeholder: "-",
    overrideOnChange: (onChange, params) => {
      const [v, id, o] = params;
      onChange(v, "m_SalesRepKeyAccount");
      onChange(o?.name, "m_SalesRep");
    },
  },
]);

const WINDOW_FIELDS = constants.applyField([
  {
    Component: Editable.EF_Input,
    id: "w_BlockNo",
  },
  {
    Component: Editable.EF_Input,
    id: "w_BatchNo",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "w_GlassSupplier",
    options: (dictionary) => {
      return dictionary?.glassSupplierList?.map((a) => ({
        key: a.key,
        label: a.label,
      }));
    },
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "w_GlassOptions",
    options: (dictionary) => {
      return dictionary?.glassOptionList?.map((a) => ({
        key: a.key,
        label: a.label,
      }));
    },
  },
]);

const DOOR_FIELDS = constants.applyField([
  {
    Component: Editable.EF_Input,
    id: "d_BlockNo",
  },
  {
    Component: Editable.EF_Input,
    id: "d_BatchNo",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "d_GlassSupplier",
    options: (dictionary) => {
      return dictionary?.glassSupplierList?.map((a) => ({
        key: a.key,
        label: a.label,
      }));
    },
  },
]);

const Com = ({}) => {
  const { uiOrderType, kind } = useContext(LocalDataContext);

  const [doorInputs, setDoorInputs] = useState(null);
  const [windowInputs, setWindowInputs] = useState(null);

  useEffect(() => {
    setDoorInputs(
      displayFilter(DOOR_FIELDS, {
        kind,
        uiOrderType,
      }),
    );

    setWindowInputs(
      displayFilter(WINDOW_FIELDS, {
        kind,
        uiOrderType,
      }),
    );
  }, [kind, uiOrderType]);

  return (
    <>
      <div className={cn(styles.columnInputsContainer)}>
        {COMMON_FIELDS?.map((a) => {
          return <Block key={a.id} inputData={a} />;
        })}
      </div>
      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Windows</label>
          </div>
          <div className={cn(styles.columnInputsContainer)}>
            {windowInputs?.map((a) => {
              return <Block key={a.id} inputData={a} />;
            })}
          </div>
        </>
      )}
      {!_.isEmpty(doorInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Doors</label>
          </div>
          <div className={cn(styles.columnInputsContainer)}>
            {doorInputs?.map((a) => {
              return <Block key={a.id} inputData={a} />;
            })}
          </div>
        </>
      )}
    </>
  );
};

const Block = ({ inputData }) => {
  const { data, initData, onChange, checkEditable, dictionary } =
    useContext(LocalDataContext);
  let { Component, title, id, options, overrideOnChange, ...rest } = inputData;
  if (typeof options === "function") {
    options = options(dictionary);
  }

  return (
    <DisplayBlock id={id}>
      <label>{title}</label>
      <div>
        <Component
          id={id}
          value={data?.[id]}
          initValue={initData?.[id]}
          isHighlightDiff
          onChange={(v, ...o) => {
            if (typeof overrideOnChange === "function") {
              overrideOnChange(onChange, [v, ...o]);
            } else {
              onChange(v, id);
            }
          }}
          disabled={!checkEditable({ id, group })}
          options={options}
          {...rest}
        />
      </div>
    </DisplayBlock>
  );
};

export default Com;
