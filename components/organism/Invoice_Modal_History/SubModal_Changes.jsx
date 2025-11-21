import React, { useContext, useEffect, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import constants from "lib/constants";
import { labelMapping } from "lib/constants/invoice_constants_labelMapping";

import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import utils, { tryParse } from "lib/utils";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = ({ data, layer, onHide }) => {
  const [historyData, setHistoryData] = useState(null);
  const [changedDataList, setChangedDataList] = useState(null);
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
    let ChangedTables = JSON.parse(JSON.stringify(data.jsonDataObj?.Data));
    const _newChangedTables = ChangedTables?.map((tb) => {
      let { TableName, Changes } = tb;

      let _distructure = [];
      const _changesFromJson = [];

      // find JSON, remove it
      Changes?.forEach((ch, i) => {
        const { Field, OldValue, NewValue } = ch;
        // rename fields
        switch (TableName) {
          case "Invoice":
            Changes[i].Field = `inv_${Field}`
            break;
          case "InvoiceHeader":
            Changes[i].Field = `invh_${Field}`
            break;
          default:
            break;
        }

        if (Field === "orderJSON") {
          // distructure
          Changes[i] = null;
          _distructure.push({
            OldValue,
            NewValue,
          });
        }
      });

      // compare JSON
      _distructure.forEach((a) => {
        const { OldValue, NewValue } = a;
        const objOldValue = tryParse(OldValue) || {};
        const objNewValue = tryParse(NewValue) || {};

        _.keys(objNewValue)?.forEach((k) => {
          const _newV = objNewValue[k]?.toString();
          const _oldV = objOldValue[k]?.toString();
          if (_newV !== _oldV) {
            _changesFromJson.push({
              Field: `m_${k}`,
              OldValue: _oldV,
              NewValue: _newV,
            });
          }
        });
      });

      Changes = Changes?.filter(Boolean);
      Changes = [...Changes, ..._changesFromJson];

      return { ...tb, Changes };
    });

    console.log(_newChangedTables)

    setChangedDataList(_newChangedTables);
    setHistoryData(data);
  };

  return (
    <>
      <Modal
        show={!!data}
        title={
          <>
            Invoice History / {historyData?.jsonDataObj?.DisplayName} /{" "}
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
              {changedDataList?.map((a, i) => {
                const { TableName, Changes } = a;

                switch (TableName) {
                  case "InvoiceUploadingFiles":
                    return (
                      <div key={i}>
                        <Files {...{ Changes }} />
                      </div>
                    );
                  default:
                    return (
                      <div key={i}>
                        <ChangesOnly {...{ Changes }} />
                      </div>
                    );
                }
              })}
            </Tab>
          </Tabs>
        </LoadingBlock>
      </Modal>
    </>
  );
};

const prefixOrder = { inv: 0, invh: 1, m: 2 };

const ChangesOnly = ({ Changes }) => {
  return (
    <div className={cn(styles.changesList)}>
      {/* order fields */}
      {Changes?.sort((a, b) => sortByPrefix(a.Field, b.Field))?.map((a, i) => {
        const { Field, OldValue, NewValue } = a;

        return (
          <div key={`changed_${i}`} className={cn(styles.changesRow)}>
            <div className={cn(styles.changesField)} title={Field}>
              {labelMapping[Field]?.title || Field}
            </div>
            <div className={cn(styles.changesOld)}>{OldValue?.toString()}</div>
            <div className={cn(styles.changesNew)}>{NewValue?.toString()}</div>
          </div>
        );
      })}
    </div>
  );
};

// const MultiLines = ({ list, label }) => {
//   const displayList = list;
//   if (_.isEmpty(displayList)) return null;

//   return (
//     <div className={cn(styles.changesRow)}>
//       <div className={cn(styles.changesField)}>{label}</div>
//       <div className={cn(styles.changesCurrent)}>
//         <div className={cn(styles.changedItemList)}>
//           {displayList?.map((a) => {
//             const { Id, ...Changes } = a;
//             return (
//               <div key={Id} className={cn(styles.itemInfoRow)}>
//                 {!_.isEmpty(Changes) ? (
//                   _.values(Changes)?.map((b) => {
//                     const { Field, OldValue, NewValue } = b;
//                     const displayField = Field;
//                     if (OldValue === NewValue) return null;
//                     return (
//                       <div
//                         key={`${label}_changed_${Field}`}
//                         className={cn(styles.changesRow)}
//                       >
//                         <div className={cn(styles.changesField)} title={Field}>
//                           {labelMapping[displayField]?.title || displayField}
//                         </div>
//                         <div className={cn(styles.changesOld)}>{OldValue}</div>
//                         <div className={cn(styles.changesNew)}>{NewValue}</div>
//                       </div>
//                     );
//                   })
//                 ) : (
//                   <div>Deleted</div>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

const Files = ({ list, label, Changes }) => {
  return (
    <div className={cn(styles.changesList)}>
      {Changes?.sort((a, b) => sortByPrefix(a.Field, b.Field))?.map((a, i) => {
        let { Field, OldValue, NewValue } = a;

        // if its a file
        if (NewValue?.FileName) {
          const { FileName, Length, ContentType } = NewValue;
          const Size = Length
            ? `${utils.formatNumber(Length / 1024)} KB`
            : "--";

          NewValue = (
            <div>
              <div className={cn(styles.itemInfoRow)}>
                <div className={cn(styles.changedItemRow)}>
                  <b>FileName</b>
                  <span>{FileName}</span>
                  <b>Size</b>
                  <div>{Size}</div>
                  {/* <b>ContentType</b>
                  <div>{ContentType}</div> */}
                </div>
              </div>
            </div>
          );
        }

        return (
          <div key={`changed_${i}`} className={cn(styles.changesRow)}>
            <div className={cn(styles.changesField)} title={Field}>
              {labelMapping[Field]?.title || Field}
            </div>
            <div className={cn(styles.changesOld)}>{OldValue}</div>
            <div className={cn(styles.changesNew)}>{NewValue}</div>
          </div>
        );
      })}
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
