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
      <DisplayBlock data={data} id="w_ProductionStartDate">
        <label className="justify-content-start align-items-center flex">
          {" "}
          Windows Production Start
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="w_ProductionStartDate"
            value={data?.w_ProductionStartDate}
            onChange={(v) => onChange(v, "w_ProductionStartDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="w_ProductionEndDate">
        <label className="justify-content-start align-items-center flex">
          {" "}
          Windows Production End
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="w_ProductionEndDate"
            value={data?.w_ProductionEndDate}
            onChange={(v) => onChange(v, "w_ProductionEndDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="d_ProductionStartDate">
        <label className="justify-content-start align-items-center flex">
          {" "}
          Doors Production Start
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="d_ProductionStartDate"
            value={data?.d_ProductionStartDate}
            onChange={(v) => onChange(v, "d_ProductionStartDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="d_ProductionEndDate">
        <label className="justify-content-start align-items-center flex">
          {" "}
          Doors Production End
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="d_ProductionEndDate"
            value={data?.d_ProductionEndDate}
            onChange={(v) => onChange(v, "d_ProductionEndDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="m_ShippingStartDate">
        <label className="justify-content-start align-items-center flex">
          Shipping Start
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="m_ShippingStartDate"
            value={data?.m_ShippingStartDate}
            onChange={(v) => onChange(v, "m_ShippingStartDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="m_ShippingEndDate">
        <label className="justify-content-start align-items-center flex">
          Shipping End
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="m_ShippingEndDate"
            value={data?.m_ShippingEndDate}
            onChange={(v) => onChange(v, "m_ShippingEndDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="m_CustomerDate">
        <label className="justify-content-start align-items-center flex">
          Customer Date
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="m_CustomerDate"
            value={data?.m_CustomerDate}
            onChange={(v) => onChange(v, "m_CustomerDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="m_RevisedDeliveryDate">
        <label className="justify-content-start align-items-center flex">
          Revised Delivery Date
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="m_RevisedDeliveryDate"
            value={data?.m_RevisedDeliveryDate}
            onChange={(v) => onChange(v, "m_RevisedDeliveryDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      {/* <DisplayBlock data={data} id="m_InstallationDate">
        <label className="justify-content-start align-items-center flex">
          Installation Date [???]
        </label>
        <div className="justify-content-end align-items-center flex">
          <Editable.EF_Date
            k="m_InstallationDate"
            value={data?.m_InstallationDate}
            onChange={(v) => onChange(v, "m_InstallationDate")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock> */}
    </div>
  );
};

export default Com;
