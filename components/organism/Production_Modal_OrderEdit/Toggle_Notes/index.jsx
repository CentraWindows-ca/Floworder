import React, { useState, useEffect, useContext, useMemo } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import {
  labelMapping,
  applyField,
  spreadFacilities,
  getFieldCode,
} from "lib/constants/production_constants_labelMapping";

import Editable from "components/molecule/Editable";
// styles
import styles from "./styles.module.scss";
import stylesRoot from "../styles.module.scss";

import {
  LocalDataContext,
  LocalDataContext_data,
  GeneralContext,
} from "../LocalDataProvider";
import {
  ToggleFull,
  NoData,
  DisplayBlock,
  displayFilter,
  SaveButton,
} from "../Com";

// const group = "notes";
const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_Text,
    fieldCode: "w_OfficeNotes",
  },
  { Component: Editable.EF_Text, fieldCode: "d_OfficeNotes" },
  { Component: Editable.EF_Text, fieldCode: "w_PlantNotes" },
  { Component: Editable.EF_Text, fieldCode: "d_DoorShopNotes" },
  { Component: Editable.EF_Text, fieldCode: "m_ProjectManagementNotes" },
  { Component: Editable.EF_Text, fieldCode: "m_ReturnTripNotes" },
  { Component: Editable.EF_Text, fieldCode: "m_ShippingNotes" },
]);

const Com = ({}) => {
  const { permissions } = useContext(GeneralContext);
  const { data, validationResult } = useContext(LocalDataContext_data);
  const [groupInputs, setGroupInputs] = useState([]);

  const {
    initData,
    kind,
    uiOrderType,
    onChange,
    checkEditable,
    checkAddOnField,
    onHide,
    initWithOriginalStructure,
  } = useContext(LocalDataContext);

  useEffect(() => {
    let _filteredFields = displayFilter(COMMON_FIELDS, {
      kind,
      uiOrderType,
      permissions,
      initWithOriginalStructure,
    });

    _filteredFields = spreadFacilities(
      _filteredFields,
      initWithOriginalStructure,
    );

    const { master, facilities } = _filteredFields;
    const masterObj = {
      facility: "Work Order",
      facilityRoleType: "",
      fields: master,
    };

    const _groupInputs = [...facilities, masterObj];
    setGroupInputs(_groupInputs);
  }, [kind, uiOrderType]);

  // const _isEmpty = jsxFacilities

  const result = _.chain(groupInputs)
    .map((facility) => ({
      ...facility,
      fields: _.filter(facility.fields, (f) => data[f.field]),
    }))
    .filter((facility) => !_.isEmpty(facility.fields))
    .value();

  const jsxFacilities = (a) => {
    const { facility, fields } = a;
    return (
      <React.Fragment key={`closed_${facility}`}>
        <thead className={styles.facilityHeader}>
          <tr>
            <td colSpan={2}>{facility} Notes</td>
          </tr>
        </thead>
        <tbody>
          {fields?.map((b) => {
            const { fieldCode, field, title } = b;

            return (
              <DisplayBlock blockId={fieldCode} key={field}>
                <tr key={field}>
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
                    {" "}
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
      </React.Fragment>
    );
  };

  const jsxClose = (
    <div
      className={cn(
        "flex-column flex gap-2 text-left",
        styles.collapsedContainer,
      )}
    >
      {result?.length > 0 ? (
        <div
          className={cn(
            "flex-column flex gap-2 text-left",
            styles.collapsedContainer,
          )}
        >
          <table className="bordered table-hover table">
            {result?.map(jsxFacilities)}
          </table>
        </div>
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

  const jsxNoteBlock = (field) => {
    const fieldCode = getFieldCode(field);
    const addon = checkAddOnField({ id: fieldCode });
    const addonClass = addon?.isSyncedFromParent
      ? stylesRoot.addonSync_input
      : "";

    return (
      <DisplayBlock blockId={fieldCode}>
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
        {groupInputs?.map((a) => {
          const { facility, fields } = a;
          return (
            <React.Fragment>
              <div className={cn(stylesRoot.columnFacility)}>
                <span>{facility} Notes</span>
              </div>
              <div className={cn("grid grid-cols-2", styles.notesContainer)}>
                {fields?.map((a) => {
                  return (
                    <React.Fragment key={a.field}>
                      {jsxNoteBlock(a.field)}
                    </React.Fragment>
                  );
                })}
              </div>
            </React.Fragment>
          );
        })}
        {/* 
        <hr />

        <div className={cn("grid grid-cols-2", styles.notesContainer)}>
          {jsxNoteBlock("w_OfficeNotes")}
          {jsxNoteBlock("d_OfficeNotes")}
          {jsxNoteBlock("w_PlantNotes")}
          {jsxNoteBlock("d_DoorShopNotes")}
          {jsxNoteBlock("m_ProjectManagementNotes")}
          {jsxNoteBlock("m_ReturnTripNotes")}
          {jsxNoteBlock("m_ShippingNotes")}
        </div> */}
      </ToggleFull>
    </>
  );
};

export default Com;
