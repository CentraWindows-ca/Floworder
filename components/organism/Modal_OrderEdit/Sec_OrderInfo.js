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
        <label>Branch</label>
        <div>
          <Editable.EF_Select
            k="branch"
            options={[]}
            value={data?.branch}
            onChange={(v) => onChange(v, "branch")}
            disabled = {!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id='branch'>
        <label>Manufacturing Facility</label>
        <div>
          <Editable.EF_Select
            k="manufacturingFacility"
            options={[]}
            value={data?.manufacturingFacility}
            onChange={(v) => onChange(v, "manufacturingFacility")}
            disabled = {!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id='branch'>
        <label>Shipping Type</label>
        <div>
          <Editable.EF_Input
            k="shippingType"
            options={[]}
            value={data?.branch}
            onChange={() => onChange()}
            disabled = {!isEditable}
          />
        </div>
      </DisplayBlock>
    </div>
  );
};

export default Com;
