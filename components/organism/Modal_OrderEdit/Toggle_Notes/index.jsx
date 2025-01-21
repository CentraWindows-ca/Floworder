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
    Shipping: "m_ShippingNotes",
    "Window Office Notes": "w_OfficeNotes",
    "Door Office Notes": "d_OfficeNotes",
    "Window Plant Notes": "w_PlantNotes",
    "Door Plant Notes": "d_PlantNotes",
    "Project Notes": "m_ProjectManagementNotes",
    "Door Shop": "d_DoorShopNotes",
    "Window Returned Job": "w_ReturnTripNotes",
    "Door Returned Job": "d_ReturnTripNotes",
  };

  const jsxClose = (
    <div className="flex-column flex gap-2 p-2 text-left">
      {_.keys(displayNotes)?.map((k) => {
        if (!data?.[displayNotes[k]]) return null;
        return (
          <DisplayBlock id={displayNotes[k]} key={displayNotes[k]}>
            <div className="flex">
              <b>[{k}]</b>:{" "}
              <div
                dangerouslySetInnerHTML={{ __html: data?.[displayNotes[k]] }}
              />
            </div>
          </DisplayBlock>
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
        <DisplayBlock id="m_ShippingNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Shipping</label>
              {/* <button disabled={!isEditable} className="btn btn-primary btn-xs">
                Save
              </button> */}
            </div>
            <Editable.EF_Text
              k="m_ShippingNotes"
              value={data?.m_ShippingNotes}
              onChange={(v) => onChange(v, "m_ShippingNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>
        {/* notes */}
        <DisplayBlock id="w_OfficeNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Window Office Notes</label>
            </div>
            <Editable.EF_Text
              k="w_OfficeNotes"
              value={data?.w_OfficeNotes}
              onChange={(v) => onChange(v, "w_OfficeNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>

        <DisplayBlock id="d_OfficeNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Door Office Notes</label>
            </div>
            <Editable.EF_Text
              k="d_OfficeNotes"
              value={data?.d_OfficeNotes}
              onChange={(v) => onChange(v, "d_OfficeNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>

        {/* notes */}
        <DisplayBlock id="w_PlantNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Window Plant Notes</label>
            </div>
            <Editable.EF_Text
              k="w_PlantNotes"
              value={data?.w_PlantNotes}
              onChange={(v) => onChange(v, "w_PlantNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>
        <DisplayBlock id="d_PlantNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Door Plant Notes</label>{" "}
            </div>
            <Editable.EF_Text
              k="d_PlantNotes"
              value={data?.d_PlantNotes}
              onChange={(v) => onChange(v, "d_PlantNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>

        {/* notes */}
        <DisplayBlock id="m_ProjectManagementNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Project Notes</label>
            </div>
            <Editable.EF_Text
              k="m_ProjectManagementNotes"
              value={data?.m_ProjectManagementNotes}
              onChange={(v) => onChange(v, "m_ProjectManagementNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>
        {/* notes */}
        <DisplayBlock id="d_DoorShopNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Door Shop</label>
            </div>
            <Editable.EF_Text
              k="d_DoorShopNotes"
              value={data?.d_DoorShopNotes}
              onChange={(v) => onChange(v, "d_DoorShopNotes")}
              disabled={!isEditable}
              rows={3}
            />
          </div>
        </DisplayBlock>
        {/* notes */}
        <DisplayBlock id="w_ReturnTripNotes">
          <div>
            <div
              className={cn(
                styles.notesHeader,
                "justify-content-between align-items-center mb-2 flex",
              )}
            >
              <label>Returned Job</label>
              <div className="flex gap-2">
                {/* <Editable.EF_Date
                k="productionStart"
                value={data?.productionStart}
                onChange={(v) => onChange(v, "productionStart")}
                disabled={!isEditable}
                size={"sm"}
              /> */}
              </div>
            </div>
            <Editable.EF_Text
              k="m_ReturnTripNotes"
              value={data?.m_ReturnTripNotes}
              onChange={(v) => onChange(v, "m_ReturnTripNotes")}
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
