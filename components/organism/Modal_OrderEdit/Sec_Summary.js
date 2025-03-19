import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import utils from "lib/utils";
import _ from "lodash";
import constants from "lib/constants";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

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
    (data["m_NumberOfDoors"] || 0) +
    (data["m_NumberOfSwingDoors"] || 0);
  const totalGlassQty =
    (data["w_TotalGlassQty"] || 0) + (data["d_TotalGlassQty"] || 0);

  const totalBoxQty =
    (data["w_TotalBoxQty"] || 0) + (data["d_TotalBoxQty"] || 0);

  const shouldShowTotal =
    [
      data["m_NumberOfWindows"],
      data["m_NumberOfDoors"],
      data["m_NumberOfSwingDoors"],
      data["m_NumberOfOthers"],
      data["m_NumberOfPatioDoors"],
    ]?.filter((a) => a)?.length > 1;

  const groupByWindowDoor = {
    w: {
      otherFields: {
        TotalGlassQty: data.w_TotalGlassQty,
        TotalBoxQty: data.w_TotalBoxQty,
        TotalLBRMin: data.w_TotalLBRMin,
      },
      numbers: [
        {
          label: "Windows",
          number: data["m_NumberOfWindows"],
          displayNumber: utils.formatNumber(data["m_NumberOfWindows"]),
        },
        {
          label: "Patio Doors",
          number: data["m_NumberOfPatioDoors"],
          displayNumber: utils.formatNumber(data["m_NumberOfPatioDoors"]),
        },
      ],
    },
    d: {
      otherFieldsF: {
        TotalGlassQty: data.d_TotalGlassQty,
        TotalBoxQty: data.d_TotalBoxQty,
        TotalLBRMin: data.d_TotalLBRMin,
      },
      numbers: [
        {
          label: "Exterior Doors",
          number: data["m_NumberOfDoors"],
          displayNumber: utils.formatNumber(data["m_NumberOfDoors"]),
        },
        {
          label: "Swing Doors",
          number: data["m_NumberOfSwingDoors"],
          displayNumber: utils.formatNumber(data["m_NumberOfSwingDoors"]),
        },
      ],
    },
  };

  return (
    <>
      <div className={cn(styles.summaryContainer)}>
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

            {_.keys(groupByWindowDoor)?.map((k) => {
              const prd = groupByWindowDoor[k];
              const numbers = groupByWindowDoor[k].numbers?.filter(
                (n) => n.number,
              );
              const rowSpan = numbers.length;

              return (
                <React.Fragment key={k}>
                  {numbers?.map((num) => {
                    const { label, displayNumber } = num;
                    return (
                      <tr key={label} rowSpan = {rowSpan}>
                        <th>{label}</th>
                        <td>--</td>
                        <td>{displayNumber}</td>
                        <td>
                          {utils.formatNumber(prd.otherFields.TotalGlassQty)}
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}

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
                <th>Exterior Doors</th>
                {/* <td>${utils.formatCurrency2Decimal(data["d_TotalPrice"])}</td> */}
                <td>--</td>
                <td>{utils.formatNumber(data["m_NumberOfDoors"])}</td>
                <td>{utils.formatNumber(data["d_TotalGlassQty"])}</td>
                <td>{utils.formatNumber(data["d_TotalBoxQty"])}</td>
                <td>{utils.formatNumber(data["d_TotalLBRMin"])}</td>
              </tr>
            ) : null}

            {data["m_NumberOfSwingDoors"] ? (
              <tr>
                <th>Swing Doors</th>
                {/* <td>${utils.formatCurrency2Decimal(data["d_TotalPrice"])}</td> */}
                <td>--</td>
                <td>{utils.formatNumber(data["m_NumberOfSwingDoors"])}</td>
                <td>--</td>
                <td>--</td>
                <td>--</td>
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
                  <div
                    className={cn(styles.summaryLaborSubtitle, "bg-gray-100")}
                  >
                    {title}
                  </div>
                  <div className={styles.summaryLaborNumbers}>
                    <div
                      className="justify-content-between align-items-center flex gap-3 pb-1"
                      style={{ borderBottom: "1px solid #D0D0D0" }}
                      title={`Quantity: ${utils.formatNumber(data[qty])}`}
                    >
                      <div className="">
                        <i className="fas fa-box me-2"></i>
                        <span>Qty</span>
                      </div>
                      <span className={cn(styles.summaryLaborNumberSpan)}>
                        {utils.formatNumber(data[qty])}
                      </span>
                    </div>
                    <div
                      className="justify-content-between align-items-center flex gap-3"
                      title={`Labor hours: ${utils.formatNumber(data[lbr])}`}
                    >
                      <div className="">
                        <i className="far fa-clock me-2"></i>
                        <span>Min</span>
                      </div>

                      <span className={cn(styles.summaryLaborNumberSpan)}>
                        {utils.formatNumber(data[lbr])}
                      </span>
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
