import React, { useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

import Modal from "components/molecule/Modal";
// styles
import styles from "../styles.module.scss";
import utils from "lib/utils";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, NoData } from "../Com";
import OrdersApi from "lib/api/OrdersApi";
import HoverPopover from "components/atom/HoverPopover";

const Com = ({ title, id }) => {
  const {
    newAttachments,
    setNewAttachments,
    existingAttachments,
    salesAttachments,
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
    <div className={cn(styles.sectionTitle, styles.sectionTitleGrayYellow)}>
      Attachments
      <div>
        {checkEditable({ group: "attachments" }) && (
          <label className="btn btn-xs btn-success" htmlFor="file-upload">
            <i className="fa-solid fa-plus me-2"></i>
            Upload
            <input
              id="file-upload"
              type="file"
              multiple
              className="d-none"
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );

  return (
    <>
      {jsxTitle}
      <div className={styles.togglePadding}>
        {!_.isEmpty(existingAttachments) ? (
          <div>
              {existingAttachments?.map((a) => {
                const {
                  submittedBy,
                  submittedAt,
                  fileName,
                  fileType,
                  fileSize,
                  notes,
                  id,
                } = a;
                const size = utils.formatNumber(fileSize / 1024 || 0);
                const submittedAt_display = utils.formatDate(submittedAt);
                return (
                  <div
                    className="text-left"
                    key={`${fileName}_${id}`}
                    title={`${submittedAt_display}`}
                  >
                    <a
                      className="text-blue-500 hover:text-blue-400"
                      href={`${OrdersApi.urlGetFile({ id })}`}
                      target="_blank"
                    >
                      <b>{fileName}</b> [{size} KB]
                    </a>
                    {notes ? (
                      <HoverPopover
                        trigger={
                          <>
                            <i className="fa-solid fa-book ms-2 text-slate-400"></i>
                          </>
                        }
                      >
                        <div style={{ whiteSpace: "pre-wrap" }}>{notes}</div>
                      </HoverPopover>
                    ) : null}
                  </div>
                );
              })}
            </div>
        ) : (
          <NoData />
        )}

        <hr />

        {!_.isEmpty(salesAttachments) ? (
          <div>
            {salesAttachments?.map((a) => {
              const {
                submittedBy,
                submittedAt,
                fileName,
                fileType,
                fileSize,
                notes,
                id,
              } = a;
              const size = utils.formatNumber(fileSize / 1024 || 0);
              const submittedAt_display = utils.formatDate(
                utils.formatDatetimeForMorganLegacy(submittedAt),
              );
              return (
                <div
                  className="text-left"
                  key={`${fileName}_${id}`}
                  title={`${submittedAt_display}`}
                >
                  <a
                    className="text-blue-500 hover:text-blue-400"
                    href={`${OrdersApi.urlGetFile({ id })}`}
                    target="_blank"
                  >
                    <b>{fileName}</b> [{size} KB]
                  </a>
                  {notes ? (
                    <HoverPopover
                      trigger={
                        <>
                          <i className="fa-solid fa-book ms-2 text-slate-400"></i>
                        </>
                      }
                    >
                      <div style={{ whiteSpace: "pre-wrap" }}>{notes}</div>
                    </HoverPopover>
                  ) : null}
                </div>
              );
            })}
          </div>
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
    </>
  );
};

export default Com;
