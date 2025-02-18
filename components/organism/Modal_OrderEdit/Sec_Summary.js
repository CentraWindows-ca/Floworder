import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import utils from "lib/utils";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";
import { DisplayBlock } from "./Com";

const COMMON_FIELDS = [
  {
    title: "Others",
    id: "m_NumberOfOthers",
  },
  {
    title: "Total Sales Amount",
    id: "m_TotalPrice",
    render: (v) => `$${utils.formatCurrency2Decimal(v)}`,
  },
  {
    title: "Total LBR Min",
    id: "m_TotalLBRMin",
  },
];

const WINDOW_FIELDS = [
  {
    title: "Total Windows",
    id: "m_NumberOfWindows",
    displayAs: "w",
  },
  {
    title: "Total Patio Doors",
    id: "m_NumberOfPatioDoors",
    displayAs: "w",
  },
  {
    title: "Window Total Box Qty",
    id: "w_TotalBoxQty",
    displayAs: "w",
  },
  {
    title: "Window Glass Qty",
    id: "w_TotalGlassQty",
    displayAs: "w",
  },
  {
    title: "Window Sales Amount",
    id: "w_TotalPrice",
    render: (v) => `$${utils.formatCurrency2Decimal(v)}`,
  },
  {
    title: "Window LBR Min",
    id: "w_TotalLBRMin",
  },
];

const DOOR_FIELDS = [
  {
    title: "Total Doors",
    id: "m_NumberOfDoors",
    displayAs: "w",
  },
  {
    title: "Door Total Box Qty",
    id: "d_TotalBoxQty",
    displayAs: "w",
  },
  {
    title: "Door Glass Qty",
    id: "d_TotalGlassQty",
    displayAs: "w",
  },
  {
    title: "Door Sales Amount",
    id: "d_TotalPrice",
    render: (v) => `$${utils.formatCurrency2Decimal(v)}`,
  },
  {
    title: "Door LBR Min",
    id: "d_TotalLBRMin",
  },
];

