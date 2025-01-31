import React, { useEffect, useState } from "react";
import cn from "classnames";
import Modal from "components/molecule/Modal";
import Editable from "components/molecule/Editable";
import constants, { ITEM_STATUS, ITEM_LITES, ITEM_DOOR_TYPES } from "lib/constants";
import utils from "lib/utils";

import { DisplayBlock, displayFilter } from "../Com";
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
    >
      <div className={cn(styles.columnItemInputsContainer)}>
        {fields?.map((a) => {
          return (
            <Block
              item={item}
              setItem={setItem}
              key={`item_${a.id}`}
              inputData={a}
            />
          );
        })}
      </div>
      <div className="justify-content-center my-2 flex bg-slate-100 p-2">
        <button className="btn btn-primary px-4" onClick={handleSave}>
          Save
        </button>
      </div>
    </Modal>
  );
};

const Block = ({ item, setItem, inputData }) => {
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
          {...rest}
        />
      </div>
    </div>
  );
};

// const sample = {
//   Id: "4951c126-86c6-4f01-b47f-01c5e613b140",
//   ParentId: "d59af26f-09d9-4502-819d-424e6b378a37",
//   WorkOrderNo: "VKTEST25",

//   Price: 3893.5,

//   Discount: 0,
//   Nett: 3893.5,
//   Cost: 1167.31,
//   StartItemTime: "2025-01-27T15:36:23.607",
//   EndItemTime: null,
//   StartItemOnHoldTime: null,
//   EndItemOnHoldTime: null,

//   BTONotes: null,
//   CustomNotes: null,
//   PaintedColor: "",
//   PaintedColorNotes: null,
//   PaintedType: "",
//   BackOrderFlag: null,

//   ApprovalStatus: null,
//   Status: "In Progress",
//   CreatedAt: "2025-01-22T16:32:14.58",
//   ChangedBy: "",
//   ChangedAt: "2025-01-27T15:07:34",
//   IsActive: true,
//   MasterId: "4a8b733b-c37d-4303-a3c2-fc1709a56b2e",
// };

const door = {
  "Id": "9cc583ea-000a-47db-8324-3fa9299006a8",
  "ParentId": "31626e44-4d68-4927-b836-ccd31168773e",
  "WorkOrderNo": "VKTEST25",
  "Item": "0018",
  "System": "CDLD",
  "Description": "Residential Door",
  "Size": "36.0000 x   80.0000",
  "Quantity": 1,
  "BoxQty": 0,
  "GlassQty": 0,
  "Price": 6347.06,
  "LBRMin": 0,
  "RackLocation": "007",
  "TransomCount": 0,
  "SideliteCount": 0,
  "SingleDoorCount": 0,
  "DoubleDoorCount": 0,
  "Discount": 0,
  "Nett": 5094.66,
  "Cost": 6958.08,
  "Notes": "testinggg ED upd - 2.1.5",
  "BTONotes": "test BTO note",
  "CustomNotes": null,
  "PaintedColor": "test color",
  "Painted": "1",
  "PaintedColorNotes": "test paint note",
  "DoorType": "DS",
  "BTOPlannedOrderDate": "2025-01-14T20:33:54.417",
  "BTOPlannedReceiptEnd": "2025-01-27T20:33:57.647",
  "BTOActualReceiptDate": null,
  "SlabPrep": null,
  "SlabPrepPlannedStartDate": null,
  "SlabPrepPlannedEndDate": null,
  "SlabPrepActualEndDate": null,
  "Assembly": null,
  "AssemblyPlannedStartDate": null,
  "AssemblyPlannedEndDate": null,
  "AssemblyActualEndDate": null,
  "MillingDept": null,
  "MillingDeptPlannedStartDate": null,
  "MillingDeptPlannedReceiptEnd": null,
  "MillingDeptActualReceiptDate": null,
  "PaintPlannedStartDate": "2025-01-15T20:35:24.11",
  "PaintPlannedEndDate": "2025-01-22T20:35:28.977",
  "PaintActualEndDate": null,
  "PaintedType": "asdfasfdasd",
  "DoorCutout": null,
  "BTO": "Yes",
  "BackOrderFlag": null,
  "Lites": "Multi Lite",
  "QA": null,
  "CustomMilling": "1",
  "TempSlab": null,
  "CustomSlabPrep": null,
  "CustomSlabPrepPlannedStartDate": null,
  "CustomSlabPrepPlannedEndDate": null,
  "CustomSlabPrepActualEndDate": null,
  "CustomMillingPlannedStartDate": "2025-01-22T20:35:31.91",
  "CustomMillingPlannedEndDate": null,
  "CustomMillingActualEndDate": "2025-01-30T20:35:34.047",
  "TempSlabPlannedStartDate": null,
  "TempSlabPlannedEndDate": null,
  "TempSlabActualEndDate": null,
  "ApprovalStatus": null,
  "Status": "In Progress",
  "CreatedAt": "2025-01-22T16:32:14.633",
  "ChangedBy": "zluo@centra.ca",
  "ChangedAt": "2025-01-31T11:55:04",
  "IsActive": true,
  "MasterId": "4a8b733b-c37d-4303-a3c2-fc1709a56b2e",
  "StartItemTime": null,
  "EndItemTime": null,
  "StartItemOnHoldTime": null,
  "EndItemOnHoldTime": null,
  "Stock": "1",
  "kind": "d"
}


export default Com;
