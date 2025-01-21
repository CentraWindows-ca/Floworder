import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
import constants from "lib/constants";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, onHide, dictionary } =
    useContext(LocalDataContext);

    console.log(data)

  return (
    <div className={cn(styles.columnInputsContainer)}>
      <DisplayBlock data={data} id="m_BranchId">
        <label>Branch</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="m_BranchId"
            options={constants.WorkOrderSelectOptions.branches}
            value={data?.m_BranchId}
            onChange={(v) => onChange(v, "m_BranchId")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      {/* blockNo Windows and Doors */}
      <DisplayBlock data={data} id="w_BlockNo">
        <label>Window Block NO.</label>
        <div>
          <Editable.EF_Input
            k="w_BlockNo"
            value={data?.w_BlockNo || ""}
            onChange={(v) => onChange(v, "w_BlockNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="d_BlockNo">
        <label>Door Block NO.</label>
        <div>
          <Editable.EF_Input
            k="d_BlockNo"
            value={data?.d_BlockNo || ""}
            onChange={(v) => onChange(v, "d_BlockNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      {/* batchNo Windows and Doors*/}
      <DisplayBlock data={data} id="w_BatchNo">
        <label>Window Batch NO.</label>
        <div>
          <Editable.EF_Input
            k="w_BatchNo"
            value={data?.w_BatchNo || ""}
            onChange={(v) => onChange(v, "w_BatchNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="d_BatchNo">
        <label>Door Batch NO.</label>
        <div>
          <Editable.EF_Input
            k="d_BatchNo"
            value={data?.d_BatchNo || ""}
            onChange={(v) => onChange(v, "d_BatchNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      <DisplayBlock data={data} id="m_ManufacturingFacility">
        <label>Manufacturing Facility</label>
        <div>
          <Editable.EF_Select
            k="m_ManufacturingFacility"
            options={constants.ManufacturingFacilities}
            value={data?.m_ManufacturingFacility}
            onChange={(v) => onChange(v, "m_ManufacturingFacility")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="m_ShippingType">
        <label>Shipping Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="m_ShippingType"
            options={constants.WorkOrderSelectOptions.shippingTypes}
            value={data?.m_ShippingType}
            onChange={(v) => onChange(v, "m_ShippingType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="w_GlassSupplier">
        <label>Window Glass Supplier</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="w_GlassSupplier"
            options={constants.WorkOrderSelectOptions.glassSuppliers}
            value={data?.w_GlassSupplier}
            onChange={(v) => onChange(v, "w_GlassSupplier")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="d_GlassSupplier">
        <label>Door Glass Supplier</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="d_GlassSupplier"
            options={constants.WorkOrderSelectOptions.glassSuppliers}
            value={data?.d_GlassSupplier}
            onChange={(v) => onChange(v, "d_GlassSupplier")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      <DisplayBlock data={data} id="w_GlassOptions">
        <label>Glass Option</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="w_GlassOptions"
            options={constants.WorkOrderSelectOptions.glassOptions}
            value={data?.w_GlassOptions}
            onChange={(v) => onChange(v, "w_GlassOptions")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      <DisplayBlock data={data} id="m_ResidentialType">
        <label>Residential Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="m_ResidentialType"
            options={constants.WorkOrderSelectOptions.residentialTypes}
            value={data?.m_ResidentialType}
            onChange={(v) => onChange(v, "m_ResidentialType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      <DisplayBlock data={data} id="m_JobType">
        <label>Job Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="m_JobType"
            options={constants.WorkOrderSelectOptions.jobTypes}
            value={data?.m_JobType}
            onChange={(v) => onChange(v, "m_JobType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="m_CustomerType">
        <label>Customer Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="m_CustomerType"
            options={constants.WorkOrderSelectOptions.customerTypes}
            value={data?.m_CustomerType}
            onChange={(v) => onChange(v, "m_CustomerType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="m_Project">
        <label>Project</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="m_Project"
            options={constants.WorkOrderSelectOptions.project}
            value={data?.m_Project}
            onChange={(v) => onChange(v, "m_Project")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="m_SalesRep">
        <label>Sales Reps</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="m_SalesRep"
            placeholder="-"
            options={dictionary?.salesRepsList?.map((a) => {
              const { name: salesRepName, department, email } = a;

              // some email empty. cant use it as reliable value
              return {
                label: salesRepName,
                value: salesRepName,
                key: salesRepName,
              };
            })}
            value={data?.m_SalesRep}
            onChange={(v) => onChange(v, "m_SalesRep")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
    </div>
  );
};

export default Com;
