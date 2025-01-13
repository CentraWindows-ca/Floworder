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
  const { data, onChange, orderId, onHide } = useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnSummaryContainer)}>
      <DisplayBlock>
        <label htmlFor="rushOrder">Total Windows</label>
        <div className={cn(styles.valueContainer)}>
          {utils.formatNumber(123)}
        </div>
      </DisplayBlock>

      <DisplayBlock>
        <label htmlFor="rushOrder">Total Sales Amount</label>
        <div className={cn(styles.valueContainer)}>
          ${utils.formatNumber(123)}
        </div>
      </DisplayBlock>

    </div>
  );
};

export default Com;
