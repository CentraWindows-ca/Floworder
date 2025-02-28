import React, { useContext, useEffect , useState } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import constants from "lib/constants";
import utils from "lib/utils";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = ({data, onHide}) => {
  
  // use swr later
  useEffect(() => {
    
  }, [data])
  

  return (
    <>
      <Modal
        show={!!data}
        title={''}
        size="lg"
        onHide={onHide}
        fullscreen={true}
        titleClassName={"flex justify-content-between flex-grow-1"}
      >
        <LoadingBlock isLoading={false}>

        </LoadingBlock>
      </Modal>
    </>
  );
};

export default Com;
