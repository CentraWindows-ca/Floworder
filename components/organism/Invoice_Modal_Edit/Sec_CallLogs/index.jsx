import React, { useContext, useCallback, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import {
  labelMapping,
  applyField,
} from "lib/constants/production_constants_labelMapping";

import Modal from "components/molecule/Modal";

import utils from "lib/utils";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, NoData } from "../Com";
import Editable from "components/molecule/Editable";

import { CalledMessageTypes } from "lib/constants";

// styles
import stylesRoot from "../styles.module.scss";
import stylesCurrent from "./styles.module.scss";
const styles = { ...stylesRoot, ...stylesCurrent };

const _calledMessageTypesList = _.values(CalledMessageTypes);

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_DateOnly,
    id: "dateCalled",
    title: "Date",
    required: true
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "calledMessage",
    title: "Called Message",
    placeholder: "-",
    options: _calledMessageTypesList,
    required: true
  },
  {
    Component: Editable.EF_Text,
    id: "notes",
    title: "Notes",
  },
]);

const Com = ({ title, id }) => {
  const {
    onDeleteInvoiceCallLogs,
    onAddInvoiceCallLogs,
    onEditInvoiceCallLogs,
    invoiceCallLogs,
    checkEditable,
    dictionary,
    rawAuth,
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
        {checkEditable({ group: "invoiceCallLogs" }) && (
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
              // const submittedAt_display = utils.formatDate(
              //   utils.formatDatetimeForMorganLegacy(submittedAt),
              // );
              const calledMessageObj = _calledMessageTypesList?.find(
                (a) => a.label === calledMessage,
              );

              const { color, borderColor, background, icon, label } =
                calledMessageObj || {};

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
                      <div className={cn(styles.listCardTag, styles.tagWhite)}>
                        {dateCalled}
                      </div>
                      <div className={cn(styles.listCardTag, styles.tagDark)}>
                        {submittedBy}
                      </div>
                    </div>
                    <div
                      className={cn(styles.listCardTag)}
                      style={{ background, borderColor, color }}
                    >
                      <i className={icon} />
                      {label}
                    </div>
                  </div>
                  <div className="pt-2 text-left">
                    <p className="text-left" style={{ whiteSpace: "pre-wrap" }}>
                      {notes}
                    </p>
                  </div>
                  {checkEditable({ group: "invoiceCallLogs" }) && (
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
                        onClick={() => onDeleteInvoiceCallLogs(a)}
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
        title="Call Logs"
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

          {/*  */}
          <Block
            item={editingRow}
            setItem={setEditingRow}
            inputData={{
              Component: Editable.EF_Input,
              id: "submittedBy",
              title: "Submitted By",
              disabled: true,
              placeholder: rawAuth?.email,
            }}
            isEditable={false}
          />
        </div>
        <div className="justify-content-end flex gap-2">
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
