import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleFull, NoData, DisplayBlock, displayFilter } from "../Com";

const Com = ({}) => {
  const { data, kind, uiOrderType, onChange, checkEditable, onHide } =
    useContext(LocalDataContext);

  const COMMON_FIELDS = constants.applyField([
    { id: "m_ShippingNotes" },
    { id: "m_ProjectManagementNotes" },
    { id: "m_ReturnTripNotes" },
    { id: "w_OfficeNotes" },
    { id: "w_PlantNotes" },
    { id: "d_OfficeNotes" },
    { id: "d_DoorShopNotes" },
  ]);

  let collapsedList = COMMON_FIELDS.filter((a) => {
    return data?.[a.id];
  });

  collapsedList = displayFilter(collapsedList, { kind, uiOrderType });

  const jsxClose = (
    <div
      className={cn(
        "flex-column flex gap-2 text-left",
        styles.collapsedContainer,
      )}
    >
      {collapsedList?.length > 0 ? (
        <table className="table bordered table-hover">
          <tbody>
            {collapsedList?.map((a) => {
              const { id, title } = a;
              return (
                <DisplayBlock id={id} key={id}>
                  <tr>
                    <th style={{whiteSpace: 'nowrap', width: '100px', paddingRight: '20px'}}>
                      <b>{title}</b>
                    </th>
                    <td>
                      <div
                        className={cn(styles.notesText)}
                        dangerouslySetInnerHTML={{
                          __html: data?.[id],
                        }}
                      />
                    </td>
                  </tr>
                </DisplayBlock>
              );
            })}{" "}
          </tbody>
        </table>
      ) : (
        <NoData title={`No Data`} className="hover:text-blue-600" />
      )}
    </div>
  );

  const jsxNoteBlock = (id) => {
    return (
      <DisplayBlock id={id}>
        <div>
          <div
            className={cn(
              styles.notesHeader,
              "justify-content-between align-items-center flex",
            )}
          >
            <label>{constants.constants_labelMapping[id]?.title}</label>
          </div>
          <Editable.EF_Text
            k={id}
            value={data?.[id]}
            onChange={(v) => onChange(v, id)}
            disabled={!checkEditable()}
            rows={3}
          />
        </div>
      </DisplayBlock>
    );
  };

  return (
    <>
      <ToggleFull
        title={"Notes"}
        titleClass={styles.title}
        jsxClose={jsxClose}
        id={"notes"}
      >
        <div className={cn("grid grid-cols-2", styles.notesContainer)}>
          {jsxNoteBlock("m_ShippingNotes")}
          {jsxNoteBlock("m_ProjectManagementNotes")}
          {jsxNoteBlock("m_ReturnTripNotes")}
          {jsxNoteBlock("w_OfficeNotes")}
          {jsxNoteBlock("w_PlantNotes")}
          {jsxNoteBlock("d_OfficeNotes")}
          {jsxNoteBlock("d_DoorShopNotes")}
        </div>
      </ToggleFull>
    </>
  );
};

export default Com;
