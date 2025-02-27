import React, { useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import PermissionBlock from "components/atom/PermissionBlock";


import constants from "lib/constants";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = ({}) => {
  const {
    isLoading,
    initWorkOrder,
    onHide,
    onAnchor,
    onSave,

    data,

    kind,
    isEditable,
    setIsEditable,
    existingAttachments,
    existingImages,
    windowItems,
    doorItems,
    glassTotal,
    uIstatusObj,
  } = useContext(LocalDataContext);

  // use swr later

  const KindDisplay = {
    m: null,
    w: <b className="text-primary">[Window]</b>,
    d: <b className="text-primary">[Door]</b>,
  };

  const jsxTitle = (
    <div className="justify-content-between align-items-center flex-grow-1 flex">
      <div className="align-items-center flex gap-2">
      
        {KindDisplay[kind]} Work Order # {initWorkOrder}
        <div className="align-items-center flex gap-2">

          {["Shipped"].includes(uIstatusObj?.key) &&
            data?.m_TransferredLocation && (
              <DisplayBlock id="m_TransferredLocation">
                <label className="text-base font-normal">
                  Transferred to:{" "}
                </label>
                <div className="text-base">{data?.m_TransferredLocation}</div>
              </DisplayBlock>
            )}
        </div>
      </div>
      <div>
      
      </div>
    </div>
  );

  return (
    <Modal
      show={initWorkOrder}
      title={jsxTitle}
      size="xl"
      onHide={onHide}
      fullscreen={true}
      bodyClassName={styles.modalBody}
      titleClassName={"flex justify-content-between flex-grow-1"}
    >
      <span id="basic" />
      <LoadingBlock isLoading={isLoading}>
      
      </LoadingBlock>
    </Modal>
  );
};

export default (props) => {
  return (
    <LocalDataProvider {...props}>
      <Com />
    </LocalDataProvider>
  );
};
