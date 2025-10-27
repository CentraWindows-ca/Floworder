import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import {
  labelMapping,
  applyField,
} from "lib/constants/production_constants_labelMapping";

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
    id: "dateCalled",
    title: "Date",
  },
  {
    Component: Editable.EF_Text,
    id: "notes",
    title: "Notes",
  },
  {
    Component: Editable.EF_Text,
    id: "calledMessage",
    title: "Called Message",
  },
  {
    Component: Editable.EF_Input,
    id: "submittedBy",
    title: "Submitted By",
    disabled: true,
  },
]);

const Com = ({ title, id }) => {
  const {
    onDeleteInvoiceCallLogs,
    onAddInvoiceCallLogs,
    onEditInvoiceCallLogs,
    invoiceCallLogs,
    checkEditable,
  } = useContext(LocalDataContext);

  const [editingRow, setEditingRow] = useState(null);

  const handleSave = async () => {
    if (editingRow?.id) {
      await onEditInvoiceCallLogs(_.cloneDeep(editingRow));
    } else {
      await onAddInvoiceCallLogs(_.cloneDeep(editingRow));
    }

    setEditingRow(null);
  };

  const jsxTitle = (
    <div className={cn(styles.sectionTitle, styles.sectionTitleGrayYellow)}>
      Call Logs
      <div>
        <button onClick={() => setEditingRow({})}>Add</button>
      </div>
    </div>
  );

  return (
    <>
      {jsxTitle}
      <div className={styles.togglePadding} style={{ overflowY: "auto" }}>
        {!_.isEmpty(invoiceCallLogs) ? (
          <>
            {invoiceCallLogs?.map((a) => {
              const {
                dateCalled,
                notes,
                calledMessage,
                submittedBy,
                submittedAt,
                id,
              } = a;
                  const submittedAt_display = utils.formatDate(
                    utils.formatDatetimeForMorganLegacy(submittedAt),
                  );

              return (
                <div key={id}>
                  <div className="d-flex justify-content-between">
                    <div>
                      {dateCalled}
                      {submittedBy}
                    </div>
                    <div>{calledMessage}</div>
                  </div>
                  <div className="text-left">{notes}</div>
                </div>
              );
            })}
            <table className="table-xs table-bordered table-hover mb-0 table border">
              <thead>
                <tr>
                  <th style={{ width: "180px" }}>Return Trip Date</th>
                  <th>Notes</th>
                  <th style={{ width: "200px" }}>Submitted At</th>
                  <th style={{ width: "140px" }}></th>
                </tr>
              </thead>
              <tbody>
                {invoiceCallLogs?.map((a) => {
                  const {
                    returnTripDate,
                    returnTripNotes,
                    dateCalled,
                    notes,
                    calledMessage,
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
                          disabled={
                            !checkEditable({ group: "invoiceCallLogs" })
                          }
                          onClick={() => setEditingRow(a)}
                        >
                          edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          disabled={
                            !checkEditable({ group: "invoiceCallLogs" })
                          }
                          onClick={() => onDeleteInvoiceCallLogs(a)}
                        >
                          delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
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
                isEditable={checkEditable({ group: "invoiceCallLogs" })}
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
    </>
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
