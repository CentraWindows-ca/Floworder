import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "../styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, DisplayBlock } from "../Com";

const Com = ({ className, title, id, ...props }) => {
  const { data, windowItems, doorItems, onChange, onHide } =
    useContext(LocalDataContext);

  const [stats, setStats] = useState({});

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

  return (
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
                  <td>Item</td>
                  <td>Size</td>
                  <td>Qty</td>
                  <td>SubQty</td>
                  <td>System</td>
                  <td>Description</td>
                  <td>Notes</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                {windowItems?.map((a) => {
                  const {
                    Item,
                    Size,
                    Quantity,
                    System,
                    Description,
                    Notes,
                    Status,
                    Id,
                  } = a;

                  return (
                    <tr key={`${Id}`}>
                      <td>{Item}</td>
                      <td>{Size}</td>
                      <td>{Quantity}</td>
                      <td>-</td>
                      <td>{System}</td>
                      <td>{Description}</td>
                      <td>{Notes}</td>
                      <td>{Status}</td>
                    </tr>
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
                  <td>Item</td>
                  <td>Size</td>
                  <td>Qty</td>
                  <td>SubQty</td>
                  <td>System</td>
                  <td>Description</td>
                  <td>Notes</td>
                  <td>Status</td>
                </tr>
              </thead>
              <tbody>
                {doorItems?.map((a) => {
                  const {
                    Item,
                    Size,
                    Quantity,
                    System,
                    Description,
                    Notes,
                    Status,
                    Id,
                  } = a;
                  return (
                    <tr key={`${title}_${Id}`}>
                      <td>{Item}</td>
                      <td>{Size}</td>
                      <td>{Quantity}</td>
                      <td>-</td>
                      <td>{System}</td>
                      <td>{Description}</td>
                      <td>{Notes}</td>
                      <td>{Status}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </DisplayBlock>
      )}
    </ToggleBlock>
  );
};

export default Com;
