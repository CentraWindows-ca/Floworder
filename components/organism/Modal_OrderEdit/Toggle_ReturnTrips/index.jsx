import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import {labelMapping, applyField} from "lib/constants/production_constants_labelMapping";

import Modal from "components/molecule/Modal";
// styles
import styles from "../styles.module.scss";
import utils from "lib/utils";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, NoData } from "../Com";
import Editable from "components/molecule/Editable";

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_DateOnly,
    id: "returnTripDate",
  },
  {
    Component: Editable.EF_Text,
    id: "returnTripNotes",
  },
]);

const Com = ({ title, id }) => {
  const {
    onDeleteReturnTrip,
    onAddReturnTrip,
    onEditReturnTrip,
    returnTrips,
    checkEditable,
    setReturnTrips,
  } = useContext(LocalDataContext);

  const [editingRow, setEditingRow] = useState(null);

  const handleSave = async () => {
    if (editingRow?.id) {
      await onEditReturnTrip(_.cloneDeep(editingRow));
    } else {
      await onAddReturnTrip(_.cloneDeep(editingRow));
    }

    setEditingRow(null);
  };

  const jsxTitle = (
    <div className="flex gap-2">
      {title}
      <div className="text-primary font-normal">
        ({returnTrips?.length || 0})
      </div>
    </div>
  );

  return (
    <ToggleBlock title={jsxTitle} id={id}>
      <div className={styles.togglePadding}>
        {checkEditable({ group: "returnTrips" }) && (
          <div className="justify-content-between align-items-center mb-2 flex border-b border-gray-200 pb-2">
            <div>
              <button
                className="btn btn-success"
                onClick={() => setEditingRow({})}
              >
                Add
              </button>
            </div>
          </div>
        )}
        {!_.isEmpty(returnTrips) ? (
          <table className="table-xs table-bordered table-hover mb-0 table border">
            <thead>
              <tr>
                <th style={{ width: "180px" }}>Return Trip Date</th>
                <th>Notes</th>
                <th style={{ width: "200px" }}>Submitted At</th>
                <th style={{ width: "140px" }}></th>
              </tr>
            </thead>
            <tbody>{returnTrips?.map((a) => {
                const {
                  returnTripDate,
                  returnTripNotes,
                  submittedBy,
                  submittedAt,
                  id,
                } = a;
                const submittedAt_display = utils.formatDate(
                  utils.formatDatetimeForMorganLegacy(submittedAt),
                );
                return (
                  <tr key={`${title}_${id}`}>
                    <td>{returnTripDate}</td>
                    <td className="text-left">
                      {submittedBy ? (
                        <>
                          <b>[{submittedBy}]:</b>
                          <br />
                        </>
                      ) : null}
                      {returnTripNotes || "--"}
                    </td>
                    <td>{submittedAt_display}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        disabled={!checkEditable({ group: "returnTrips" })}
                        onClick={() => setEditingRow(a)}
                      >
                        edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={!checkEditable({ group: "returnTrips" })}
                        onClick={() => onDeleteReturnTrip(a)}
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                );
              })}</tbody>
          </table>
        ) : (
          <NoData />
        )}
      </div>

      <Modal
        show={editingRow}
        size="md"
        onHide={() => setEditingRow(null)}
        layer={2}
      >
        <div className={cn(styles.columnItemInputsContainer)}>
          {COMMON_FIELDS?.map((a) => {
            return (
              <Block
                item={editingRow}
                setItem={setEditingRow}
                key={`returntrip_${a.id}`}
                inputData={a}
                isEditable={checkEditable({ group: "returnTrips" })}
              />
            );
          })}
        </div>
        <div className="justify-content-end flex gap-2">
          <button className="btn btn-sm btn-primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </Modal>
    </ToggleBlock>
  );
};

const Block = ({ item, setItem, inputData, isEditable }) => {
  let { Component, title, id, options, overrideOnChange, ...rest } = inputData;
  const handleChange = (v, id) => {
    setItem((prev) => ({
      ...prev,
      [id]: v,
    }));
  };

  return (
    <div className={styles.itemRow} id={id}>
      <label>{title}</label>
      <div className={styles.columnInput}>
        <Component
          id={id}
          value={item?.[id]}
          onChange={(v, ...o) => {
            if (typeof overrideOnChange === "function") {
              overrideOnChange(handleChange, [v, ...o]);
            } else {
              handleChange(v, id);
            }
          }}
          options={options}
          disabled={!isEditable}
          {...rest}
        />
      </div>
    </div>
  );
};

export default Com;
