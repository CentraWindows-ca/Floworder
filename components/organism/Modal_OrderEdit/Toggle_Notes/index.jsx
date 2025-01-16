import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleFull } from "../Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, onHide } =
    useContext(LocalDataContext);

  const jsxClose = (
    <div className="flex-column flex gap-2 p-2 text-left">
      <div>[shipping] notes notes</div>
      <div>[shipping] notes notes</div>
    </div>
  );

  return (
    <ToggleFull
      title={"Notes"}
      titleClass={styles.title}
      jsxClose={jsxClose}
      id={"notes"}
    >
      <div className="grid grid-cols-2 gap-3 p-2">
        {/* notes */}
        <div>
          <div
            className={cn(
              styles.notesHeader,
              "justify-content-between align-items-center mb-2 flex",
            )}
          >
            <label>Shipping</label>
            <button disabled={!isEditable} className="btn btn-primary btn-xs">
              Save
            </button>
          </div>
          <Editable.EF_Text
            k="shippingNotes"
            options={[]}
            value={data?.shippingNotes}
            onChange={(v) => onChange(v, "shippingNotes")}
            disabled={!isEditable}
            rows={3}
          />
        </div>
        {/* notes */}
        <div>
          <div
            className={cn(
              styles.notesHeader,
              "justify-content-between align-items-center mb-2 flex",
            )}
          >
            <label>Office</label>
            <button disabled={!isEditable} className="btn btn-primary btn-xs">
              Save
            </button>
          </div>
          <Editable.EF_Text
            k="shippingNotes"
            options={[]}
            value={data?.shippingNotes}
            onChange={(v) => onChange(v, "shippingNotes")}
            disabled={!isEditable}
            rows={3}
          />
        </div>{" "}
        {/* notes */}
        <div>
          <div
            className={cn(
              styles.notesHeader,
              "justify-content-between align-items-center mb-2 flex",
            )}
          >
            <label>Plant</label>
            <button disabled={!isEditable} className="btn btn-primary btn-xs">
              Save
            </button>
          </div>
          <Editable.EF_Text
            k="shippingNotes"
            options={[]}
            value={data?.shippingNotes}
            onChange={(v) => onChange(v, "shippingNotes")}
            disabled={!isEditable}
            rows={3}
          />
        </div>{" "}
        {/* notes */}
        <div>
          <div
            className={cn(
              styles.notesHeader,
              "justify-content-between align-items-center mb-2 flex",
            )}
          >
            <label>Project Management</label>
            <button disabled={!isEditable} className="btn btn-primary btn-xs">
              Save
            </button>
          </div>
          <Editable.EF_Text
            k="shippingNotes"
            options={[]}
            value={data?.shippingNotes}
            onChange={(v) => onChange(v, "shippingNotes")}
            disabled={!isEditable}
            rows={3}
          />
        </div>{" "}
        {/* notes */}
        <div>
          <div
            className={cn(
              styles.notesHeader,
              "justify-content-between align-items-center mb-2 flex",
            )}
          >
            <label>Door Shop</label>
            <button disabled={!isEditable} className="btn btn-primary btn-xs">
              Save
            </button>
          </div>
          <Editable.EF_Text
            k="shippingNotes"
            options={[]}
            value={data?.shippingNotes}
            onChange={(v) => onChange(v, "shippingNotes")}
            disabled={!isEditable}
            rows={3}
          />
        </div>{" "}
        {/* notes */}
        <div>
          <div
            className={cn(
              styles.notesHeader,
              "justify-content-between align-items-center mb-2 flex",
            )}
          >
            <label>Returned Job</label>
            <div className="flex gap-2">
              <Editable.EF_Date
                k="productionStart"
                value={data?.productionStart}
                onChange={(v) => onChange(v, "productionStart")}
                disabled={!isEditable}
                size = {'sm'}
              />
              <button disabled={!isEditable} className="btn btn-primary btn-xs">
                Save
              </button>
            </div>
          </div>
          <Editable.EF_Text
            k="shippingNotes"
            options={[]}
            value={data?.shippingNotes}
            onChange={(v) => onChange(v, "shippingNotes")}
            disabled={!isEditable}
            rows={3}
          />
        </div>
      </div>
    </ToggleFull>
  );
};

export default Com;
