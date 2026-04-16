import React, { useEffect, useState, useContext, useMemo } from "react";
import {
  labelMapping,
  applyField,
} from "lib/constants/production_constants_labelMapping";

import cn from "classnames";
import Modal from "components/molecule/Modal";
import Editable from "components/molecule/Editable";
import {
  ITEM_STATUS,
  ITEM_FACILITY,
  ITEM_LITES,
  ITEM_DOOR_TYPES,
} from "lib/constants";
import { LocalDataContext } from "../LocalDataProvider";
import { GeneralContext } from "lib/provider/GeneralProvider";

import utils from "lib/utils";

// styles
import styles from "../styles.module.scss";
import { displayFilterForProductItems } from "../Com";

export const getFacilityExclude = (system, dictionary) => {
  const acceptFacilities = dictionary?.facilitySystemCodeList?.[system] || [""];
  const hasAnyValidFacility = ITEM_FACILITY.some((fac) => fac.key !== "" && acceptFacilities.includes(fac.key));
  return ITEM_FACILITY.reduce((acc, fac) => {
    if (fac.key === "") {
      if (hasAnyValidFacility) acc[fac.key] = true;
    } else if (acceptFacilities && !acceptFacilities.includes(fac.key)) {
      acc[fac.key] = true;
    }
    return acc;
  }, {});
};

export const getFacilityError = (value, system, dictionary) => {
  const acceptFacilities = dictionary?.facilitySystemCodeList?.[system];
  if (value && !acceptFacilities?.includes(value)) {
    return <span className="text-danger text-xs">Not available in {value}</span>;
  }
  return null;
};

const WINDOW_FIELDS = applyField([
  {
    Component: Editable.EF_Label,
    fieldCode: "Item",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    options: ITEM_FACILITY,
    fieldCode: "Facility",
    sortBy: "sort",
    getProps: (item, dictionary) => ({ exclude: getFacilityExclude(item?.System, dictionary) }),
    renderAfter: (item, dictionary) => getFacilityError(item?.Facility, item?.System, dictionary),
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "System",
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "Description",
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "Size",
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "Quantity",
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "SubQty",
  },
  {
    Component: Editable.EF_Text,
    fieldCode: "Notes",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    options: ITEM_STATUS,
    fieldCode: "Status",
    sortBy: "sort",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "BTO",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "Multipoint",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "HighRisk",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "Custom",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "BoxQty",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "GlassQty",
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "LBRMin",
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "Nett",
  },
  {
    Component: Editable.EF_Rack,
    fieldCode: "RackLocationId",
    overrideOnChange: (onChange, params) => {
      const [v, id, o] = params;
      onChange(v, "RackLocationId");
      onChange(o?.RackNumber, "RackLocation");
    },
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "RBMIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "Wraped",
  },

  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "PaintLineal",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "Painted",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "Shaped",
    //  disabled: true, // 20260406: not editable from OM
  },
]);

const TEMPORARY_DISABLE_FOR_FIX = false;

const DOOR_FIELDS = applyField([
  {
    Component: Editable.EF_Label,
    fieldCode: "Item",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    options: ITEM_FACILITY,
    fieldCode: "Facility",
    sortBy: "sort",
    getProps: (item, dictionary) => ({ exclude: getFacilityExclude(item?.System, dictionary) }),
    renderAfter: (item, dictionary) => getFacilityError(item?.Facility, item?.System, dictionary),
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "System",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "Description",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "DoorType",
    options: ITEM_DOOR_TYPES,
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "Size",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "Quantity",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "SubQty",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Text,
    fieldCode: "Notes",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "DoorCutout",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    options: ITEM_STATUS,
    fieldCode: "Status",
    sortBy: "sort",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "Stock",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_SelectWithLabel,
    fieldCode: "Lites",
    options: ITEM_LITES,
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "BTO",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "SlabPrep",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "Assembly",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "MillingDept",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "CustomSlabPrep",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "QA",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "CustomMilling",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "TempSlab",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "Painted",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "BoxQty",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "GlassQty",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "LBRMin",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Label,
    fieldCode: "Nett",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Rack,
    fieldCode: "RackLocation",
    overrideOnChange: (onChange, params) => {
      const [v, id, o] = params;
      onChange(v, "RackLocationId");
      onChange(o?.RackNumber, "RackLocation");
    },
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "TransomCount",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "SideliteCount",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "SingleDoorCount",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Input,
    fieldCode: "DoubleDoorCount",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    fieldCode: "Shaped",
    disabled: TEMPORARY_DISABLE_FOR_FIX,
  },
]);

const Com = (props) => {
  const { checkEditable, dictionary } = useContext(LocalDataContext);
  const { permissions } = useContext(GeneralContext);
  const { onHide, initItem, onSave } = props;
  const [item, setItem] = useState(null);

  useEffect(() => {
    if (initItem?.Id) {
      setItem(initItem);
    } else {
      setItem(null);
    }
  }, [initItem?.Id]);

  const handleSave = async () => {
    const changedData = utils.findChanges(initItem, item);
    onSave(initItem?.Id, changedData, item?.kind, initItem);
    setItem(null);
    onHide();
  };

  const fields = item?.kind === "w" ? WINDOW_FIELDS : DOOR_FIELDS;

  const _filteredFields = useMemo(
    () =>
      displayFilterForProductItems(fields, {
        permissions,
      }),
    [fields, permissions],
  );

  const _editgroup = {
    w: "windowitems",
    d: "dooritems",
  };

  return (
    <Modal
      show={initItem}
      size="lg"
      onHide={onHide}
      fullscreen={false}
      title={`Item: ${item?.Item}`}
      layer={1}
    >
      <div className={cn(styles.columnItemInputsContainer)}>
        {_filteredFields?.map((a) => {
          return (
            <Block
              item={item}
              setItem={setItem}
              key={`item_${a.fieldCode}`}
              inputData={a}
              isEditable={
                !a.disabled && checkEditable({ group: _editgroup[item?.kind] })
              }
              dictionary={dictionary}
            />
          );
        })}
      </div>
      <div className="justify-content-center my-2 flex bg-slate-100 p-2">
        <button
          className="btn btn-primary px-4"
          onClick={handleSave}
          disabled={!checkEditable({ group: _editgroup[item?.kind] })}
        >
          Save
        </button>
      </div>
    </Modal>
  );
};

const Block = ({ item, setItem, inputData, isEditable, dictionary }) => {
  let { Component, title, fieldCode, options, overrideOnChange, getProps, renderAfter, ...rest } = inputData;

  const field = fieldCode;
  const dynamicProps = getProps ? getProps(item, dictionary) : {};
  const extraContent = renderAfter ? renderAfter(item, dictionary) : null;

  const handleChange = (v, field) => {
    setItem((prev) => ({
      ...prev,
      [field]: v,
    }));
  };

  return (
    <div className={styles.itemRow} id={field}>
      <label>{title}</label>
      <div className={styles.columnInput}>
        <Component
          id={field}
          value={item?.[field]}
          onChange={(v, ...o) => {
            if (typeof overrideOnChange === "function") {
              overrideOnChange(handleChange, [v, ...o]);
            } else {
              handleChange(v, field);
            }
          }}
          options={options}
          disabled={!isEditable}
          {...rest}
          {...dynamicProps}
        />
        {extraContent}
      </div>
    </div>
  );
};

export default Com;
