import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleFull, DisplayBlock } from "../Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, onHide } = useContext(LocalDataContext);

  const displayNotes = {
    Shipping: data?.MASTER?.shippingNotes,
    "Window Office Notes": data?.WIN?.officeNotes,
    "Door Office Notes": data?.DOOR?.officeNotes,
    "Window Plant Notes": data?.WIN?.plantNotes,
    "Door Plant Notes": data?.DOOR?.plantNotes,
    "Project Management": data?.MASTER?.projectNotes,
    "Door Shop": data?.DOOR?.doorShopNotes,
    "Window Returned Job": data?.WIN?.returnTripNotes,
    "Door Returned Job": data?.DOOR?.returnTripNotes,
  };

  const jsxClose = (
    <div className="flex-column flex gap-2 p-2 text-left">
      {_.keys(displayNotes)?.map((k) => {
        if (!displayNotes[k]) return null
        return (
          <div key={k}>
            <b>[{k}]</b>:{" "}
            <p dangerouslySetInnerHTML={{ __html: displayNotes[k] }} />
          </div>
        );
      })}
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
        <DisplayBlock id="MASTER.shippingNotes">
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
              k="MASTER.shippingNotes"
              value={data?.MASTER?.shippingNotes}
              onChange={(v) => onChange(v, "MASTER.shippingNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>
        {/* notes */}
        <DisplayBlock id="WIN.officeNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Window Office Notes</label>
              <button disabled={!isEditable} className="btn btn-primary btn-xs">
                Save
              </button>
            </div>
            <Editable.EF_Text
              k="WIN.officeNotes"
              value={data?.WIN?.officeNotes}
              onChange={(v) => onChange(v, "WIN.officeNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>

        <DisplayBlock id="DOOR.officeNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Door Office Notes</label>
              <button disabled={!isEditable} className="btn btn-primary btn-xs">
                Save
              </button>
            </div>
            <Editable.EF_Text
              k="DOOR.officeNotes"
              value={data?.DOOR?.officeNotes}
              onChange={(v) => onChange(v, "DOOR.officeNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>

        {/* notes */}
        <DisplayBlock id="WIN.plantNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Window Plant Notes</label>
              <button disabled={!isEditable} className="btn btn-primary btn-xs">
                Save
              </button>
            </div>
            <Editable.EF_Text
              k="WIN.plantNotes"
              value={data?.WIN?.plantNotes}
              onChange={(v) => onChange(v, "WIN.plantNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>
        <DisplayBlock id="DOOR.plantNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Door Plant Notes</label>
              <button disabled={!isEditable} className="btn btn-primary btn-xs">
                Save
              </button>
            </div>
            <Editable.EF_Text
              k="DOOR.plantNotes"
              value={data?.DOOR?.plantNotes}
              onChange={(v) => onChange(v, "DOOR.plantNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>

        {/* notes */}
        <DisplayBlock id="MASTER.projectNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Project Notes</label>
              <button disabled={!isEditable} className="btn btn-primary btn-xs">
                Save
              </button>
            </div>
            <Editable.EF_Text
              k="MASTER.projectNotes"
              value={data?.MASTER?.projectNotes}
              onChange={(v) => onChange(v, "MASTER.projectNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>
        {/* notes */}
        <DisplayBlock id="MASTER.doorShopNotes">
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
              k="DOOR.doorShopNotes"
              value={data?.DOOR?.doorShopNotes}
              onChange={(v) => onChange(v, "DOOR.doorShopNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>
        {/* notes */}
        <DisplayBlock id="WIN.returnTripNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Window Returned Job</label>
              {/* <div className="flex gap-2">
              <Editable.EF_Date
                k="productionStart"
                value={data?.productionStart}
                onChange={(v) => onChange(v, "productionStart")}
                disabled={!isEditable}
                size={"sm"}
              />
              <button disabled={!isEditable} className="btn btn-primary btn-xs">
                Save
              </button>
            </div> */}
            </div>
            <Editable.EF_Text
              k="WIN.returnTripNotes"
              value={data?.WIN?.returnTripNotes}
              onChange={(v) => onChange(v, "WIN.returnTripNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>

        <DisplayBlock id="DOOR.returnTripNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Door Returned Job</label>
              {/* <div className="flex gap-2">
                <Editable.EF_Date
                  k="productionStart"
                  value={data?.productionStart}
                  onChange={(v) => onChange(v, "productionStart")}
                  disabled={!isEditable}
                  size={"sm"}
                />
                <button
                  disabled={!isEditable}
                  className="btn btn-primary btn-xs"
                >
                  Save
                </button>
              </div> */}
            </div>
            <Editable.EF_Text
              k="DOOR.returnTripNotes"
              value={data?.DOOR?.returnTripNotes}
              onChange={(v) => onChange(v, "DOOR.returnTripNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>
      </div>
    </ToggleFull>
  );
};

export default Com;
