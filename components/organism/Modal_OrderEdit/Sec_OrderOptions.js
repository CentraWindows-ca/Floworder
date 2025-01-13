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
  const { data, onChange, orderId, isEditable, onHide } = useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnOptionsContainer)}>
      <DisplayBlock>
        <div>
          <Editable.EF_Checkbox
            id="rushOrder"
            options={[]}
            value={data?.rushOrder}
            onChange={(v) => onChange(v, "rushOrder")}
            disabled = {!isEditable}
          />
        </div>
        <label htmlFor="rushOrder">Rush Order</label>
      </DisplayBlock>
    </div>
  );
};

export default Com;
