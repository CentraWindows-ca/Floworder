import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "../styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, DisplayBlock } from "../Com";
import Modal_ItemEdit from "./Modal_ItemEdit";

const Com = ({ className, title, id, ...props }) => {
  const {
    data,
    windowItems,
    doorItems,
    onChange,
    onHide,
    onUpdateDoorItem,
    onUpdateWindowItem,
  } = useContext(LocalDataContext);

  const [stats, setStats] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const _stats = {
      W: 0,
      PD: 0,
      VD: 0,
      ED: 0,
      GL: 0,
    };

    /*
      W: not 52PD, 61DR
      PD: 52PD
      VD: 61DR
      ED: door items
      GL: GL01
    */
    windowItems?.map((a) => {
      const { System } = a;
      switch (System) {
        case "52PD":
          _stats["PD"] = _stats["PD"] + 1;
          break;
        case "61DR":
          _stats["VD"] = _stats["VD"] + 1;
          break;
        case "GL01":
          _stats["GL"] = _stats["GL"] + 1;
          break;
        default:
          _stats["W"] = _stats["W"] + 1;
          break;
      }
    });
    _stats["ED"] = doorItems?.length;
    setStats(_stats);
  }, [windowItems, doorItems]);

  const jsxTitle = (
    <div className="flex gap-2">
      {title}
      <div className="text-primary font-normal">
        W: {stats.W} | PD: {stats.PD} | VD: {stats.VD} | ED: {stats.ED} | GL:{" "}
        {stats.GL}
      </div>
    </div>
  );

  const handleShowItem = (item, kind) => {
    setEditingItem({ ...item, kind });
  };

  const handleSaveItem = async (Id, item, kind) => {
    if (kind === "d") {
      await onUpdateDoorItem(Id, item);
    }

    if (kind === "w") {
      await onUpdateWindowItem(Id, item);
    }
  };

  const handleCloseItem = () => {
    setEditingItem(null);
  };

  return (
    <>
      <ToggleBlock title={jsxTitle} id={id}>
        {!_.isEmpty(windowItems) && (
          <DisplayBlock id="WIN.windowItems">
            <div className="p-2">
              <div className="mb-2 text-left">
                <label className="text-sky-600">Windows</label>
              </div>
              <table className="table-xs table-bordered table-hover mb-0 table border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <td style={{width: 60}}>Item</td>
                    <td style={{width: 160}}>Size</td>
                    <td style={{width: 60}}>Qty</td>
                    <td style={{width: 60}}>SubQty</td>
                    <td style={{width: 70}}>System</td>
                    <td style={{width: 160}}>Description</td>
                    <td style={{width: 80}}>High Risk</td>
                    <td style={{width: 60}}>Custom</td>
                    <td style={{width: 60}}>BTO</td>
                    <td>Notes</td>
                    <td style={{width: 60}}>Location</td>
                    <td style={{width: 120}}>Status</td>
                    <td style={{width: 80}}></td>
                  </tr>
                </thead>
                <tbody>
                  {windowItems?.map((a) => {
                    const { Id } = a;
                    return (
                      <TableRowWindow
                        key={`${title}_${Id}`}
                        data={a}
                        kind="w"
                        onShowEdit={handleShowItem}
                        onSave={handleSaveItem}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DisplayBlock>
        )}
        {!_.isEmpty(doorItems) && (
          <DisplayBlock id="DOOR.doorItems">
            <div className="p-2">
              <div className="mb-2 text-left">
                <label className="text-sky-600">Doors</label>
              </div>
              <table className="table-xs table-bordered table-hover mb-0 table border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <td style={{width: 60}}>Item</td>
                    <td style={{width: 160}}>Size</td>
                    <td style={{width: 60}}>Qty</td>
                    <td style={{width: 60}}>SubQty</td>
                    <td style={{width: 70}}>System</td>
                    <td style={{width: 160}}>Description</td>
                    <td style={{width: 60}}>BTO</td>
                    <td >Notes</td>
                    <td style={{width: 60}}>Location</td>
                    <td style={{width: 120}}>Status</td>
                    <td style={{width: 80}}></td>
                  </tr>
                </thead>
                <tbody>
                  {doorItems?.map((a) => {
                    const { Id } = a;
                    return (
                      <TableRowDoor
                        key={`${title}_${Id}`}
                        data={a}
                        kind="d"
                        onShowEdit={handleShowItem}
                        onSave={handleSaveItem}
                      />
                    );
                  })}
                </tbody>
              </table>
            </div>
          </DisplayBlock>
        )}
      </ToggleBlock>
      <Modal_ItemEdit
        onSave={handleSaveItem}
        onHide={handleCloseItem}
        initItem={editingItem}
      />
    </>
  );
};

const TableRowWindow = ({ data, kind, onShowEdit, onSave }) => {
  const {
    Item,
    Size,
    Quantity,
    SubQty,
    System,
    Description,
    HighRisk,
    Custom,
    BTO,
    Notes,
    RackLocation,
    Status,
    Id,
  } = data;
  const handleChange = async (v, id) => {
    onSave(
      Id,
      {
        [id]: v,
      },
      kind,
    );
  };
  return (
    <tr>
      <td>{Item}</td>
      <td>{Size}</td>
      <td>{Quantity}</td>
      <td>{SubQty}</td>
      <td>{System}</td>
      <td>{Description}</td>
      <td>
        <Editable.EF_Checkbox_Yesno
          {...{
            id: "HighRisk",
            value: HighRisk,
            onChange: (v) => handleChange(v, "HighRisk"),
          }}
        />
      </td>
      <td>
        <Editable.EF_Checkbox_Yesno
          {...{
            id: "Custom",
            value: Custom,
            onChange: (v) => handleChange(v, "Custom"),
          }}
        />
      </td>
      <td>
        <Editable.EF_Checkbox_Yesno
          {...{
            id: "BTO",
            value: BTO,
            onChange: (v) => handleChange(v, "BTO"),
          }}
        />
      </td>
      <td>{Notes}</td>
      <td>{RackLocation}</td>
      <td>{Status}</td>
      <td>
        <button onClick={() => onShowEdit(data, kind)}>Detail</button>
      </td>
    </tr>
  );
};

const TableRowDoor = ({ data, kind, onShowEdit, onSave }) => {
  const {
    Item,
    Size,
    Quantity,
    SubQty,
    System,
    Description,
    HighRisk,
    Custom,
    BTO,
    Notes,
    Status,
    RackLocation,
    Id,
  } = data;
  const handleChange = async (v, id) => {
    onSave(
      Id,
      {
        [id]: v,
      },
      kind,
    );
  };
  return (
    <tr>
      <td>{Item}</td>
      <td>{Size}</td>
      <td>{Quantity}</td>
      <td>{SubQty}</td>
      <td>{System}</td>
      <td>{Description}</td>
      <td>
        <Editable.EF_Checkbox_Yesno
          {...{
            id: "BTO",
            value: BTO,
            onChange: (v) => handleChange(v, "BTO"),
          }}
        />
      </td>
      <td>{Notes}</td>
      <td>{RackLocation}</td>
      <td>{Status}</td>
      <td>
        <button onClick={() => onShowEdit(data, kind)}>Detail</button>
      </td>
    </tr>
  );
};



export default Com;
