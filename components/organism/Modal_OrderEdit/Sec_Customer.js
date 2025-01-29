import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Modal from "components/molecule/Modal";
import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";
import { DisplayBlock } from "./Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, onHide } = useContext(LocalDataContext);
  const [initValues, setInitValues] = useState(null);

  return (
    <>
      <div className={cn("flex-column flex")}>
        <div>
          <b>{data?.m_CustomerName || "--"}</b> |{" "}
          {data?.m_ProjectName || "--"} |
          {data?.m_ProjectManager || "--"}
          
        </div>
        <div className="align-items-center flex flex-row gap-2 text-sm">
          <div className="align-items-center flex flex-row gap-1">
            <i className="fa-solid fa-house text-slate-400"></i>
            {data?.m_Address || "--"}
          </div>
          |
          <a href={`tel:${data?.m_PhoneNumber}`}>
            <i className="fa-solid fa-phone me-1 text-slate-400"></i>{" "}
            {data?.m_PhoneNumber || "--"}
          </a>
          |
          <a href={`tel:${data?.m_Email}`}>
            <i className="fa-solid fa-at me-1 text-slate-400"></i>{" "}
            {data?.m_Email || "--"}
          </a>
          |
          <span>
            {isEditable && (
              <i
                className="fa-solid fa-pen-to-square ms-2 text-blue-500 hover:text-blue-400"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  setInitValues({
                    customerName: data?.m_CustomerName,
                    projectName: data?.m_ProjectName,
                    projectManager: data?.m_ProjectManager,
                    phoneNumber: data?.m_PhoneNumber,
                    email: data?.m_Email,                    
                    address: data?.m_Address,
                  })
                }
              ></i>
            )}
          </span>
        </div>
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

    onChange(values?.customerName, "m_CustomerName");
    onChange(values?.projectName, "m_ProjectName");
    onChange(values?.projectManager, "m_ProjectManager");   
    onChange(values?.phoneNumber, "m_PhoneNumber");
    onChange(values?.email, "m_Email");
    onChange(values?.address, "m_Address");

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
      title="Edit address"
      size="md"
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
        <label>Customer Name</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="m_CustomerName"
            value={values?.customerName}
            onChange={(v) => handleChange(v, "customerName")}
          />
        </div>
        <label>Project Name</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="m_ProjectName"
            value={values?.projectName}
            onChange={(v) => handleChange(v, "projectName")}
          />
        </div>
        <label>Project Manager</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="m_ProjectManager"
            value={values?.projectManager}
            onChange={(v) => handleChange(v, "projectManager")}
          />
        </div>


        
        <label>Address</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="m_Address"
            value={values?.address}
            onChange={(v) => handleChange(v, "address")}
          />
        </div>
        <label>Phone Number</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="m_PhoneNumber"
            value={values?.phoneNumber}
            onChange={(v) => handleChange(v, "phoneNumber")}
          />
        </div>
        <label>Email</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="m_Email"
            value={values?.email}
            onChange={(v) => handleChange(v, "email")}
          />
        </div>
      </div>
    </Modal>
  );
};

export default Com;
