import React, { useContext, useEffect, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import constants from "lib/constants";
import utils from "lib/utils";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = ({ id, onHide }) => {
  const [historyData, setHistoryData] = useState();

  // use swr later
  useEffect(() => {
    doInit(id);
  }, [id]);

  // ======

  const doInit = (id) => {
    const _changesData = {
      ChangedData: [
        {
          Field: "m_CustomerName",
          OldValue: "sdfgggggggg",
          NewValue: "sdfgggggggg",
        },
      ],
    };

    setHistoryData(_changesData);
  };

  return (
    <>
      <Modal
        show={id}
        title={""}
        size="lg"
        onHide={onHide}
        fullscreen={true}
        titleClassName={"flex justify-content-between flex-grow-1"}
      >
        <LoadingBlock isLoading={false}>
          <div className={cn(styles.changesList)}>
            {historyData?.ChangedData?.map((a) => {
              const { Field, OldValue, NewValue } = a;

              return (
                <div key={`changed_${Field}`}  className={cn(styles.changesRow)}>
                  <div className={cn(styles.changesField)} title={Field}>{constants.constants_labelMapping[Field]?.title || Field}</div>
                  <div className={cn(styles.changesOld)}>{OldValue}</div>
                  <div className={cn(styles.changesNew)}>{NewValue}</div>
                </div>
              );
            })}
          </div>
        </LoadingBlock>
      </Modal>
    </>
  );
};

export default Com;
