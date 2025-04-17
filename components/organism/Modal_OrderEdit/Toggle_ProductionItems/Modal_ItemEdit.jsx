import React, { useEffect, useState } from "react";
import constants from "lib/constants";
import cn from "classnames";
import Modal from "components/molecule/Modal";
import Editable from "components/molecule/Editable";
import { ITEM_STATUS, ITEM_LITES, ITEM_DOOR_TYPES } from "lib/constants";
import utils from "lib/utils";

// styles
import styles from "../styles.module.scss";
const WINDOW_FIELDS = constants.applyField([
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
    title: "LBRMin",
    id: "LBRMin",
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

const DOOR_FIELDS = constants.applyField([
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
    Component: Editable.EF_SelectWithLabel,
    id: "DoorType",
    options: ITEM_DOOR_TYPES
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
    Component: Editable.EF_Checkbox_Yesno,
    id: "DoorCutout",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    options: ITEM_STATUS,
    id: "Status",
    sortBy: "sort",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Stock",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "Lites",
    options: ITEM_LITES
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "BTO",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "SlabPrep",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Assembly",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "MillingDept",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "CustomSlabPrep",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "QA",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "CustomMilling",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "TempSlab",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    id: "Painted",
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
    Component: Editable.EF_Rack,
    id: "RackLocation",
    overrideOnChange: (onChange, params) => {
      const [ v, id, o ] = params;
      onChange(v, "RackLocationId");
      onChange(o?.RackNumber, "RackLocation");
    },
  },
  {
    Component: Editable.EF_Input,
    id: "TransomCount",
  },
  {
    Component: Editable.EF_Input,
    id: "SideliteCount",
  },
  {
    Component: Editable.EF_Input,
    id: "SingleDoorCount",
  },
  {
    Component: Editable.EF_Input,
    id: "DoubleDoorCount",
  },
]);

const Com = (props) => {
  const { onHide, initItem, onSave, checkEditable } = props;
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
              isEditable = {checkEditable(a.id)}
            />
          );
        })}
      </div>
      <div className="justify-content-center my-2 flex bg-slate-100 p-2">
        <button className="btn btn-primary px-4" onClick={handleSave} disabled={!checkEditable()}>
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
