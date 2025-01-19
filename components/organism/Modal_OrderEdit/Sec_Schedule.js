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
  const { data, onChange, isEditable, onHide } = useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnInputsContainer)}>
      <DisplayBlock data={data} id="WIN.productionStart">
        <label className="justify-content-start align-items-center flex">
          {" "}
          Windows Production Start
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="WIN.productionStart"
            value={data?.WIN?.productionStart}
            onChange={(v) => onChange(v, "WIN.productionStartDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="WIN.productionEndDate">
        <label className="justify-content-start align-items-center flex">
          {" "}
          Windows Production End
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="WIN.productionEndDate"
            value={data?.WIN?.productionEndDate}
            onChange={(v) => onChange(v, "WIN.productionEndDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="DOOR.productionStartDate">
        <label className="justify-content-start align-items-center flex">
          {" "}
          Doors Production Start
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="DOOR.productionStartDate"
            value={data?.DOOR?.productionStartDate}
            onChange={(v) => onChange(v, "DOOR.productionStartDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="DOOR.productionEndDate">
        <label className="justify-content-start align-items-center flex">
          {" "}
          Doors Production End
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="DOOR.productionEndDate"
            value={data?.DOOR?.productionEndDate}
            onChange={(v) => onChange(v, "DOOR.productionEndDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="MASTER.shippingStartDate">
        <label className="justify-content-start align-items-center flex">
          Shipping Start
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="MASTER.shippingStartDate"
            value={data?.MASTER?.shippingStartDate}
            onChange={(v) => onChange(v, "MASTER.shippingStartDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="MASTER.shippingEndDate">
        <label className="justify-content-start align-items-center flex">
          Shipping End
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="MASTER.shippingEndDate"
            value={data?.MASTER?.shippingEndDate}
            onChange={(v) => onChange(v, "MASTER.shippingEndDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="MASTER.customerDate">
        <label className="justify-content-start align-items-center flex">
          Customer Date
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="MASTER.customerDate"
            value={data?.MASTER?.customerDate}
            onChange={(v) => onChange(v, "MASTER.customerDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="MASTER.RevisedDeliveryDate">
        <label className="justify-content-start align-items-center flex">
          Revised Delivery Date
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="MASTER.RevisedDeliveryDate"
            value={data?.MASTER?.RevisedDeliveryDate}
            onChange={(v) => onChange(v, "MASTER.RevisedDeliveryDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      <DisplayBlock data={data} id="MASTER.installationDate">
        <label className="justify-content-start align-items-center flex">
          Installation Date [???]
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="MASTER.installationDate"
            value={data?.MASTER?.installationDate}
            onChange={(v) => onChange(v, "MASTER.installationDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
    </div>
  );
};

export default Com;
