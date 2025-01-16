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

    console.log("master", data)

  return (
    <div className={cn(styles.columnInputsContainer)}>
      <DisplayBlock data={data} id="MASTER.branchId">
        <label>Branch</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="MASTER.branchId"
            options={constants.WorkOrderSelectOptions.branches}
            value={data?.MASTER?.branchId || ""}
            onChange={(v) => onChange(v, "MASTER.branchId")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      {/* blockNo Windows and Doors */}
      <DisplayBlock data={data} id="WINDOW.blockNo">
        <label>Window Block NO.</label>
        <div>
          <Editable.EF_Input
            k="WINDOW.blockNo"
            value={data?.WINDOW?.blockNo || ""}
            onChange={(v) => onChange(v, "WINDOW.blockNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="DOOR.blockNo">
        <label>Door Block NO.</label>
        <div>
          <Editable.EF_Input
            k="DOOR.blockNo"
            value={data?.DOOR?.blockNo || ""}
            onChange={(v) => onChange(v, "DOOR?.blockNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      {/* batchNo Windows and Doors*/}
      <DisplayBlock data={data} id="WINDOW.batchNo">
        <label>Window Batch NO.</label>
        <div>
          <Editable.EF_Input
            k="DOOR.batchNo"
            value={data?.WINDOW?.batchNo || ""}
            onChange={(v) => onChange(v, "WINDOW.batchNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="DOOR.batchNo">
        <label>Door Batch NO.</label>
        <div>
          <Editable.EF_Input
            k="DOOR.batchNo"
            value={data?.DOOR?.batchNo || ""}
            onChange={(v) => onChange(v, "DOOR.batchNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>


      <DisplayBlock data={data} id="MASTER.manufacturingFacility">
        <label>Manufacturing Facility</label>
        <div>
          <Editable.EF_Select
            k="MASTER.manufacturingFacility"
            options={constants.ManufacturingFacilities}
            value={data?.MASTER?.manufacturingFacility}
            onChange={(v) => onChange(v, "MASTER.manufacturingFacility")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="MASTER.shippingType">
        <label>Shipping Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="MASTER.shippingType"
            options={constants.WorkOrderSelectOptions.shippingTypes}
            value={data?.MASTER?.shippingType}
            onChange={(v) => onChange(v, "MASTER.shippingType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="glassSupplier">
        <label>Glass Supplier</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="glassSupplier"
            options={constants.WorkOrderSelectOptions.glassSuppliers}
            value={data?.glassSupplier}
            onChange={(v) => onChange(v, "glassSupplier")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="glassOption">
        <label>Glass Option</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="glassOption"
            options={constants.WorkOrderSelectOptions.glassOptions}
            value={data?.glassOption}
            onChange={(v) => onChange(v, "glassOption")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      <DisplayBlock data={data} id="residentialType">
        <label>Residential Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="residentialType"
            options={constants.WorkOrderSelectOptions.residentialTypes}
            value={data?.residentialType}
            onChange={(v) => onChange(v, "residentialType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      <DisplayBlock data={data} id="jobType">
        <label>Job Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="jobType"
            options={constants.WorkOrderSelectOptions.jobTypes}
            value={data?.jobType}
            onChange={(v) => onChange(v, "jobType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="customerType">
        <label>Customer Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="customerType"
            options={constants.WorkOrderSelectOptions.customerTypes}
            value={data?.customerType}
            onChange={(v) => onChange(v, "customerType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="project">
        <label>Project</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="project"
            options={constants.WorkOrderSelectOptions.project}
            value={data?.project}
            onChange={(v) => onChange(v, "project")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="salesReps">
        <label>Sales Reps</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="salesReps"
            placeholder = "-"
            options={dictionary?.salesRepsList?.map((a) => {
              const { name: salesRepName, department, email } = a;

              // some email empty. cant use it as reliable value
              return {
                label: salesRepName,
                value: salesRepName,
                key: salesRepName,
              };
            })}
            value={data?.salesReps}
            onChange={(v) => onChange(v, "salesReps")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
    </div>
  );
};

export default Com;
