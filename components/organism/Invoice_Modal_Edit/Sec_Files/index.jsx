import React, { useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Modal from "components/molecule/Modal";
import utils from "lib/utils";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, NoData } from "../Com";
import Divider_Hortizontal from "components/atom/Divider_Hortizontal";
import OrdersApi from "lib/api/OrdersApi";
import HoverPopover from "components/atom/HoverPopover";
import FileDownload from "components/atom/FileDownload";
// styles
import stylesRoot from "../styles.module.scss";
import stylesCurrent from "./styles.module.scss";
import InvoiceApi from "lib/api/InvoiceApi";
const styles = { ...stylesRoot, ...stylesCurrent };

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

  const handleDelete = (a) => {
    onDeleteAttachment(a);
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
        <Divider_Hortizontal>Invoice Attachments</Divider_Hortizontal>
        {!_.isEmpty(existingAttachments) ? (
          <div className="d-flex flex-col gap-2">
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
              const submittedAt_display = utils.formatDate(submittedAt);
              const href = InvoiceApi.urlGetFile({ id });
              return (
                <div
                  className="d-flex align-items-center justify-content-between gap-2"
                  key={`${fileName}_${id}`}
                >
                  <FileDownload
                    {...{
                      ...a,
                      href,
                      submittedAt: submittedAt_display,
                    }}
                  />

                  <div>
                    <button
                      className="btn btn-xs btn-danger"
                      onClick={() => handleDelete(a)}
                      disabled={!checkEditable({ group: "attachments" })}
                    >
                      delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoData />
        )}

        <Divider_Hortizontal className={"pt-3"}>
          Sales Attachments
        </Divider_Hortizontal>

        {!_.isEmpty(salesAttachments) ? (
          <div className="d-flex flex-col gap-2">
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
               const submittedAt_display = utils.formatDate(
                utils.formatDatetimeForMorganLegacy(submittedAt),
              );
              const href = OrdersApi.urlGetFile({ id })
              return (
                <div
                  className="d-flex align-items-center justify-content-between gap-2"
                  key={`${fileName}_${id}`}
                >
                  <FileDownload
                    {...{
                      ...a,
                      href,
                      submittedAt: submittedAt_display,
                    }}
                  />

                  <div>
                    <button
                      className="btn btn-xs btn-danger"
                      onClick={() => handleDelete(a)}
                    >
                      delete
                    </button>
                  </div>
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

const PopoverDiv = ({ notes, fileName, submittedBy, submittedAt }) => {
  return (
    <div>
      <div>
        <b>{submittedBy}</b> [{submittedAt}]
      </div>
      <div className={cn(styles.fileNotes)} style={{ whiteSpace: "pre-wrap" }}>
        {notes}
      </div>
    </div>
  );
};

export default Com;
