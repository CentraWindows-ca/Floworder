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
      <DisplayBlock data={data} id="WIN.blockNo">
        <label>Window Block NO.</label>
        <div>
          <Editable.EF_Input
            k="WIN.blockNo"
            value={data?.WIN?.blockNo || ""}
            onChange={(v) => onChange(v, "WIN.blockNo")}
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
            onChange={(v) => onChange(v, "DOOR.blockNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      {/* batchNo Windows and Doors*/}
      <DisplayBlock data={data} id="WIN.batchNo">
        <label>Window Batch NO.</label>
        <div>
          <Editable.EF_Input
            k="DOOR.batchNo"
            value={data?.WIN?.batchNo || ""}
            onChange={(v) => onChange(v, "WIN.batchNo")}
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
      <DisplayBlock data={data} id="MASTER.glassSupplier">
        <label>Glass Supplier</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="MASTER.glassSupplier"
            options={constants.WorkOrderSelectOptions.glassSuppliers}
            value={data?.MASTER?.glassSupplier}
            onChange={(v) => onChange(v, "MASTER.glassSupplier")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="MASTER.glassOption">
        <label>Glass Option</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="MASTER.glassOption"
            options={constants.WorkOrderSelectOptions.glassOptions}
            value={data?.MASTER?.glassOption}
            onChange={(v) => onChange(v, "MASTER.glassOption")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      <DisplayBlock data={data} id="MASTER.residentialType">
        <label>Residential Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="MASTER.residentialType"
            options={constants.WorkOrderSelectOptions.residentialTypes}
            value={data?.MASTER?.residentialType}
            onChange={(v) => onChange(v, "MASTER.residentialType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>

      <DisplayBlock data={data} id="MASTER.jobType">
        <label>Job Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="MASTER.jobType"
            options={constants.WorkOrderSelectOptions.jobTypes}
            value={data?.MASTER?.jobType}
            onChange={(v) => onChange(v, "MASTER.jobType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="MASTER.customerType">
        <label>Customer Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="MASTER.customerType"
            options={constants.WorkOrderSelectOptions.customerTypes}
            value={data?.MASTER?.customerType}
            onChange={(v) => onChange(v, "MASTER.customerType")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="MASTER.project">
        <label>Project</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="MASTER.project"
            options={constants.WorkOrderSelectOptions.project}
            value={data?.MASTER?.project}
            onChange={(v) => onChange(v, "MASTER.project")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="MASTER.salesReps">
        <label>Sales Reps</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="MASTER.salesReps"
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
            value={data?.MASTER?.salesReps}
            onChange={(v) => onChange(v, "MASTER.salesReps")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
    </div>
  );
};

export default Com;
