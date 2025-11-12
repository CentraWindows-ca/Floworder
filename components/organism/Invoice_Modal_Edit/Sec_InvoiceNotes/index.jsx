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
    Component: Editable.EF_Text,
    id: "notes",
    title: "Notes",
    rows: 6,
    required: true,
  },
]);

const Com = ({ title, id }) => {
  const {
    onDeleteInvoiceNotes,
    onAddInvoiceNotes,
    onEditInvoiceNotes,
    invoiceNotes,
    checkEditable,
  } = useContext(LocalDataContext);

  const [editingRow, setEditingRow] = useState(null);

  const handleSave = async () => {
    if (editingRow?.id) {
      await onEditInvoiceNotes(_.cloneDeep(editingRow));
    } else {
      await onAddInvoiceNotes(_.cloneDeep(editingRow));
    }

    setEditingRow(null);
  };

  const jsxTitle = (
    <div className={cn(styles.sectionTitle, styles.sectionTitleGrayYellow)}>
      <span>Notes</span>
      <div>
        {checkEditable({ group: "invoiceNotes" }) && (
          <button
            className="btn btn-xs btn-success"
            onClick={() => setEditingRow({})}
          >
            <i className="fa-solid fa-plus me-2"></i>
            Add
          </button>
        )}
      </div>
    </div>
  );

  // check all items for required field
  const _checkDisabled = (record) => !COMMON_FIELDS?.every((a) => {
    if (a.required) {
      return record?.[a.id];
    }

    return true;
  }); 

  return (
    <>
      {jsxTitle}
      <div className={cn("d-flex flex-column")} style={{ overflowY: "auto" }}>
        {!_.isEmpty(invoiceNotes) ? (
          <>
            {invoiceNotes?.map((a) => {
              const { notes, submittedBy, submittedAt, id } = a;
              const submittedAt_display = utils.formatDate(
                utils.formatDate(submittedAt),
              );

              return (
                <div
                  key={id}
                  className={cn(
                    styles.listCard,
                    checkEditable({ group: "invoiceNotes" })
                      ? styles.listCardEditable
                      : "",
                    "pb-2",
                  )}
                >
                  <div className="d-flex justify-content-between gap-2">
                    <div className="d-flex gap-2">
                      <div className={cn(styles.listCardTag, styles.tagDark)}>
                        {submittedBy}
                      </div>
                    </div>
                    <div className={cn(styles.listCardTag, styles.tagWhite)}>
                      {submittedAt_display}
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-left" style={{ whiteSpace: "pre-wrap" }}>
                      {notes}
                    </p>
                  </div>
                  {checkEditable({ group: "invoiceNotes" }) && (
                    <div
                      className={cn(
                        styles.editTool,
                        "align-items-center justify-content-between py-2",
                      )}
                    >
                      <button
                        className="btn btn-sm btn-outline-primary me-2"
                        onClick={() => setEditingRow(a)}
                      >
                        edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => onDeleteInvoiceNotes(a)}
                      >
                        delete
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
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
        title="Invoice Notes"
      >
        <div className={cn(styles.columnItemInputsContainer)}>
          {COMMON_FIELDS?.map((a) => {
            return (
              <Block
                item={editingRow}
                setItem={setEditingRow}
                key={`returntrip_${a.id}`}
                inputData={a}
                isEditable={checkEditable({ group: "invoiceNotes" })}
              />
            );
          })}
        </div>
        <div className="justify-content-center flex gap-2">
          <button
            className="btn btn-sm btn-primary"
            onClick={handleSave}
            disabled={_checkDisabled(editingRow)}
          >
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