const WINDOW_LBR_FIELDS = [
  {
    title: "26CA",
    qty: "w__26CA",
    lbr: "w__26CAMin",
  },
  {
    title: "26HY",
    qty: "w__26HY",
    lbr: "w__26HYMin",
  },
  {
    title: "27DS",
    qty: "w__27DS",
    lbr: "w__27DSMin",
  },
  {
    title: "29CA",
    qty: "w__29CA",
    lbr: "w__29CAMin",
  },
  {
    title: "29CM",
    qty: "w__29CM",
    lbr: "w__29CMMin",
  },
  {
    title: "52PD",
    qty: "w__52PD",
    lbr: "w__52PDMin",
  },
  {
    title: "61DR",
    qty: "w__61DR",
    lbr: "w__61DRMin",
  },
  {
    title: "68CA",
    qty: "w__68CA",
    lbr: "w__68CAMin",
  },
  {
    title: "68SL",
    qty: "w__68SL",
    lbr: "w__68SLMin",
  },
  {
    title: "68VS",
    qty: "w__68VS",
    lbr: "w__68VSMin",
  },
];
const Com = ({ className, ...props }) => {
  const { data, onChange, onHide } = useContext(LocalDataContext);

  if (!data) return null;

  const totalNumber =
    (data["m_NumberOfWindows"] || 0) +
    (data["m_NumberOfPatioDoors"] || 0) +
    (data["m_NumberOfDoors"] || 0);

  const totalGlassQty =
    (data["w_TotalGlassQty"] || 0) + (data["d_TotalGlassQty"] || 0);

  const totalBoxQty =
    (data["w_TotalBoxQty"] || 0) + (data["d_TotalBoxQty"] || 0);

  const shouldShowTotal =
    [
      data["m_NumberOfWindows"],
      data["m_NumberOfDoors"],
      data["m_NumberOfOthers"],
      data["m_NumberOfPatioDoors"],
    ]?.filter((a) => a)?.length > 1;

  return (
    <>
      <div className={cn(styles.summaryContainer, "text-xs")}>
        <table className="table-hover table-bordered mb-0 table border">
          <thead className="bg-gray-100">
            <tr>
              <th></th>
              <th>Sales Amount</th>
              <th>Qty</th>
              <th>Glass Qty</th>
              <th>Box Qty</th>
              <th>LBR Min.</th>
            </tr>
          </thead>
          <tbody>
            {shouldShowTotal && (
              <tr>
                <th>Total</th>
                <td>${utils.formatCurrency2Decimal(data["m_TotalPrice"])}</td>
                <td>{utils.formatNumber(totalNumber)}</td>
                <td>{utils.formatNumber(totalGlassQty)} </td>
                <td>{utils.formatNumber(totalBoxQty)}</td>
                <td>{utils.formatNumber(data["m_TotalLBRMin"])}</td>
              </tr>
            )}
            {data["m_NumberOfWindows"] ? (
              <tr>
                <th>Windows</th>
                {/* <td>${utils.formatCurrency2Decimal(data["w_TotalPrice"])}</td> */}
                <td>--</td>
                <td>{utils.formatNumber(data["m_NumberOfWindows"])}</td>
                <td>{utils.formatNumber(data["w_TotalGlassQty"])}</td>
                <td>{utils.formatNumber(data["w_TotalBoxQty"])}</td>
                <td>{utils.formatNumber(data["w_TotalLBRMin"])}</td>
              </tr>
            ) : null}

            {data["m_NumberOfPatioDoors"] ? (
              <tr>
                <th>Patio Doors</th>
                <td>--</td>
                <td>{utils.formatNumber(data["m_NumberOfPatioDoors"])}</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
              </tr>
            ) : null}

            {data["m_NumberOfDoors"] ? (
              <tr>
                <th>Doors</th>
                {/* <td>${utils.formatCurrency2Decimal(data["d_TotalPrice"])}</td> */}
                <td>--</td>
                <td>{utils.formatNumber(data["m_NumberOfDoors"])}</td>
                <td>{utils.formatNumber(data["d_TotalGlassQty"])}</td>
                <td>{utils.formatNumber(data["d_TotalBoxQty"])}</td>
                <td>{utils.formatNumber(data["d_TotalLBRMin"])}</td>
              </tr>
            ) : null}
            {data["m_NumberOfOthers"] ? (
              <tr>
                <th>Others</th>
                <td>--</td>
                <td>{utils.formatNumber(data["m_NumberOfOthers"])}</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
              </tr>
            ) : null}
          </tbody>
        </table>

        <div>
          <div className={styles.summaryLaborsTitle}>LBR Breakdown:</div>
          <div className={styles.summaryLaborsContainer}>
            {WINDOW_LBR_FIELDS?.map((a) => {
              const { title, qty, lbr } = a;
              if (!data[qty] && !data[lbr]) {
                return null;
              }
              return (
                <div key={title} className={styles.summaryLabor}>
                  <div className={styles.summaryLaborSubtitle}>{title}</div>
                  <div className={styles.summaryLaborNumbers}>
                    <div
                      className="text-sm justify-content-between align-items-center flex gap-2"
                      style={{ borderBottom: "1px solid #F0F0F0" }}
                      title={`Quantity: ${utils.formatNumber(data[qty])}`}
                    >
                      <div className="text-gray-400"><i className="fas fa-box me-1"></i><span className="text-xs">Qty</span></div>
     
                      <span>{utils.formatNumber(data[qty])}</span>
                      
                    </div>
                    <div
                      className="text-sm justify-content-between align-items-center flex gap-2"
                      title={`Labor hours: ${utils.formatNumber(data[lbr])}`}
                    >
                      <div className="text-gray-400"><i className="far fa-clock me-1"></i><span className="text-xs">Min</span></div>
                      
                      <span>{utils.formatNumber(data[lbr])}</span> 
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* <div className={cn(styles.columnSummaryContainer)}>
        {COMMON_FIELDS?.map((a) => {
          return <Block key={a.id} inputData={a} />;
        })}
      </div>
      <DisplayBlock displayAs={"w"}>
        <div className={styles.subTitle}>
          <label>Window</label>
        </div>
        <div className={cn(styles.columnSummaryContainer)}>
          {WINDOW_FIELDS?.map((a) => {
            return <Block key={a.id} inputData={a} />;
          })}
          {WINDOW_LBR_FIELDS?.map((a) => {
            return <Block key={a.id} inputData={a} />;
          })}
        </div>
      </DisplayBlock>
      <DisplayBlock displayAs={"d"}>
        <div className={styles.subTitle}>
          <label>Door</label>
        </div>
        <div className={cn(styles.columnSummaryContainer)}>
          {DOOR_FIELDS?.map((a) => {
            return <Block key={a.id} inputData={a} />;
          })}
        </div>
      </DisplayBlock> */}
    </>
  );
};

export default Com;
