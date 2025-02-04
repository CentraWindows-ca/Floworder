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
          <DisplayBlock id="m_NumberOfWindows" displayAs={"w"}>
            <label>Total Windows</label>
            <div className={cn(styles.valueContainer)}>
              {utils.formatNumber(data?.m_NumberOfWindows)}
            </div>
          </DisplayBlock>

          <DisplayBlock id="m_NumberOfPatioDoors" displayAs={"w"}>
            <label>Total Patio Doors</label>
            <div className={cn(styles.valueContainer)}>
              {utils.formatNumber(data?.m_NumberOfPatioDoors)}
            </div>
          </DisplayBlock>

          <DisplayBlock id="w_TotalPrice" displayAs={"w"}>
            <label>Window Sales Amount</label>
            <div className={cn(styles.valueContainer)}>
              ${utils.formatNumber(data?.w_TotalPrice)}
            </div>
          </DisplayBlock>
        </div>
      </DisplayBlock>
      <DisplayBlock displayAs={"d"}>
        <div className={styles.subTitle}>
          <label>Door</label>
        </div>

        <div className={cn(styles.columnSummaryContainer)}>
          <DisplayBlock id="m_NumberOfDoors" displayAs={"d"}>
            <label>Total Doors</label>
            <div className={cn(styles.valueContainer)}>
              {utils.formatNumber(data?.m_NumberOfDoors)}
            </div>
          </DisplayBlock>
          <DisplayBlock id="d_TotalPrice" displayAs={"d"}>
            <label>Door Sales Amount</label>
            <div className={cn(styles.valueContainer)}>
              ${utils.formatNumber(data?.d_TotalPrice)}
            </div>
          </DisplayBlock>
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
