import React, { useContext } from "react";
import cn from "classnames";
import Modal from "components/molecule/Modal";
import utils from "lib/utils";
import _ from "lodash";


// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

const Com = ({ }) => {
  const {
    newImages,
    setNewImages,
    existingImages,
    checkEditable,
    onUploadAttachment,
    onDeleteAttachment,
  } = useContext(LocalDataContext);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array

    setNewImages(
      files?.map((a) => ({
        file: a,
      })),
    );
  };

  const handleSave = async () => {
    await onUploadAttachment(_.cloneDeep(newImages));
    setNewImages(null);
  };

  const handleChangeNote = (i, e) => {
    setNewImages((prev) => {
      const _newV = _.cloneDeep(prev); // use lodash to keep object
      _.set(_newV, [i, "notes"], e.target.value);
      return _newV;
    });
  };


  return (
    <>
      <div className={cn(styles.sectionTitle)}>
        <span>Images</span>
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
      <div className={cn(styles.columnImagesContainer)}>
        <div className="p-2">
          <table className="table-xs table-bordered table-hover mb-0 table border">
            <tbody>
              {existingImages?.map((a, i) => {
                const {
                  fileName,
                  fileType,
                  fileRawData,
                  notes
                } = a;

                const size = utils.formatNumber(calculateFileSize(fileRawData) / 1024 || 0);
                return (
                  <tr key={`${fileName}_${i}`}>
                    <td className="text-left">
                      <span className="text-blue-500 hover:text-blue-400" style={{cursor: 'pointer'}} onClick={() => downloadFile(fileRawData, fileName, fileType)}>
                        {fileName}
                      </span>
                    </td>
                    <td className="text-right">{size} KB</td>
                    <td>
                      {notes || ''}
                    </td>
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
        show={newImages}
        size="md"
        onHide={() => setNewImages(null)}
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
                {newImages?.map((a, i) => {
                  const { file, notes } = a;
                  const { name, size } = file;
                  return (
                    <tr key={`${name}_${i}`}>
                      <td style={{wordBreak: 'break-word'}}>{name}</td>
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

const calculateFileSize = (base64Data) => {
  // Remove padding characters (=) at the end
  const padding = (base64Data.match(/=/g) || []).length;
  // Calculate the Base64 string length without padding
  const base64Length = base64Data.length;
  // Calculate the file size in bytes
  const fileSizeInBytes = (base64Length * 3) / 4 - padding;
  return fileSizeInBytes;
};

const downloadFile = (base64Data, filename, mimeType) => {
  // Convert Base64 to binary data
  const binaryData = atob(base64Data); // Decodes the Base64 string
  const byteNumbers = new Uint8Array(binaryData.length);
  for (let i = 0; i < binaryData.length; i++) {
    byteNumbers[i] = binaryData.charCodeAt(i);
  }

  // Create a Blob from the binary data
  const blob = new Blob([byteNumbers], { type: mimeType });

  // Create a temporary URL and trigger download
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = filename; // Specify the filename for the downloaded file
  link.click();

  // Clean up the URL
  URL.revokeObjectURL(blobUrl);
};

export default Com;
