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

const Com = ({ data, onHide }) => {
  const [historyData, setHistoryData] = useState(null);

  // use swr later
  useEffect(() => {
    if (data) {
      doInit(data);
    } else {
      setHistoryData(null);
    }
  }, [data]);

  // ======

  const doInit = (data) => {
    let PreData = JSON.parse(data.PreData);
    PreData = PreData[data.MasterId];
    PreData = {
      ...PreData?.d,
      ...PreData?.m,
      ...PreData?.w,
    };

    const _data = {
      ...data,
      ChangedData: JSON.parse(data.ChangedData),
      PreData,
    };
    console.log(_data);
    setHistoryData(_data);
  };

  // Plant Production  /  Record history for: VVIS87679  /  Edit Record
  // Record has been modified by Michelle Fernandez from Actions desktop web access at Feb 28, 2025, 8:03:59 AM.
  // Record state: 'Draft Work Order'.

  return (
    <>
      <Modal
        show={!!data}
        title={
          <>
            Plant Production History / {historyData?.WorkOrderNo} /{" "}
            {historyData?.Operation}
          </>
        }
        size="lg"
        onHide={onHide}
        fullscreen={true}
        titleClassName={"flex justify-content-between flex-grow-1"}
      >
        <LoadingBlock isLoading={false}>
          <div className="mb-2">
            Record has been modified by {historyData?.ChangedBy || "--"} at{" "}
            {historyData?.CreatedAt}
            <br />
            Work Order Status: {historyData?.PreData?.m_Status} | Window Status:{" "}
            {historyData?.PreData?.w_Status} | Door Status:{" "}
            {historyData?.PreData?.d_Status}
          </div>
          <div className={cn(styles.changesList)}>
            {historyData?.ChangedData?.map((a) => {
              const { Field, OldValue, NewValue } = a;

              return (
                <div key={`changed_${Field}`} className={cn(styles.changesRow)}>
                  <div className={cn(styles.changesField)} title={Field}>
                    {constants.constants_labelMapping[Field]?.title || Field}
                  </div>
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
