import React, { useState, useEffect, useContext, useMemo } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import {
  labelMapping,
  applyField,
} from "lib/constants/production_constants_labelMapping";

import Editable from "components/molecule/Editable";
// styles
import styles from "./styles.module.scss";
import stylesRoot from "../styles.module.scss";

import { LocalDataContext,LocalDataContext_data, GeneralContext } from "../LocalDataProvider";
import {
  ToggleFull,
  NoData,
  DisplayBlock,
  displayFilter,
  SaveButton,
} from "../Com";

// const group = "notes";

const Com = ({}) => {
  const { permissions } = useContext(GeneralContext);
  const { data, validationResult } = useContext(LocalDataContext_data);
  const {
    initData,
    kind,
    uiOrderType,
    onChange,
    checkEditable,
    checkAddOnField,
    onHide,
    initWithOriginalStructure
  } = useContext(LocalDataContext);

  const COMMON_FIELDS = applyField([
    { fieldCode: "w_OfficeNotes" },
    { fieldCode: "d_OfficeNotes" },
    { fieldCode: "w_PlantNotes" },
    { fieldCode: "d_DoorShopNotes" },
    { fieldCode: "m_ProjectManagementNotes" },
    { fieldCode: "m_ReturnTripNotes" },
    { fieldCode: "m_ShippingNotes" },
  ]);

  let collapsedList = COMMON_FIELDS.filter((a) => {
    const field = a.fieldCode
    return data?.[field];
  });

  collapsedList = displayFilter(collapsedList, {
    kind,
    uiOrderType,
    permissions,
    initWithOriginalStructure
  });

  const jsxClose = (
    <div
      className={cn(
        "flex-column flex gap-2 text-left",
        styles.collapsedContainer,
      )}
    >
      {collapsedList?.length > 0 ? (
        <table className="bordered table-hover table">
          <tbody>
            {collapsedList?.map((a) => {
              const { fieldCode, title } = a;

              const field = fieldCode

              return (
                <DisplayBlock fieldCode={fieldCode} key={field}>
                  <tr>
                    <th
                      style={{
                        whiteSpace: "nowrap",
                        width: "100px",
                        paddingRight: "20px",
                      }}
                    >
                      <b>{title}</b>
                    </th>
                    <td>
                      <div
                        className={cn(styles.notesText)}
                        dangerouslySetInnerHTML={{
                          __html: data?.[field],
                        }}
                      />
                    </td>
                  </tr>
                </DisplayBlock>
              );
            })}
          </tbody>
        </table>
      ) : (
        <NoData
          title={
            <>
              No Data <b>[Click To Add Notes]</b>
            </>
          }
          className="hover:text-blue-600"
        />
      )}
    </div>
  );

  const jsxNoteBlock = (fieldCode) => {
    const field = fieldCode
    const addon = checkAddOnField({ id: fieldCode });
    const addonClass = addon?.isSyncedFromParent
      ? stylesRoot.addonSync_input
      : "";

    return (
      <DisplayBlock fieldCode={fieldCode}>
        <div>
          <div
            className={cn(
              styles.notesHeader,
              "justify-content-between align-items-center flex",
            )}
          >
            <label>{labelMapping[fieldCode]?.title}</label>
          </div>
          <Editable.EF_Text
            k={field}
            value={data?.[field]}
            initValue={initData?.[field]}
            isHighlightDiff
            onChange={(v) => onChange(v, field)}
            disabled={!checkEditable({ fieldCode })}
            className={cn(addonClass)}
            errorMessage={validationResult?.[field]}
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
          {jsxNoteBlock("w_OfficeNotes")}
          {jsxNoteBlock("d_OfficeNotes")}
          {jsxNoteBlock("w_PlantNotes")}
          {jsxNoteBlock("d_DoorShopNotes")}
          {jsxNoteBlock("m_ProjectManagementNotes")}
          {jsxNoteBlock("m_ReturnTripNotes")}
          {jsxNoteBlock("m_ShippingNotes")}
        </div>
      </ToggleFull>
    </>
  );
};

export default Com;
