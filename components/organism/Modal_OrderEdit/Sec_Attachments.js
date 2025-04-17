import React, { useContext } from "react";
import cn from "classnames";
import Modal from "components/molecule/Modal";
import utils from "lib/utils";
import _ from "lodash";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

const Com = ({}) => {
  const {
    newAttachments,
    setNewAttachments,
    existingAttachments,
    checkEditable,
    onUploadAttachment,
    onDeleteAttachment,
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

  return (
    <>
      <div className={cn(styles.sectionTitle)}>
        <span>Attachments</span>
        {checkEditable() && (
          <div>
            <label
              htmlFor="file-upload"
              className="btn btn-outline-secondary btn-sm"
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
          <table className="table-xs table-bordered table-hover mb-0 table border">
            <tbody>
              {existingAttachments?.map((a, i) => {
                const { fileName, fileType, fileRawData, notes, id } = a;

                const size = utils.formatNumber(
                  utils.calculateFileSize(fileRawData) / 1024 || 0,
                );
                return (
                  <tr key={`${fileName}_${id}`}>
                    <td className="text-left">
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
                    <td className="text-right">{size} KB</td>
                    <td>{notes || ""}</td>
                    <td style={{ width: 60 }}>
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={!checkEditable()}
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
            <table className="table-sm table-bordered table-hover table border">
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
                    <tr key={`${name}_${i}`}>
                      <td>{name}</td>
                      <td className="text-right">
                        {utils.formatNumber(size)} KB
                      </td>
                      <td>
                        <input
                          className="form-control"
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
