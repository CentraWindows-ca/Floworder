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
    newImages,
    setNewImages,
    existingImages,
    onUploadImage,
    onDeleteImage ,
    isEditable,
    onChange,
    onHide,
  } = useContext(LocalDataContext);

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to Array

    setNewImages(
      files?.map((a) => ({
        file: a,
      })),
    );
  };

  const handleSave = async () => {
    await onUploadImage(_.cloneDeep(newImages));
    setNewImages(null);
  };

  const handleChangeNote = (i, e) => {
    setNewImages((prev) => {
      const _newV = _.cloneDeep(prev); // use lodash to keep object
      _.set(_newV, [i, "notes"], e.target.value);
      return _newV;
    });
  };

  const jsxTitle = (
    <div className="flex gap-2">
      {title}
      <div className="text-primary font-normal">
        ({existingImages?.length || 0})
      </div>
    </div>
  );

  return (
    <ToggleBlock title={jsxTitle} id={id}>
      <div className="p-2">
        <div className="justify-content-between align-items-center mb-2 flex">
          <div>
            <label
              htmlFor="image-upload"
              className="btn btn-outline-secondary btn-xs"
            >
              Upload Images
            </label>

            <input
              id="image-upload"
              type="file"
              // multiple
              className="d-none"
              onChange={handleImageChange}
            />
          </div>
        </div>
        <table className="table-xs table-bordered table-hover mb-0 table border text-sm">
          <tbody>
            {existingImages?.map((a) => {
              const { submittedBy, fileName, fileType, fileRawData, notes, id } = a;
              const size = utils.formatNumber(
                utils.calculateFileSize(fileRawData) / 1024 || 0,
              );

              return (
                <tr key={`${title}_${id}`}>
                  <td className="text-center" style={{width: 120}}>
                    {/* <span
                      className="text-blue-500 hover:text-blue-400"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        utils.downloadFile(fileRawData, fileName, fileType)
                      }
                    >
                      {fileName}
                    </span> */}

                    <ImagePreview
                      base64Data={fileRawData}
                      mimeType={fileType}
                    />
                  </td>
                  <td className="text-right"  style={{width: 120}}>{size} KB</td>
                  <td className="text-left"><b>[{submittedBy}]:</b><br/> {notes || "--"}</td>
                  <td style={{ width: 60 }}>
                    <button
                      className="btn btn-xs btn-danger"
                      disabled={!isEditable}
                      onClick={() => onDeleteImage(a)}
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

      <Modal show={newImages} size="md" onHide={() => setNewImages(null)}>
        <div>
          <div>
            <table className="table-sm table-bordered table-hover table border text-sm">
              <thead>
                <tr>
                  <th>Image</th>
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

const ImagePreview = ({ base64Data, mimeType }) => {
  // Construct the data URL
  const imageUrl = `data:${mimeType};base64,${base64Data}`;

  // Function to open the image in a new tab
  const handleOpenInNewTab = () => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(
        `<img src="${imageUrl}" alt="Full Image" style="max-width:100%; height:auto;" />`
      );
      newTab.document.title = "Image Preview";
      newTab.document.close();
    } else {
      alert("Popup blocked! Please allow popups for this website.");
    }
  };

  return (
    <div>
      <img
        src={imageUrl}
        alt="Preview"
        style={{ maxWidth: "100px", height: "auto", cursor: "pointer" }}
        onClick={handleOpenInNewTab}
      />
    </div>
  );
};

export default Com;
