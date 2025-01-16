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
  const { data, onChange, isEditable, onHide } =
    useContext(LocalDataContext);
  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div className={cn("flex-column flex")}>
        <div>
          <b>Alabaster (LANGARA) Master LP</b> | 810 E 33rd Ave - Order #5 -
          Level 5 - W & PD
        </div>
        <div className="align-items-center flex flex-row gap-2 text-sm">
          <div className="align-items-center flex flex-row gap-1">
            <i className="fa-solid fa-house text-blueGray-400"></i>

            <span>
              807 EAST 33RD AVENUE
              {isEditable && (
                <i
                  className="fa-solid fa-pen-to-square ms-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => setIsEditing(true)}
                ></i>
              )}
            </span>
          </div>
          |
          <a href="111">
            <i className="fa-solid fa-phone me-1 text-blueGray-400"></i>{" "}
            604-558-5848
          </a>
        </div>
      </div>
      <Modal
        title="Edit address"
        show={isEditing}
        size="sm"
        onHide={() => setIsEditing(null)}
        footer={
          <>
            <button className="btn btn-outline-primary px-4">Apply</button>
          </>
        }
      >
        <ModalEdit />
      </Modal>
    </>
  );
};

const ModalEdit = () => {
  const { data, onChange, onHide } = useContext(LocalDataContext);

  return (
    <div className={cn("flex-column flex gap-2")}>
      <div className={cn("align-items-center flex flex-row gap-4")}>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="address"
            options={[]}
            value={data?.address}
            onChange={(v) => onChange(v, "address")}
          />
        </div>
      </div>
    </div>
  );
};

export default Com;
