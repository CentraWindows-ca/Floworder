import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import {
  labelMapping,
  applyField,
  spreadFacilities,
} from "lib/constants/production_constants_labelMapping";

import { formatCurrency2Decimal } from "lib/utils";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, GeneralContext } from "./LocalDataProvider";

import { displayFilter, Block } from "./Com";

const ComFetchButton = React.memo(({ kind, id }) => {
  const { onGetWindowMaker_batchNo, checkEditable } =
    useContext(LocalDataContext);
  const disabled = !checkEditable({ fieldCode: id });
  return (
    <i
      className={cn("fa-solid fa-arrows-rotate", {
        [styles.iconFetchButton]: true,
        [styles.disabled]: disabled,
      })}
      title={"Fill From Windowmaker"}
      onClick={() => (disabled ? null : onGetWindowMaker_batchNo(kind))}
    />
  );
});

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "m_BranchId",
    options: constants.WorkOrderSelectOptions.branches,
    overrideOnChange: (onChange, params) => {
      const [v, id, o] = params;
      onChange(v, "m_BranchId");
      onChange(o?.label, "m_Branch");
    },
  },
  // {
  //   Component: Editable.EF_SelectWithLabel,
  //   fieldCode: "m_ManufacturingFacility",
  //   options: _.keys(constants.ManufacturingFacilities)?.map((k) => ({
  //     label: k,
  //     value: k,
  //     key: k,
  //   })),
  // },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "m_ShippingType",
    options: constants.WorkOrderSelectOptions.shippingTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "m_ResidentialType",
    options: constants.WorkOrderSelectOptions.residentialTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "m_JobType",
    options: constants.WorkOrderSelectOptions.jobTypes,
  },
  !constants.DEV_HOLDING_FEATURES.v20251210_ordertype && {
    Component: Editable.EF_Label_Disabled,
    fieldCode: "m_OrderType",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "m_CustomerType",
    options: constants.WorkOrderSelectOptions.customerTypes,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "m_Project",
    options: constants.WorkOrderSelectOptions.project,
  },
  {
    Component: Editable.EF_SelectEmployee,
    fieldCode: "m_SalesRepKeyAccount",
    placeholder: "-",
    overrideOnChange: (onChange, params) => {
      const [v, id, o] = params;
      onChange(v, "m_SalesRepKeyAccount");
      onChange(o?.name, "m_SalesRep");
    },
  },
  {
    Component: Editable.EF_Label_Disabled,
    className: "text-end",
    renderValue: (v, data) => {
      return formatCurrency2Decimal(v);
    },
    fieldCode: "m_PriceBeforeTax",
  },
]);

const WINDOW_FIELDS = applyField([
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "w_ManufacturingFacility",
    placeholder: "-",
    options: _.keys(constants.ManufacturingFacilities)?.map((k) => ({
      label: k,
      value: k,
      key: k,
    })),
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "w_BlockNo",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "w_BatchNo",
    title: (a) => (
      <span>
        Windows Batch NO. <ComFetchButton kind={"w"} fieldCode={a.fieldCode} />
      </span>
    ),
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "w_GlassSupplier",
    options: (dictionary) => {
      return dictionary?.glassSupplierList?.map((a) => ({
        key: a.key,
        label: a.label,
      }));
    },
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "w_GlassOptions",
    options: (dictionary) => {
      return dictionary?.glassOptionList?.map((a) => ({
        key: a.key,
        label: a.label,
      }));
    },
  },
]);

const DOOR_FIELDS = applyField([
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "d_ManufacturingFacility",
    placeholder: "-",
    options: _.keys(constants.ManufacturingFacilities)?.map((k) => ({
      label: k,
      value: k,
      key: k,
    })),
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "d_BlockNo",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "d_BatchNo",
    title: (a) => (
      <span>
        Doors Batch NO. <ComFetchButton kind="d" fieldCode={a.fieldCode} />
      </span>
    ),
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "d_GlassSupplier",
    options: (dictionary) => {
      return dictionary?.glassSupplierList?.map((a) => ({
        key: a.key,
        label: a.label,
      }));
    },
  },
]);

const Com = ({}) => {
  const { permissions } = useContext(GeneralContext);
  const { uiOrderType, kind, initData, initWithOriginalStructure } = useContext(LocalDataContext);

  const [doorInputs, setDoorInputs] = useState(null);
  const [windowInputs, setWindowInputs] = useState(null);
  const [masterInputs, setMasterInputs] = useState(null)

  useEffect(() => {
    let _doorFields = displayFilter(DOOR_FIELDS, {
      kind,
      uiOrderType,
      permissions,
      initWithOriginalStructure
    });
    // spread to different facilities [{facility: "", fields: [], facilityRoleType: ""}]
    _doorFields = spreadFacilities(_doorFields, initWithOriginalStructure)?.facilities;

    console.log(initWithOriginalStructure)
    setDoorInputs(_doorFields);

    let _windowFields = displayFilter(WINDOW_FIELDS, {
      kind,
      uiOrderType,
      permissions,
      initWithOriginalStructure
    });
    _windowFields = spreadFacilities(_windowFields, initWithOriginalStructure)?.facilities;
    setWindowInputs(_windowFields);

    const _masterFields = spreadFacilities(COMMON_FIELDS, initWithOriginalStructure)?.master
    setMasterInputs(_masterFields)
  }, [kind, uiOrderType]);

  return (
    <>
      <div className={cn(styles.columnInputsContainer)}>
        {masterInputs?.map((a) => {
          return <Block key={a.fieldCode} inputData={a} />;
        })}
      </div>

      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Windows</label>
          </div>
          {windowInputs
            ?.map((fac) => {
              const { facility, fields } = fac;
              return (
                <React.Fragment key={`w_${facility}`}>
                  <div className={cn(styles.columnFacility)}>
                    <span>{facility}</span>
                  </div>
                  <div className={cn(styles.columnInputsContainer)}>
                    {fields?.map((a) => {
                      return <Block key={a.field} inputData={a} />;
                    })}
                  </div>
                </React.Fragment>
              );
            })}
        </>
      )}
      {!_.isEmpty(doorInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Doors</label>
          </div>
          {doorInputs
            ?.map((fac) => {
              const { facility, fields } = fac;
              return (
                <React.Fragment key={`d_${facility}`}>
                  <div className={cn(styles.columnFacility)}>
                    <span>{facility}</span>
                  </div>
                  <div className={cn(styles.columnInputsContainer)}>
                    {fields?.map((a) => {
                      return <Block key={a.field} inputData={a} />;
                    })}
                  </div>
                </React.Fragment>
              );
            })}
        </>
      )}
    </>
  );
};

export default Com;
