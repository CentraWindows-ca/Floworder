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
  const { data, onChange, isEditable, orderId, onHide, dictionary } =
    useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnInputsContainer)}>
      <DisplayBlock data={data} id="branch">
        <label>Branch</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="branch"
            options={constants.WorkOrderSelectOptions.branches}
            value={data?.branch || ""}
            onChange={(v) => onChange(v, "branch")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="blockNo">
        <label>Block NO.</label>
        <div>
          <Editable.EF_Input
            k="blockNo"
            value={data?.blockNo || ""}
            onChange={(v) => onChange(v, "blockNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="batchNo">
        <label>Batch NO.</label>
        <div>
          <Editable.EF_Input
            k="batchNo"
            value={data?.batchNo || ""}
            onChange={(v) => onChange(v, "batchNo")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="manufacturingFacility">
        <label>Manufacturing Facility</label>
        <div>
          <Editable.EF_Select
            k="manufacturingFacility"
            options={constants.ManufacturingBuildings}
            value={data?.manufacturingFacility}
            onChange={(v) => onChange(v, "manufacturingFacility")}
            disabled={!isEditable}
          />
        </div>
      </DisplayBlock>
      <DisplayBlock data={data} id="shippingType">
        <label>Shipping Type</label>
        <div>
          <Editable.EF_SelectWithLabel
            k="shippingType"
            options={constants.WorkOrderSelectOptions.shippingTypes}
            value={data?.shippingType}
            onChange={(v) => onChange(v, "shippingType")}
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
