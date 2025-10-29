import React, { useContext, useState } from "react";
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
  },
  {
    Component: Editable.EF_Text,
    id: "notes",
    title: "Notes",
  },
  {
    Component: Editable.EF_SelectWithLabel,
    id: "calledMessage",
    title: "Called Message",
    options: _calledMessageTypesList,
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
    dictionary,
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
      {/* <div>
        <button onClick={() => setEditingRow({})}>Add</button>
      </div> */}
    </div>
  );

  return (
    <>
      {jsxTitle}
      <div
        className={cn("d-flex flex-column")}
        style={{ overflowY: "auto" }}
      >
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
              const calledMessageObj = _calledMessageTypesList?.find(
                (a) => a.label === calledMessage,
              );

              const { color, borderColor, background, icon, label } =
                calledMessageObj || {};

              return (
                <div key={id} className={cn(styles.listCard, "pb-2")}>
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
                  <div className="pt-2 text-left">{notes}</div>
                  {/* <div className="align-items-center justify-content-between py-2">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      disabled={!checkEditable({ group: "invoiceCallLogs" })}
                      onClick={() => setEditingRow(a)}
                    >
                      edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      disabled={!checkEditable({ group: "invoiceCallLogs" })}
                      onClick={() => onDeleteInvoiceCallLogs(a)}
                    >
                      delete
                    </button>
                  </div> */}
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
