import React, { useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import Header from "./Header";
import Main from "./Main";

const Com = ({}) => {
  const {
    initMasterId,
    onHide,
  } = useContext(LocalDataContext);

  return (
    <Modal
      show={initMasterId}
      title={<Header/>}
      size="xl"
      onHide={onHide}
      fullscreen={true}
      bodyClassName={cn(styles.modalBody)}
      headerClassName={styles.modalHeader}
      titleClassName={"flex justify-content-between flex-grow-1"}
    >
      <Main />
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
