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
    existingAttachments,
    isEditable,
    onUploadAttachment,
    onDeleteAttachment,
    onHide,
  } = useContext(LocalDataContext);

  const handleFileChange = (event) => {
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

  const handleDownload = (binaryData) => {
    const blob = new Blob([binaryData], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    // Create a download link
    const link = document.createElement("a");
    link.href = url;
    link.download = "file-name.ext"; // Set the desired file name
    link.textContent = "Download the file";

    // Optionally append the link to the DOM and trigger a click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the DOM

    // Release the Blob URL to free memory
    URL.revokeObjectURL(url);
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
              // multiple
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
              {existingAttachments?.map((a) => {
                const {
                  fileName,
                  fileType,
                  fileRawData,
                  recordId,
                  prodTypeId,
                  notes,
                  submittedBy,
                } = a;

                const binaryData = new Uint8Array(fileRawData);

                console.log(a);
                const size = utils.formatNumber(binaryData?.length / 1024 || 0);
                return (
                  <tr>
                    <td className="text-left">
                      <span className="text-blue-500 hover:text-blue-400" style={{cursor: 'pointer'}} onClick={() => handleDownload(binaryData)}>
                        {fileName}
                      </span>
                    </td>
                    <td className="text-right">{size} KB</td>
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
                  const { file, notes } = a;
                  const { name, size } = file;
                  return (
                    <tr>
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
    </>
  );
};

export default Com;
