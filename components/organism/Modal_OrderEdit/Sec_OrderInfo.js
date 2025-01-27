import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
import constants from "lib/constants";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock, displayFilter } from "./Com";

const COMMON_ITEMS = [
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Branch",
    id: "m_BranchId",
    options: constants.WorkOrderSelectOptions.branches,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Manufacturing Facility",
    id: "m_ManufacturingFacility",
    options: _.keys(constants.ManufacturingFacilities)?.map((k) => ({
      label: k,
      value: k,
      key: k,
    })),
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Shipping Type",
    id: "m_ShippingType",
    options: constants.WorkOrderSelectOptions.shippingTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Residential Type",
    id: "m_ResidentialType",
    options: constants.WorkOrderSelectOptions.residentialTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Job Type",
    id: "m_JobType",
    options: constants.WorkOrderSelectOptions.jobTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Customer Type",
    id: "m_CustomerType",
    options: constants.WorkOrderSelectOptions.customerTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Project",
    id: "m_Project",
    options: constants.WorkOrderSelectOptions.project,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Sales Reps",
    id: "m_SalesRep",
    placeholder: "-",
    options: (dictionary) =>
      dictionary?.salesRepsList?.map((a) => {
        const { name: salesRepName, department, email } = a;

        // some email empty. cant use it as reliable value
        return {
          label: salesRepName,
          value: salesRepName,
          key: salesRepName,
        };
      }),
  },
];

const WINDOW_ITEMS = [
  {
    Component: Editable.EF_Input,
    title: "Window Block NO.",
    id: "w_BlockNo",
  },
  {
    Component: Editable.EF_Input,
    title: "Window Batch NO.",
    id: "w_BatchNo",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Window Glass Supplier",
    id: "w_GlassSupplier",
    options: constants.WorkOrderSelectOptions.glassSuppliers,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Window Glass Option",
    id: "w_GlassOptions",
    options: constants.WorkOrderSelectOptions.glassOptions,
  },
  {
    Component: Editable.EF_Input,
    title: "Window Total Box Qty",
    id: "w_TotalBoxQty",
    className: "text-right",
  },
  {
    Component: Editable.EF_Input,
    title: "Window Glass Qty",
    id: "w_TotalGlassQty",
    className: "text-right",
  },
];

const DOOR_ITEMS = [
  {
    Component: Editable.EF_Input,
    title: "Door Block NO.",
    id: "d_BlockNo",
  },
  {
    Component: Editable.EF_Input,
    title: "Door Batch NO.",
    id: "d_DoorNo",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Door Glass Supplier",
    id: "d_GlassSupplier",
    options: constants.WorkOrderSelectOptions.glassSuppliers,
  },
  {
    Component: Editable.EF_Input,
    title: "Door Total Box Qty",
    id: "d_TotalBoxQty",
    className: "text-right",
  },
  {
    Component: Editable.EF_Input,
    title: "Door Glass Qty",
    id: "d_TotalGlassQty",
    className: "text-right",
  },
];

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, uiOrderType, kind, onHide, dictionary } =
    useContext(LocalDataContext);

  const [doorInputs, setDoorInputs] = useState(null);
  const [windowInputs, setWindowInputs] = useState(null);

  useEffect(() => {
    setDoorInputs(
      displayFilter(DOOR_ITEMS, {
        kind,
        uiOrderType,
      }),
    );

    setWindowInputs(
      displayFilter(WINDOW_ITEMS, {
        kind,
        uiOrderType,
      }),
    );
  }, [kind, uiOrderType]);

  return (
    <>
      <div className={cn(styles.columnInputsContainer)}>
        {COMMON_ITEMS?.map((a) => {
          return <Block key={a.id} inputData={a} />;
        })}
      </div>
      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label className="text-sky-600">Window</label>
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
            <label className="text-sky-600">Door</label>
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
  const { data, onChange, isEditable, dictionary } =
    useContext(LocalDataContext);
  let { Component, title, id, options, ...rest } = inputData;
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
          onChange={(v) => onChange(v, id)}
          disabled={!isEditable}
          options={options}
          {...rest}
        />
      </div>
    </DisplayBlock>
  );
};

export default Com;
