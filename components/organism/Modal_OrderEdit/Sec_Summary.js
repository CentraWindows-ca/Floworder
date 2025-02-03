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

const Com = ({ className, ...props }) => {
  const { data, onChange, onHide } = useContext(LocalDataContext);

  return (
    <>
      <div className={cn(styles.columnSummaryContainer)}>
        <DisplayBlock id="m_NumberOfOthers">
          <label>Others</label>
          <div className={cn(styles.valueContainer)}>
            {utils.formatNumber(data?.m_NumberOfOthers)}
          </div>
        </DisplayBlock>
        <DisplayBlock id="m_TotalPrice">
          <label>Total Sales Amount</label>
          <div className={cn(styles.valueContainer)}>
            ${utils.formatNumber(data?.m_TotalPrice)}
          </div>
        </DisplayBlock>
      </div>
      <DisplayBlock displayAs={"w"}>
        <div className={styles.subTitle}>
          <label >Window</label>
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
          <label >Door</label>
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

export default Com;
