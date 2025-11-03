import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import utils from "lib/utils";
import _ from "lodash";
import constants from "lib/constants";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

// const WINDOW_LBR_FIELDS = [
//   {
//     title: "26CA",
//     qty: "w__26CA",
//     lbr: "w__26CAMin",
//   },
//   {
//     title: "26HY",
//     qty: "w__26HY",
//     lbr: "w__26HYMin",
//   },
//   {
//     title: "27DS",
//     qty: "w__27DS",
//     lbr: "w__27DSMin",
//   },
//   {
//     title: "29CA",
//     qty: "w__29CA",
//     lbr: "w__29CAMin",
//   },
//   {
//     title: "29CM",
//     qty: "w__29CM",
//     lbr: "w__29CMMin",
//   },
//   {
//     title: "52PD",
//     qty: "w__52PD",
//     lbr: "w__52PDMin",
//   },
//   {
//     title: "61DR",
//     qty: "w__61DR",
//     lbr: "w__61DRMin",
//   },
//   {
//     title: "68CA",
//     qty: "w__68CA",
//     lbr: "w__68CAMin",
//   },
//   {
//     title: "68SL",
//     qty: "w__68SL",
//     lbr: "w__68SLMin",
//   },
//   {
//     title: "68VS",
//     qty: "w__68VS",
//     lbr: "w__68VSMin",
//   },
//   {
//     title: "88SL",
//     qty: "w__88SL",
//     lbr: "w__88SLMin",
//   },
//   {
//     title: "88VS",
//     qty: "w__88VS",
//     lbr: "w__88VSMin",
//   },
// ];

// const DOOR_LBR_FIELDS = [
//   {
//     title: "REDR",
//     qty: "d__REDR",
//     lbr: "d__REDRMin",
//   },
//   // these products are bought from other company, we dont need to show them here as production tool
//   // {
//   //   title: "CDLD",
//   //   qty: "d__CDLD",
//   //   lbr: "d__CDLDMin",
//   // },
//   // {
//   //   title: "RESD",
//   //   qty: "d__RESD",
//   //   lbr: "d__RESDMin",
//   // }
// ];

const Com = ({ className, ...props }) => {
  const { data, LbrBreakDowns, onChange, onHide } =
    useContext(LocalDataContext);

  if (!data) return null;

  const totalNumber =
    (data["m_NumberOfWindows"] || 0) +
    (data["m_NumberOfPatioDoors"] || 0) +
    (data["m_NumberOfDoors"] || 0) +
    (data["m_NumberOfOthers"] || 0) +
    (data["m_NumberOfSwingDoors"] || 0);

  const totalGlassQty =
    (data["w_TotalGlassQty"] || 0) + (data["d_TotalGlassQty"] || 0);

  const totalBoxQty =
    (data["w_TotalBoxQty"] || 0) + (data["d_TotalBoxQty"] || 0);

  const totalScreens =
    (data["w_TotalScreens"] || 0) + (data["d_TotalScreens"] || 0);

  const shouldShowTotal =
    [
      data["m_NumberOfWindows"],
      data["m_NumberOfDoors"],
      data["m_NumberOfSwingDoors"],
      data["m_NumberOfOthers"],
      data["m_NumberOfPatioDoors"],
    ]?.filter((a) => a)?.length > 1;

  const otherFields = {
    TotalGlassQty: data.w_TotalGlassQty,
    TotalBoxQty: data.w_TotalBoxQty,
    TotalScreens: data.w_TotalScreens,
    TotalLBRMin: data.w_TotalLBRMin,
    TotalPrice: data.w_TotalPrice,
  };

  const groupByWindowDoor = {
    w: {
      otherFields,
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
        {
          label: "Swing Doors",
          number: data["m_NumberOfSwingDoors"],
          displayNumber: utils.formatNumber(data["m_NumberOfSwingDoors"]),
        },
        {
          label: "Others",
          number: data["m_NumberOfOthers"],
          displayNumber: utils.formatNumber(data["m_NumberOfOthers"]),
        },
      ],
    },
    d: {
      otherFields: {
        TotalGlassQty: data.d_TotalGlassQty,
        TotalBoxQty: data.d_TotalBoxQty,
        TotalLBRMin: data.d_TotalLBRMin,
        TotalPrice: data.d_TotalPrice,
      },
      numbers: [
        {
          label: "Exterior Doors",
          number: data["m_NumberOfDoors"],
          displayNumber: utils.formatNumber(data["m_NumberOfDoors"]),
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
              <th>Screen Qty</th>

              <th>LBR Min.</th>
            </tr>
          </thead>
          <tbody>
            {shouldShowTotal ? (
              <tr>
                <th>Total</th>
                <td>
                  {utils.formatCurrency2Decimal(data["m_TotalPrice"], "$")}
                </td>
                <td>{utils.formatNumber(totalNumber)}</td>
                <td>{utils.formatNumber(totalGlassQty)} </td>
                <td>{utils.formatNumber(totalBoxQty)}</td>
                <td>{utils.formatNumber(totalScreens)}</td>
                <td>{utils.formatNumber(data["m_TotalLBRMin"])}</td>
              </tr>
            ) : null}
            {_.keys(groupByWindowDoor)?.map((k) => {
              const prd = groupByWindowDoor[k];
              const numbers = groupByWindowDoor[k].numbers?.filter(
                (n) => n.number,
              );
              const colSpan = numbers.length;

              return (
                <React.Fragment key={k}>
                  {numbers?.map((num, j) => {
                    const { label, displayNumber } = num;
                    return (
                      <tr key={label}>
                        <th>{label}</th>
                        {j === 0 && (
                          <>
                            <td rowSpan={colSpan}>
                              {utils.formatCurrency2Decimal(
                                prd.otherFields?.TotalPrice,
                                "$",
                              )}
                            </td>
                          </>
                        )}

                        <td>{displayNumber}</td>
                        {j === 0 && (
                          <>
                            <td rowSpan={colSpan}>
                              {utils.formatNumber(
                                prd.otherFields?.TotalGlassQty,
                              )}
                            </td>
                            <td rowSpan={colSpan}>
                              {utils.formatNumber(prd.otherFields?.TotalBoxQty)}
                            </td>
                            <td rowSpan={colSpan}>
                              {utils.formatNumber(
                                prd.otherFields?.TotalScreens,
                              )}
                            </td>
                            <td rowSpan={colSpan}>
                              {utils.formatNumber(prd.otherFields?.TotalLBRMin)}
                            </td>
                          </>
                        )}
                      </tr>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>

        <div>
          <div className={styles.summaryLaborsTitle}>LBR Breakdown:</div>
          <div className={styles.summaryLaborsContainer}>
            {LbrBreakDowns?.map((a) => {
              const { title, qty, lbr } = a;
              if (!qty && !lbr) {
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
                      title={`Quantity: ${utils.formatNumber(qty)}`}
                    >
                      <div className="">
                        <i className="fas fa-box me-2"></i>
                        <span>Qty</span>
                      </div>
                      <span className={cn(styles.summaryLaborNumberSpan)}>
                        {utils.formatNumber(qty)}
                      </span>
                    </div>
                    <div
                      className="justify-content-between align-items-center flex gap-3"
                      title={`Labor hours: ${utils.formatNumber(lbr)}`}
                    >
                      <div className="">
                        <i className="far fa-clock me-2"></i>
                        <span>Min</span>
                      </div>

                      <span className={cn(styles.summaryLaborNumberSpan)}>
                        {utils.formatNumber(lbr)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Com;
