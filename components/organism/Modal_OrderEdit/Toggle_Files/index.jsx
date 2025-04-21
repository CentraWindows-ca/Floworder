import React, { useContext } from "react";
import _ from "lodash";
import constants from "lib/constants";

import Modal from "components/molecule/Modal";
// styles
import styles from "../styles.module.scss";
import utils from "lib/utils";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, NoData } from "../Com";

const Com = ({ title, id }) => {
  const {
    newAttachments,
    setNewAttachments,
    existingAttachments,
    onUploadAttachment,
    onDeleteAttachment,
    checkEditable,
  } = useContext(LocalDataContext);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to Array

    if (_.isEmpty(files)) {
      setNewAttachments(null);
    } else {
      setNewAttachments(
        files?.map((a) => ({
          file: a,
        })),
      );
    }

    e.target.value = "";
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
      <div className={styles.togglePadding}>
        {checkEditable({ group: "attachments" }) && (
          <div className="justify-content-between align-items-center mb-2 flex border-b border-gray-200 pb-2">
            <div>
              <label htmlFor="file-upload" className="btn btn-success">
                Upload Files
              </label>

              <input
                id="file-upload"
                type="file"
                multiple
                className="d-none"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}
        {!_.isEmpty(existingAttachments) ? (
          <table className="table-xs table-bordered table-hover mb-0 table border">
            <tbody>
              {existingAttachments?.map((a) => {
                const {
                  submittedBy,
                  submittedAt,
                  fileName,
                  fileType,
                  fileRawData,
                  notes,
                  id,
                } = a;
                const size = utils.formatNumber(
                  utils.calculateFileSize(fileRawData) / 1024 || 0,
                );
                const submittedAt_display = utils.formatDate(
                  utils.formatDatetimeForMorganLegacy(submittedAt),
                );
                return (
                  <tr key={`${title}_${id}`}>
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
                    <td className="text-right" style={{ width: 120 }}>
                      {size} KB
                    </td>
                    <td>{submittedAt_display}</td>
                    <td className="text-left">
                      {submittedBy ? (
                        <>
                          <b>[{submittedBy}]:</b>
                          <br />
                        </>
                      ) : null}
                      {notes || "--"}
                    </td>
                    <td style={{ width: 60 }}>
                      <button
                        className="btn btn-sm btn-danger"
                        disabled={!checkEditable({ group: "attachments" })}
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
        ) : (
          <NoData />
        )}
      </div>

      <Modal
        show={newAttachments}
        size="lg"
        onHide={() => setNewAttachments(null)}
      >
        <div>
          <div>
            <table className="table-xs table-bordered table-hover table border">
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
                        {utils.formatNumber(size / 1024)} KB
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
    </ToggleBlock>
  );
};

export default Com;
