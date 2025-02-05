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
    render: (v) => `$${utils.formatNumber(v)}`,
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
    render: (v) => `$${utils.formatNumber(v)}`,
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
    render: (v) => `$${utils.formatNumber(v)}`,
  },
];

const Com = ({ className, ...props }) => {
  const { data, onChange, onHide } = useContext(LocalDataContext);

  return (
    <>
      <div className={cn(styles.columnSummaryContainer)}>
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
      </DisplayBlock>
    </>
  );
};

const Block = ({ inputData }) => {
  const { data } = useContext(LocalDataContext);

  const { id, title, render } = inputData;
  return (
    <DisplayBlock id={id}>
      <label>{title}</label>
      <div className={cn(styles.valueContainer)}>
        {render ? render(data?.[id]) : utils.formatNumber(data?.[id])}
      </div>
    </DisplayBlock>
  );
};

export default Com;
