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

  const jsxTitle = (
    <div className="flex gap-2">
      {title}
      <div className="text-primary font-normal">
        {/* W: 8 | PD: 0 | VD: 0 | ED: 4 | GL: 0 */}
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
                    item,
                    size,
                    quantity,
                    system,
                    description,
                    notes,
                    status,
                    id,
                  } = a;
                  return (
                    <tr key={id}>
                      <td>{item}</td>
                      <td>{size}</td>
                      <td>{quantity}</td>
                      <td>-</td>
                      <td>{system}</td>
                      <td>{description}</td>
                      <td>{notes}</td>
                      <td>{status}</td>
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
                    item,
                    size,
                    quantity,
                    system,
                    description,
                    notes,
                    status,
                    id,
                  } = a;
                  return (
                    <tr key={id}>
                      <td>{item}</td>
                      <td>{size}</td>
                      <td>{quantity}</td>
                      <td>-</td>
                      <td>{system}</td>
                      <td>{description}</td>
                      <td>{notes}</td>
                      <td>{status}</td>
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
