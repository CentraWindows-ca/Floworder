import React, { useContext, useEffect, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import constants from "lib/constants";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import utils from "lib/utils";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = ({ data, onHide }) => {
  const [historyData, setHistoryData] = useState(null);
  const [tab, setTab] = useState("changesOnly");

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

    PreData = {
      ...PreData?.d,
      ...PreData?.m,
      ...PreData?.w,
    };
  
    let ChangedData = JSON.parse(data.ChangedData);
    ChangedData = ChangedData.reduce((prev, curr) => {
      return { ...prev, [curr.Field]: curr };
    }, {});

    const _data = {
      ...data,
      ChangedData,
      PreData,
    };

    setHistoryData(_data);
  };

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
          <Tabs
            activeKey={tab}
            mountOnEnter={true}
            unmountOnExit={true}
            onSelect={setTab}
          >
            <Tab eventKey="changesOnly" title={"Changes Only"} className="pt-2">
              <ChangesOnly {...{ historyData }} />
            </Tab>
            <Tab
              eventKey="allFields"
              title={"All operation fields"}
              className="pt-2"
            >
              <AllFields {...{ historyData }} />
            </Tab>
          </Tabs>
        </LoadingBlock>
      </Modal>
    </>
  );
};

const prefixOrder = { m: 0, w: 1, d: 2, wi: 3, di: 4 };

const ChangesOnly = ({ historyData }) => {
  return (
    <div className={cn(styles.changesList)}>
      {_.values(historyData?.ChangedData)
        ?.sort((a, b) => sortByPrefix(a.Field, b.Field))
        ?.map((a) => {
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
  );
};

const AllFields = ({ historyData }) => {
  return (
    <div className={cn(styles.changesList)}>
      {_.keys(historyData?.PreData)
        ?.sort(sortByPrefix)
        ?.map((k) => {
          if (constants.constants_labelMapping[k] === false) return null;
          const value = historyData?.PreData[k];
          let jsxValue = <></>;
          if (historyData?.ChangedData[k]) {
            const { OldValue, NewValue } = historyData?.ChangedData[k];
            jsxValue = (
              <>
                <div className={cn(styles.changesOld)}>{OldValue}</div>
                <div className={cn(styles.changesNew)}>{NewValue}</div>
              </>
            );
          } else {
            jsxValue = <div className={cn(styles.changesCurrent)}>{value}</div>;
          }

          return (
            <div key={`changed_${k}`} className={cn(styles.changesRow)}>
              <div className={cn(styles.changesField)} title={k}>
                {constants.constants_labelMapping[k]?.title || k}
              </div>
              {jsxValue}
            </div>
          );
        })}
    </div>
  );
};

const sortByPrefix = (a, b) => {
  const prefixA = a?.split("_")?.[0]
  const prefixB = b?.split("_")?.[0]

  if (prefixOrder[prefixA] !== prefixOrder[prefixB]) {
    return prefixOrder[prefixA] - prefixOrder[prefixB];
  }
  return a.localeCompare(b);
};

export default Com;
