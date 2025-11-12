import React, { useContext, useEffect, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import constants from "lib/constants";
import {labelMapping} from "lib/constants/production_constants_labelMapping"

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import utils from "lib/utils";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = ({ data, layer, onHide }) => {
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
    let ChangedData = data.jsonDataObj;

    console.log(ChangedData)

    const ChangedData_Main = ChangedData?.OrderLevelChanges?.reduce(
      (prev, curr) => {
        return { ...prev, [curr.Field]: curr };
      },
      {},
    );

    const ChangedData_AttachmentList = ChangedData?.Attachments?.filter(
      (a) => a.Type === "file",
    );

    const _data = {
      ...data,
      ChangedData_Main,
      ChangedData_AttachmentList,
    };

    setHistoryData(_data);
  };

  return (
    <>
      <Modal
        show={!!data}
        title={
          <>
            Invoice History / {historyData?.WorkOrderNo} /{" "}
            {historyData?.operation_display}
          </>
        }
        size="lg"
        onHide={onHide}
        fullscreen={true}
        titleClassName={"flex justify-content-between flex-grow-1"}
        layer={layer}
      >
        <LoadingBlock isLoading={false}>
          <div className="mb-2">
            Record has been modified by <b>{historyData?.createdBy || "--"}</b>{" "}
            at <b>{historyData?.createdAt}</b>
            <br />
            Source App. : {historyData?.SourceModule}
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
          </Tabs>
        </LoadingBlock>
      </Modal>
    </>
  );
};

const prefixOrder = { inv: 0, invh: 1, m: 2 };

const ChangesOnly = ({ historyData }) => {
  return (
    <div className={cn(styles.changesList)}>
      {/* order fields */}
      {_.values(historyData?.ChangedData_Order)
        ?.sort((a, b) => sortByPrefix(a.Field, b.Field))
        ?.map((a) => {
          const { Field, OldValue, NewValue } = a;

          return (
            <div key={`changed_${Field}`} className={cn(styles.changesRow)}>
              <div className={cn(styles.changesField)} title={Field}>
                {labelMapping[Field]?.title || Field}
              </div>
              <div className={cn(styles.changesOld)}>{OldValue}</div>
              <div className={cn(styles.changesNew)}>{NewValue}</div>
            </div>
          );
        })}

      <Files
        {...{
          list: historyData?.ChangedData_AttachmentList,
          label: "Attachments",
        }}
      />
    </div>
  );
};

const MultiLines = ({ list, label }) => {
  const displayList = list;
  if (_.isEmpty(displayList)) return null;

  return (
    <div className={cn(styles.changesRow)}>
      <div className={cn(styles.changesField)}>{label}</div>
      <div className={cn(styles.changesCurrent)}>
        <div className={cn(styles.changedItemList)}>
          {displayList?.map((a) => {
            const { Id, ...Changes } = a;
            return (
              <div key={Id} className={cn(styles.itemInfoRow)}>
                {!_.isEmpty(Changes) ? (
                  _.values(Changes)?.map((b) => {
                    const { Field, OldValue, NewValue } = b;
                    const displayField = Field;
                    if (OldValue === NewValue) return null;
                    return (
                      <div
                        key={`${label}_changed_${Field}`}
                        className={cn(styles.changesRow)}
                      >
                        <div className={cn(styles.changesField)} title={Field}>
                          {labelMapping[displayField]
                            ?.title || displayField}
                        </div>
                        <div className={cn(styles.changesOld)}>{OldValue}</div>
                        <div className={cn(styles.changesNew)}>{NewValue}</div>
                      </div>
                    );
                  })
                ) : (
                  <div>Deleted</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Files = ({ list, label }) => {
  const displayList = list;
  if (_.isEmpty(displayList)) return null;

  return (
    <div className={cn(styles.changesRow)}>
      <div className={cn(styles.changesField)}>{label}</div>
      <div className={cn(styles.changesCurrent)}>
        <div className={cn(styles.changedItemList)}>
          {displayList?.map((a) => {
            const { Id, Type, Notes } = a;
            return (
              <div key={`item_files_${Id}`} className={cn(styles.itemInfoRow)}>
                <div className={cn(styles.changedItemRow)}>Id: [{Id}]</div>
                <div className={cn(styles.changesRow)}>
                  <div className={cn(styles.changesOld)}>{Notes}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const sortByPrefix = (a, b) => {
  const prefixA = a?.split("_")?.[0];
  const prefixB = b?.split("_")?.[0];

  if (prefixOrder[prefixA] !== prefixOrder[prefixB]) {
    return prefixOrder[prefixA] - prefixOrder[prefixB];
  }
  return a?.localeCompare(b);
};

export default Com;
