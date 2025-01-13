import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Modal from "components/molecule/Modal";
import OverlayWrapper from "components/atom/OverlayWrapper";
import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock } from "./Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, orderId, onHide } =
    useContext(LocalDataContext);

  const [isEditing, setIsEditing] = useState(false);

  return (
    <>
      <div
        className={cn(
          "align-items-center flex flex-row gap-2 text-sm font-normal",
        )}
      >
        <div>
          SC: <span className="font-bold">Craig Barnes</span>
        </div>
        |
        <a href="111">
          <i className="fa-solid fa-phone me-1"></i>
          236-688-6253
        </a>
        |
        <a href="111">
          <i className="fa-solid fa-at me-1"></i>craig@alabasterhomes.ca
        </a>
        {isEditable && (
          <div>
            <i
              className="fa-solid fa-pen-to-square ms-2 text-blue-500 hover:text-blue-400"
              style={{ cursor: "pointer" }}
              onClick={() => setIsEditing(true)}
            ></i>
          </div>
        )}
      </div>
      <Modal
        title="Edit site contact"
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
  const { data, onChange, isEditable, orderId, onHide } =
    useContext(LocalDataContext);

  return (
    <div className={cn("flex-column flex gap-2")}>
      <div className={cn("align-items-center flex flex-row gap-4")}>
        <label>Name</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="name"
            options={[]}
            value={data?.name}
            onChange={(v) => onChange(v, "name")}
          />
        </div>
      </div>

      <div className={cn("align-items-center flex flex-row gap-4")}>
        <label>Phone</label>
        <div className="flex-grow-1">
          <Editable.EF_Input
            k="phone"
            options={[]}
            value={data?.phone}
            onChange={(v) => onChange(v, "phone")}
          />
        </div>
      </div>
    </div>
  );
};

export default Com;
