import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "../styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, DisplayBlock } from "../Com";

const Com = ({ className, ...props }) => {
  const { data, glassItems, onChange, onHide } = useContext(LocalDataContext);

  const total =
    glassItems?.reduce(
      (prev, curr) => {
        return {
          qty: prev.qty + parseInt(curr.qty) || 0,
          glassQty: prev.glassQty + parseInt(curr.glassQty) || 0,
        };
      },
      {
        qty: 0,
        glassQty: 0,
      },
    ) || {};

  const jsxTitle = (
    <div className="flex gap-2">
      Glass Items
      <div className="text-primary font-normal">
        {total?.qty || 0} / {total?.glassQty || 0}
      </div>
    </div>
  );

  return (
    <ToggleBlock title={jsxTitle} id={"glassItems"}>
      {!_.isEmpty(glassItems) ? (
        <div className="p-2">
          <div className="mb-2 text-left">
            <label className="text-sky-600">Windows</label>
          </div>
          <table className="table-xs table-bordered table-hover mb-0 table border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <td>Received / Expected</td>
                <td>Rack ID</td>
                <td>Rack Type</td>
                <td>Qty On Rack</td>
                <td>Item</td>
                <td>Description</td>
                <td>Order Date</td>
                <td>Shipping Date</td>
                <td>Size</td>
                <td>Position</td>
                <td>Status</td>
              </tr>
            </thead>
            <tbody>
              {glassItems?.map((a, i) => {
                const {
                  workOrderNumber,
                  item,
                  shipDate,
                  qty,
                  glassQty,
                  description,
                  positionOption,
                  size,
                  position,
                  supplierNo,
                  orderDate,
                  rackInfo,
                  status,
                  receivedExpected,
                } = a;

                if (_.isEmpty(rackInfo))
                  return (
                    <SingleRow
                      data={a}
                      key={`glass_${workOrderNumber}_${item}_${i}`}
                    />
                  );

                return (
                  <MultiRow
                    data={a}
                    key={`glass_${workOrderNumber}_${item}_${i}`}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No Data</div>
      )}
    </ToggleBlock>
  );
};

const SingleRow = ({ data }) => {
  const {
    workOrderNumber,
    item,
    shipDate,
    qty,
    glassQty,
    description,
    positionOption,
    size,
    position,
    supplierNo,
    orderDate,
    rackInfo,
    status,
    receivedExpected,
  } = data;

  return (
    <tr>
      <td>{receivedExpected}</td>
      <td>--</td>
      <td>--</td>
      <td>0</td>
      <td>{item}</td>
      <td>{description}</td>
      <td>{orderDate}</td>
      <td>{shipDate}</td>
      <td>{size}</td>
      <td>{position}</td>
      <td>{status}</td>
    </tr>
  );
};

const MultiRow = ({ data }) => {
  const {
    workOrderNumber,
    item,
    shipDate,
    qty,
    glassQty,
    description,
    positionOption,
    size,
    position,
    supplierNo,
    orderDate,
    rackInfo,
    status,
    receivedExpected,
  } = data;

  return rackInfo?.map((ri) => {
    const { rackID, rackType, qty: rackQty } = ri;
    return (
      <tr key={`glass_${workOrderNumber}_${item}_${rackID}`}>
        <td>{receivedExpected}</td>
        <td>{rackID}</td>
        <td>{rackType}</td>
        <td>{rackQty}</td>
        <td>{item}</td>
        <td>{description}</td>
        <td>{orderDate}</td>
        <td>{shipDate}</td>
        <td>{size}</td>
        <td>{position}</td>
        <td>{status}</td>
      </tr>
    );
  });
};

export default Com;
