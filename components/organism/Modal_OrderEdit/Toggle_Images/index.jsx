import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import { Image } from "antd";
import Modal from "components/molecule/Modal";

import utils from "lib/utils";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, NoData } from "../Com";
// styles
import stylesRoot from "../styles.module.scss";
import stylesCurrent from "./styles.module.scss";

const styles = { ...stylesRoot, ...stylesCurrent };

const Com = ({ title, id }) => {
  const {
    newImages,
    setNewImages,
    existingImages,
    onUploadImage,
    onDeleteImage,
    isEditable,
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
      <div className={styles.togglePadding}>
        {isEditable && (
          <div className="justify-content-between align-items-center mb-2 flex border-b border-gray-200 pb-2">
            <div>
              <label htmlFor="image-upload" className="btn btn-success btn-sm">
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
        )}
        {!_.isEmpty(existingImages) ? (
          <>
            <div className={cn(styles.previewList)}>
              {existingImages?.map((a) => {
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
                  <div
                    key={`${title}_${id}`}
                    className={cn(styles.previewItem, "text-xs")}
                  >
                    <div>
                      <ImagePreview
                        base64Data={fileRawData}
                        mimeType={fileType}
                      />
                    </div>
                    <small className="text-xs text-slate-400">{size} KB</small>
                    <div className="">{fileName}</div>
                    {notes ? (
                      <>
                        <div className={cn(styles.notes)}><b>[notes]</b> {notes}</div>
                      </>
                    ) : null}
                  </div>
                );
              })}
            </div>
            {/* <table className="table-xs table-bordered table-hover mb-0 table border text-xs">
              <tbody>
                {existingImages?.map((a) => {
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
                        <ImagePreview
                          base64Data={fileRawData}
                          mimeType={fileType}
                        />
                      </td>
                      <td className="text-right" style={{ width: 200 }}>
                        {size} KB
                      </td>
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
            </table> */}
          </>
        ) : (
          <NoData />
        )}
      </div>
      <Modal show={newImages} size="lg" onHide={() => setNewImages(null)}>
        <div>
          <div>
            <table className="table-sm table-bordered table-hover table border text-xs">
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
                        {utils.formatNumber(size / 1024)} KB
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
  const [previewImage, setPreviewImage] = useState(false);

  // Function to open the image in a new tab
  const handleOpenInNewTab = () => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(
        `<img src="${imageUrl}" alt="Full Image" style="max-width:100%; height:auto;" />`,
      );
      newTab.document.title = "Image Preview";
      newTab.document.close();
    } else {
      alert("Popup blocked! Please allow popups for this website.");
    }
  };

  const handlePreview = () => {
    setPreviewImage(true);
  };

  return (
    <div>
      {/* <img
        src={imageUrl}
        alt="Preview"
        style={{ maxWidth: "100px", height: "auto", cursor: "pointer" }}
        onClick={handlePreview}
      /> */}
      <Image
        src={imageUrl}
        width={160}
        height={160}
        rootClassName={cn(styles.previewRoot)}
      />

      {/* <Modal
        fullscreen={true}
        show={previewImage}
        onHide={() => setPreviewImage(false)}
      >
        <div className={cn(styles.previewZoomIn)}>
          <img src={imageUrl} />
        </div>
      </Modal> */}
    </div>
  );
};

export default Com;
