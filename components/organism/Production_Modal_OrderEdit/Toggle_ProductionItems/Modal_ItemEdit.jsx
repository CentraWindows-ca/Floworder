import React, { useEffect, useState, useContext } from "react";
import constants from "lib/constants";
import {labelMapping, applyField} from "lib/constants/production_constants_labelMapping";

import cn from "classnames";
import Modal from "components/molecule/Modal";
import Editable from "components/molecule/Editable";
import { ITEM_STATUS, ITEM_LITES, ITEM_DOOR_TYPES } from "lib/constants";
import { LocalDataContext } from "../LocalDataProvider";
import utils from "lib/utils";

// styles
import styles from "../styles.module.scss";
const WINDOW_FIELDS = applyField([
  {
    Component: Editable.EF_Label,
    id: "Item",
  },
  {
    Component: Editable.EF_Label,
    id: "System",
  },
  {
    Component: Editable.EF_Label,
    id: "Description",
  },
  {
    Component: Editable.EF_Label,
    id: "Size",
  },
  {
    Component: Editable.EF_Label,
    id: "Quantity",
  },
  {
    Component: Editable.EF_Label,
    id: "SubQty",
  },
  {
    Component: Editable.EF_Text,
    id: "Notes",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    options: ITEM_STATUS,
    id: "Status",
    sortBy: "sort",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "BTO",
  },
    {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Multipoint",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "HighRisk",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Custom",
  },
  {
    Component: Editable.EF_Input,
    id: "BoxQty",
  },
  {
    Component: Editable.EF_Input,
    id: "GlassQty",
  },
  {
    Component: Editable.EF_Input,
    id: "LBRMin",
  },
  {
    Component: Editable.EF_Label,
    id: "Nett",
  },
  {
    Component: Editable.EF_Rack,
    id: "RackLocationId",
    overrideOnChange: (onChange, params) => {
      const [ v, id, o ] = params;
      onChange(v, "RackLocationId");
      onChange(o?.RackNumber, "RackLocation");
    },
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "RBMIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Wraped",
  },

  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "PaintLineal",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Painted",
  },
]);

const TEMPORARY_DISABLE_FOR_FIX = true

const DOOR_FIELDS = applyField([
  {
    Component: Editable.EF_Label,
    id: "Item",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Label,
    id: "System",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Label,
    id: "Description",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "DoorType",
    options: ITEM_DOOR_TYPES,
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Label,
    id: "Size",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Label,
    id: "Quantity",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Label,
    id: "SubQty",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Text,
    id: "Notes",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "DoorCutout",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_SelectWithLabel,
    options: ITEM_STATUS,
    id: "Status",
    sortBy: "sort",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Stock",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "Lites",
    options: ITEM_LITES,
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "BTO",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "SlabPrep",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Assembly",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "MillingDept",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "CustomSlabPrep",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "QA",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "CustomMilling",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "TempSlab",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Painted",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Input,
    id: "BoxQty",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Input,
    id: "GlassQty",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Input,
    id: "LBRMin",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Label,
    id: "Nett",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Rack,
    id: "RackLocation",
    overrideOnChange: (onChange, params) => {
      const [ v, id, o ] = params;
      onChange(v, "RackLocationId");
      onChange(o?.RackNumber, "RackLocation");
    },
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Input,
    id: "TransomCount",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Input,
    id: "SideliteCount",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Input,
    id: "SingleDoorCount",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
  {
    Component: Editable.EF_Input,
    id: "DoubleDoorCount",
    disabled: TEMPORARY_DISABLE_FOR_FIX
  },
]);

const Com = (props) => {
  const { checkEditable } = useContext(LocalDataContext);
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

  const fields = item?.kind === 'w' ? WINDOW_FIELDS : DOOR_FIELDS

  const _editgroup = {
    "w": "windowitems",
    "d": "dooritems"
  }

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
        {fields?.map((a) => {
          return (
            <Block
              item={item}
              setItem={setItem}
              key={`item_${a.id}`}
              inputData={a}
              isEditable = {!a.disabled && checkEditable({group: _editgroup[item?.kind]})}
            />
          );
        })}
      </div>
      <div className="justify-content-center my-2 flex bg-slate-100 p-2">
        <button className="btn btn-primary px-4" onClick={handleSave} disabled={!checkEditable({group: _editgroup[item?.kind]})}>
          Save
        </button>
      </div>
    </Modal>
  );
};

const Block = ({ item, setItem, inputData, isEditable }) => {
  let { Component, title, id, options, overrideOnChange, ...rest } = inputData;
  const handleChange = (v, id) => {
    setItem((prev) => ({
      ...prev,
      [id]: v,
    }));
  };

  return (
    <div className={styles.itemRow} id={id}>
      <label>{title}</label>
      <div className={styles.columnInput}>
        <Component
          id={id}
          value={item?.[id]}
          onChange={(v, ...o) => {
            if (typeof overrideOnChange === "function") {
              overrideOnChange(handleChange, [v, ...o]);
            } else {
              handleChange(v, id);
            }
          }}
          options={options}
          disabled = {!isEditable}
          {...rest}
        />
      </div>
    </div>
  );
};


export default Com;
