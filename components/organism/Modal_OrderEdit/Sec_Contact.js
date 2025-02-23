import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Modal from "components/molecule/Modal";
import Editable from "components/molecule/Editable";


import { LocalDataContext } from "./LocalDataProvider";

const Com = ({  }) => {
  const { data,  isEditable,  } = useContext(LocalDataContext);

  const [initValues, setInitValues] = useState(null);

  return (
    <>
      <div
        className={cn(
          "align-items-center flex flex-row gap-2 text-sm font-normal",
        )}
      >
        <div>
          SC:{" "}
          <span className="font-bold">{data?.m_SiteContact || "--"}</span>
        </div>
        |
        <a href={`tel:${data?.m_SiteContactPhoneNumber}`}>
          <i className="fa-solid fa-phone me-1"></i>
          {data?.m_SiteContactPhoneNumber || "--"}
        </a>
        |
        <a href={`mailto: ${data?.m_SiteContactEmail}`}>
          <i className="fa-solid fa-at me-1"></i>
          {data?.m_SiteContactEmail || `--`}
        </a>
        {isEditable && (
          <div>
            <i
              className="fa-solid fa-pen-to-square ms-2 text-blue-500 hover:text-blue-400"
              style={{ cursor: "pointer" }}
              onClick={() =>
                setInitValues({
                  siteContact: data?.m_SiteContact,
                  sitecontactPhoneNumber: data?.m_SiteContactPhoneNumber,
                  siteContactEmail: data?.m_SiteContactEmail,
                })
              }
            ></i>
          </div>
        )}
      </div>
      <ModalEdit initValues={initValues} onHide={() => setInitValues(null)} />
    </>
  );
};

const ModalEdit = ({ initValues, onHide }) => {
  const { onChange } = useContext(LocalDataContext);

  const [values, setValues] = useState(null);

  useEffect(() => {
    setValues(initValues);
  }, [initValues]);

  const handleApply = () => {
    onChange(values?.siteContact, "m_SiteContact");
    onChange(values?.sitecontactPhoneNumber, "m_SiteContactPhoneNumber");
    onChange(values?.siteContactEmail, "m_SiteContactEmail");

    setValues(null);
    onHide();
  };

  const handleChange = (v, k) => {
    setValues((prev) => ({
      ...prev,
      [k]: v,
    }));
  };
  return (
    <Modal
      title="Edit site contact"
      size="sm"
      footer={
        <>
          <button
            className="btn btn-outline-primary px-4"
            onClick={handleApply}
          >
            Apply
          </button>
        </>
      }
      onHide={onHide}
      show={!!initValues}
    >
      <div className={cn("grid grid-cols-[1fr_3fr] gap-2")}>
        <label>Name</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="m_SiteContact"
            value={values?.siteContact}
            onChange={(v) => handleChange(v, "siteContact")}
          />
        </div>
        <label>Phone</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="m_SiteContactPhoneNumber"
            value={values?.sitecontactPhoneNumber}
            onChange={(v) => handleChange(v, "sitecontactPhoneNumber")}
          />
        </div>
        <label>Email</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="m_SiteContactEmail"
            value={values?.siteContactEmail}
            onChange={(v) => handleChange(v, "siteContactEmail")}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Com;
