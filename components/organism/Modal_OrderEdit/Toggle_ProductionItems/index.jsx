import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "../styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock } from "../Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, orderId, onHide } = useContext(LocalDataContext);

  const jsxTitle = (
    <div className="flex gap-2">
      Production Items
      <div className="text-primary font-normal">
        W: 8 | PD: 0 | VD: 0 | ED: 4 | GL: 0
      </div>
    </div>
  );
  
  return (
    <ToggleBlock title={jsxTitle} id={"productionItems"}>
      <div className="p-2">
        <div className="mb-2 text-left">
          <label className="text-sky-600">Windows</label>
        </div>
        <table className="table-xs table-bordered table-hover table border text-sm mb-0">
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
          </tbody>
        </table>
      </div>



      <div className="p-2">
        <div className="mb-2 text-left">
          <label className="text-sky-600">Doors</label>
        </div>
        <table className="table-xs table-bordered table-hover table border text-sm mb-0">
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
          </tbody>
        </table>
      </div>







    </ToggleBlock>
  );
};

export default Com;
