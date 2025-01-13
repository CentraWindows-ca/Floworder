import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, orderId, onHide } = useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnInputsContainer)}>
      <DisplayBlock data={data} id='branch'>
        <label className="flex justify-content-start align-items-center"> Windows Production Start</label>
        <div className="flex justify-content-end align-items-center">
          <Editable.EF_Date
            k="productionStart"
            value={data?.productionStart}
            onChange={(v) => onChange(v, "productionStart")}
            disabled = {!isEditable}
          />
        </div>
      </DisplayBlock>
      
    </div>
  );
};

export default Com;
