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
    <div className={cn(styles.columnSummaryContainer)}>
      <DisplayBlock data = {data} id="MASTER.numberOfWindows">
        <label>Total Windows</label>
        <div className={cn(styles.valueContainer)}>
          {utils.formatNumber(data?.MASTER?.numberOfWindows)}
        </div>
      </DisplayBlock>

      <DisplayBlock data = {data} id="MASTER.numberOfPatioDoors">
        <label>Total Patio Doors</label>
        <div className={cn(styles.valueContainer)}>
          {utils.formatNumber(data?.MASTER?.numberOfPatioDoors)}
        </div>
      </DisplayBlock>

      <DisplayBlock data = {data} id="MASTER.numberOfDoors">
        <label>Total Doors</label>
        <div className={cn(styles.valueContainer)}>
          {utils.formatNumber(data?.MASTER?.numberOfDoors)}
        </div>
      </DisplayBlock>

      <DisplayBlock data = {data} id="MASTER.numberOfOthers">
        <label>Others</label>
        <div className={cn(styles.valueContainer)}>
          {utils.formatNumber(data?.MASTER?.numberOfOthers)}
        </div>
      </DisplayBlock>
      <DisplayBlock data = {data} id="WIN.totalPrice">
        <label>Window Sales Amount</label>
        <div className={cn(styles.valueContainer)}>
          ${utils.formatNumber(data?.WIN?.totalPrice)}
        </div>
      </DisplayBlock>
      <DisplayBlock data = {data} id="DOOR.totalPrice">
        <label>Door Sales Amount</label>
        <div className={cn(styles.valueContainer)}>
          ${utils.formatNumber(data?.DOOR?.totalPrice)}
        </div>
      </DisplayBlock>
      <DisplayBlock data = {data} id="MASTER.totalPrice">
        <label>Total Sales Amount</label>
        <div className={cn(styles.valueContainer)}>
          ${utils.formatNumber(data?.MASTER?.totalPrice)}
        </div>
      </DisplayBlock>

    </div>
  );
};

export default Com;
