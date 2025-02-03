import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleFull, ToggleBlock, DisplayBlock, displayFilter } from "../Com";

const Com = ({ className, ...props }) => {
  const { data, kind, uiOrderType, onChange, isEditable, onHide } =
    useContext(LocalDataContext);

  const displayNotes = [
    { title: "Shipping", id: "m_ShippingNotes" },
    { title: "Window Office Notes", id: "w_OfficeNotes" },
    { title: "Door Office Notes", id: "d_OfficeNotes" },
    { title: "Window Plant Notes", id: "w_PlantNotes" },
    { title: "Door Plant Notes", id: "d_PlantNotes" },
    { title: "Project Notes", id: "m_ProjectManagementNotes" },
    { title: "Door Shop", id: "d_DoorShopNotes" },
    { title: "Window Returned Job", id: "w_ReturnTripNotes" },
    { title: "Door Returned Job", id: "d_ReturnTripNotes" },
  ];

  let collapsedList = displayNotes.filter((a) => {
    return data?.[a.id];
  });

  collapsedList = displayFilter(collapsedList, { kind, uiOrderType });

  const jsxClose = (
    <div className={cn("flex-column flex gap-2 text-left", styles.collapsedContainer)}>
      {collapsedList?.length > 0
        ? collapsedList?.map((a) => {
            const { id, title } = a;
            return (
              <DisplayBlock id={id} key={id}>
                <div className="flex gap-2">
                  <b>[{title}]</b>:{" "}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: data?.[id],
                    }}
                  />
                </div>
              </DisplayBlock>
            );
          })
        : <div className="text-blueGray-400 text-center">-- Click To Create Notes --</div>}
    </div>
  );

  return (
    <>
      {/* <ToggleFull
          title={"Notes"}
          titleClass={styles.title}
          jsxClose={jsxClose}
          id={"notes"}
        >
         */}
      <ToggleFull
        title={"Notes"}
        titleClass={styles.title}
        jsxClose={jsxClose}
        id={"notes"}
      >
        <div className={cn("grid grid-cols-2", styles.notesContainer)}>
          <DisplayBlock id="m_ShippingNotes">
            <div>
              <div
                className={cn(
                  styles.notesHeader,
                  "justify-content-between align-items-center flex",
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
                rows={2}
              />
            </div>
          </DisplayBlock>
          {/* notes */}
          <DisplayBlock id="w_OfficeNotes">
            <div>
              <div
                className={cn(
                  styles.notesHeader,
                  "justify-content-between align-items-center flex",
                )}
              >
                <label>Window Office Notes</label>
              </div>
              <Editable.EF_Text
                k="w_OfficeNotes"
                value={data?.w_OfficeNotes}
                onChange={(v) => onChange(v, "w_OfficeNotes")}
                disabled={!isEditable}
                rows={2}
              />
            </div>
          </DisplayBlock>
          <DisplayBlock id="d_OfficeNotes">
            <div>
              <div
                className={cn(
                  styles.notesHeader,
                  "justify-content-between align-items-center flex",
                )}
              >
                <label>Door Office Notes</label>
              </div>
              <Editable.EF_Text
                k="d_OfficeNotes"
                value={data?.d_OfficeNotes}
                onChange={(v) => onChange(v, "d_OfficeNotes")}
                disabled={!isEditable}
                rows={2}
              />
            </div>
          </DisplayBlock>
          {/* notes */}
          <DisplayBlock id="w_PlantNotes">
            <div>
              <div
                className={cn(
                  styles.notesHeader,
                  "justify-content-between align-items-center flex",
                )}
              >
                <label>Window Plant Notes</label>
              </div>
              <Editable.EF_Text
                k="w_PlantNotes"
                value={data?.w_PlantNotes}
                onChange={(v) => onChange(v, "w_PlantNotes")}
                disabled={!isEditable}
                rows={2}
              />
            </div>
          </DisplayBlock>
          <DisplayBlock id="d_PlantNotes">
            <div>
              <div
                className={cn(
                  styles.notesHeader,
                  "justify-content-between align-items-center flex",
                )}
              >
                <label>Door Plant Notes</label>{" "}
              </div>
              <Editable.EF_Text
                k="d_PlantNotes"
                value={data?.d_PlantNotes}
                onChange={(v) => onChange(v, "d_PlantNotes")}
                disabled={!isEditable}
                rows={2}
              />
            </div>
          </DisplayBlock>
          {/* notes */}
          <DisplayBlock id="m_ProjectManagementNotes">
            <div>
              <div
                className={cn(
                  styles.notesHeader,
                  "justify-content-between align-items-center flex",
                )}
              >
                <label>Project Notes</label>
              </div>
              <Editable.EF_Text
                k="m_ProjectManagementNotes"
                value={data?.m_ProjectManagementNotes}
                onChange={(v) => onChange(v, "m_ProjectManagementNotes")}
                disabled={!isEditable}
                rows={2}
              />
            </div>
          </DisplayBlock>
          {/* notes */}
          <DisplayBlock id="d_DoorShopNotes">
            <div>
              <div
                className={cn(
                  styles.notesHeader,
                  "justify-content-between align-items-center flex",
                )}
              >
                <label>Door Shop</label>
              </div>
              <Editable.EF_Text
                k="d_DoorShopNotes"
                value={data?.d_DoorShopNotes}
                onChange={(v) => onChange(v, "d_DoorShopNotes")}
                disabled={!isEditable}
                rows={2}
              />
            </div>
          </DisplayBlock>
          {/* notes */}
          <DisplayBlock id="w_ReturnTripNotes">
            <div>
              <div
                className={cn(
                  styles.notesHeader,
                  "justify-content-between align-items-center flex",
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
                rows={2}
              />
            </div>
          </DisplayBlock>
        </div>
      </ToggleFull>
    </>
  );
};

export default Com;
