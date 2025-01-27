import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Modal from "components/molecule/Modal";
import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "../styles.module.scss";
import utils from "lib/utils";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, DisplayBlock } from "../Com";

const Com = ({ className, title, id, ...props }) => {
  const {
    newAttachments,
    setNewAttachments,
    existingAttachments,
    onUploadAttachment,
    isEditable,
  } = useContext(LocalDataContext);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array

    setNewAttachments(
      files?.map((a) => ({
        file: a,
      })),
    );
  };

  const handleSave = async () => {
    await onUploadAttachment(_.cloneDeep(newAttachments));
    setNewAttachments(null);
  };

  const handleChangeNote = (i, e) => {
    setNewAttachments((prev) => {
      const _newV = _.cloneDeep(prev); // use lodash to keep object
      _.set(_newV, [i, "notes"], e.target.value);
      return _newV;
    });
  };

  const jsxTitle = (
    <div className="flex gap-2">
      {title}
      <div className="text-primary font-normal">
        ({existingAttachments?.length || 0})
      </div>
    </div>
  );

  return (
    <ToggleBlock title={jsxTitle} id={id}>
      <div className="p-2">
        <div className="justify-content-between align-items-center mb-2 flex">
          <div>
            <label
              htmlFor="file-upload"
              className="btn btn-outline-secondary btn-xs"
            >
              Upload Files
            </label>

            <input
              id="file-upload"
              type="file"
              // multiple
              className="d-none"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <table className="table-xs table-bordered table-hover mb-0 table border text-sm">
          <tbody>
            {existingAttachments?.map((a) => {
              const {
                submittedBy,
                fileName,
                fileType,
                fileRawData,
                notes,
                id,
              } = a;
              const size = utils.formatNumber(
                utils.calculateFileSize(fileRawData) / 1024 || 0,
              );

              return (
                <tr key={`${title}_${id}`}>
                  <td className="text-center" style={{ width: 120 }}>
                    <span
                      className="text-blue-500 hover:text-blue-400"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        utils.downloadFile(fileRawData, fileName, fileType)
                      }
                    >
                      {fileName}
                    </span>
                  </td>
                  <td className="text-right" style={{ width: 120 }}>
                    {size} KB
                  </td>
                  <td className="text-left">
                    <b>[{submittedBy}]:</b>
                    <br /> {notes || "--"}
                  </td>
                  <td style={{ width: 60 }}>
                    <button
                      className="btn btn-xs btn-danger"
                      disabled={!isEditable}
                      onClick={() => onDeleteAttachment(a)}
                    >
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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
                  <th>File Name</th>
                  <th>Size</th>
                  <th>Note/Alias</th>
                </tr>
              </thead>
              <tbody>
                {newAttachments?.map((a, i) => {
                  const { file, notes } = a;
                  const { name, size } = file;
                  return (
                    <tr key={`${name}_${i}`}>
                      <td>{name}</td>
                      <td className="text-right">
                        {utils.formatNumber(size)} KB
                      </td>
                      <td>
                        <input
                          className="form-control form-control-sm"
                          value={notes || ""}
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
    </ToggleBlock>
  );
};

export default Com;
