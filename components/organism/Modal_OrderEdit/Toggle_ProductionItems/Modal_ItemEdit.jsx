import React, { useEffect, useState } from "react";
import cn from "classnames";
import Modal from "components/molecule/Modal";
import Editable from "components/molecule/Editable";
import { ITEM_STATUS, ITEM_LITES, ITEM_DOOR_TYPES } from "lib/constants";
import utils from "lib/utils";

// styles
import styles from "../styles.module.scss";
const WINDOW_FIELDS = [
  {
    Component: Editable.EF_Label,
    title: "Item",
    id: "Item",
  },
  {
    Component: Editable.EF_Label,
    title: "System",
    id: "System",
  },
  {
    Component: Editable.EF_Label,
    title: "Description",
    id: "Description",
  },
  {
    Component: Editable.EF_Label,
    title: "Size",
    id: "Size",
  },
  {
    Component: Editable.EF_Label,
    title: "Quantity",
    id: "Quantity",
  },
  {
    Component: Editable.EF_Label,
    title: "SubQty",
    id: "SubQty",
  },
  {
    Component: Editable.EF_Text,
    title: "Notes",
    id: "Notes",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    options: ITEM_STATUS,
    title: "Status",
    id: "Status",
    sortBy: "sort",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "BTO",
    id: "BTO",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "HighRisk",
    id: "HighRisk",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Custom",
    id: "Custom",
  },
  {
    Component: Editable.EF_Input,
    title: "BoxQty",
    id: "BoxQty",
  },
  {
    Component: Editable.EF_Input,
    title: "GlassQty",
    id: "GlassQty",
  },
  {
    Component: Editable.EF_Input,
    title: "LBRMin",
    id: "LBRMin",
  },
  {
    Component: Editable.EF_Rack,
    title: "RackLocation",
    id: "RackLocation",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "RBMIcon",
    id: "RBMIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Wraped",
    id: "Wraped",
  },

  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "PaintLineal",
    id: "PaintLineal",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Painted",
    id: "Painted",
  },
];

const DOOR_FIELDS = [
  {
    Component: Editable.EF_Label,
    title: "Item",
    id: "Item",
  },
  {
    Component: Editable.EF_Label,
    title: "System",
    id: "System",
  },
  {
    Component: Editable.EF_Label,
    title: "Description",
    id: "Description",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Door Type",
    id: "DoorType",
    options: ITEM_DOOR_TYPES
  },
  {
    Component: Editable.EF_Label,
    title: "Size",
    id: "Size",
  },
  {
    Component: Editable.EF_Label,
    title: "Quantity",
    id: "Quantity",
  },
  {
    Component: Editable.EF_Label,
    title: "SubQty",
    id: "SubQty",
  },
  {
    Component: Editable.EF_Text,
    title: "Notes",
    id: "Notes",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Door Cut-out",
    id: "DoorCutout",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    options: ITEM_STATUS,
    title: "Status",
    id: "Status",
    sortBy: "sort",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Stock",
    id: "Stock",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    title: "Lites",
    id: "Lites",
    options: ITEM_LITES
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "BTO",
    id: "BTO",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Slab Prep",
    id: "SlabPrep",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Assembly",
    id: "Assembly",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Milling Dept",
    id: "MillingDept",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Custom Slab Prep",
    id: "CustomSlabPrep",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "QA",
    id: "QA",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Custom Milling",
    id: "CustomMilling",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "TempSlab",
    id: "TempSlab",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    title: "Painted",
    id: "Painted",
  },

  {
    Component: Editable.EF_Input,
    title: "BoxQty",
    id: "BoxQty",
  },
  {
    Component: Editable.EF_Input,
    title: "GlassQty",
    id: "GlassQty",
  },
  {
    Component: Editable.EF_Input,
    title: "LBRMin",
    id: "LBRMin",
  },
  {
    Component: Editable.EF_Rack,
    title: "RackLocation",
    id: "RackLocation",
  },
  {
    Component: Editable.EF_Input,
    title: "TransomCount",
    id: "TransomCount",
  },
  {
    Component: Editable.EF_Input,
    title: "SideliteCount",
    id: "SideliteCount",
  },
  {
    Component: Editable.EF_Input,
    title: "SingleDoorCount",
    id: "SingleDoorCount",
  },
  {
    Component: Editable.EF_Input,
    title: "DoubleDoorCount",
    id: "DoubleDoorCount",
  },
];


const Com = (props) => {
  const { onHide, initItem, onSave, isEditable } = props;
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
    onSave(initItem?.Id, changedData, item?.kind);
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
              isEditable = {isEditable}
            />
          );
        })}
      </div>
      <div className="justify-content-center my-2 flex bg-slate-100 p-2">
        <button className="btn btn-primary px-4" onClick={handleSave} disabled={!isEditable}>
          Save
        </button>
      </div>
    </Modal>
  );
};

const Block = ({ item, setItem, inputData, isEditable }) => {
  let { Component, title, id, options, ...rest } = inputData;
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
          onChange={(v) => handleChange(v, id)}
          options={options}
          disabled = {!isEditable}
          {...rest}
        />
      </div>
    </div>
  );
};


export default Com;
