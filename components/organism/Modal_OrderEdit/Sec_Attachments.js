import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import Modal from "components/molecule/Modal";
import utils from "lib/utils";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";
import { DisplayBlock } from "./Com";

const Com = ({ className, ...props }) => {
  const {
    data,
    onChange,
    newAttachments,
    setNewAttachments,
    isEditable,
    orderId,
    onHide,
  } = useContext(LocalDataContext);
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array

    setNewAttachments(
      files?.map((a) => ({
        file: a,
      })),
    );

    // TODO: edit Notes/Alias
    // might be just call API to upload. dont store data
    console.log("Selected files:", files);
  };

  const handleSave = LoadingBlock(async () => {
    setNewAttachments(null);
  });

  const handleChangeNote = (i, e) => {
    setNewAttachments((prev) => {
      const _newV = _.cloneDeep(prev); // use lodash to keep object
      _.set(_newV, [i, "note"], e.target.value);
      return _newV;
    });
  };

  return (
    <>
      <div className={cn(styles.sectionTitle)}>
        <span>Attachments</span>
        {isEditable && (
          <div>
            <label
              htmlFor="file-upload"
              className="btn btn-outline-secondary btn-xs"
            >
              Upload
            </label>

            <input
              id="file-upload"
              type="file"
              multiple
              className="d-none"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>
      <div className={cn(styles.columnAttachmentsContainer)}>
        <div className="p-2">
          <table className="table-xs table-bordered table-hover mb-0 table border text-sm">
            <tbody>
              <tr>
                <td className="text-left">aaaa.pdf</td>
                <td className="text-right">{utils.formatNumber(123123)} KB</td>
                <td style={{ width: 60 }}>
                  <button
                    className="btn btn-xs btn-danger"
                    disabled={!isEditable}
                  >
                    delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        show={newAttachments}
        size="md"
        onHide={() => setNewAttachments(null)}
      >
        <div>
          <div>
            <table className="table-sm table-bordered table-hover table border text-sm">
              <thead>
                <tr>
                  <th>File</th>
                  <th>Size</th>
                  <th>Note/Alias</th>
                </tr>
              </thead>
              <tbody>
                {newAttachments?.map((a, i) => {
                  const { file, note } = a;
                  const { name, size } = file;
                  return (
                    <tr>
                      <td>{name}</td>
                      <td className="text-right">{utils.formatNumber(size)} KB</td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={note || ""}
                          onChange={(e) => handleChangeNote(i, e)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="justify-content-end flex gap-2">
            <button className="btn btn-sm btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Com;
