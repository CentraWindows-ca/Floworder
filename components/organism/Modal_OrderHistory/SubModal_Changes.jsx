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
    let ChangedData = JSON.parse(data.ChangedData);
    
    const ChangedData_Order = ChangedData?.OrderLevelChanges?.reduce(
      (prev, curr) => {
        return { ...prev, [curr.Field]: curr };
      },
      {},
    );

    const ChangedData_ItemList = ChangedData?.ItemChanges?.map((a) => {
      const ChangedData_Item = a.Changes?.reduce((prev, curr) => {
        return { ...prev, [curr.Field]: curr };
      }, {});
      return {
        ...a,
        ChangedData_Item,
      };
    });

    const ChangedData_AttachmentList = ChangedData?.Attachments?.filter(
      (a) => a.Type === "file",
    );
    const ChangedData_ImageList = ChangedData?.Attachments?.filter(
      (a) => a.Type === "image",
    );

    const _data = {
      ...data,
      ChangedData_Order,
      ChangedData_ItemList,
      ChangedData_AttachmentList,
      ChangedData_ImageList,
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
        layer={layer}
      >
        <LoadingBlock isLoading={false}>
          <div className="mb-2">
            Record has been modified by <b>{historyData?.LastModifiedBy || "--"}</b>{" "}
            at <b>{historyData?.CreatedAt}</b>
            <br />
            Source : {historyData?.Source}
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
            {/* <Tab
              eventKey="allFields"
              title={"All operation fields"}
              className="pt-2"
            >
              <AllFields {...{ historyData }} />
            </Tab> */}
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
      {/* order fields */}
      {_.values(historyData?.ChangedData_Order)
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
      {/* items */}
      <Items
        {...{
          list: historyData?.ChangedData_ItemList,
          type: "wi",
          label: "Windows Items",
        }}
      />
      <Items
        {...{
          list: historyData?.ChangedData_ItemList,
          type: "di",
          label: "Doors Items",
        }}
      />
      {/* <Files
        {...{
          list: historyData?.ChangedData_ImageList,
          label: "Images",
        }}
      />
      <Files
        {...{
          list: historyData?.ChangedData_AttachmentList,
          label: "Attachments",
        }}
      /> */}
    </div>
  );
};

const Items = ({ list, type, label }) => {
  const displayList = list?.filter((a) => a.ItemInfo?.ItemType === type);
  if (_.isEmpty(displayList)) return null;

  return (
    <div className={cn(styles.changesRow)}>
      <div className={cn(styles.changesField)}>{label}</div>
      <div className={cn(styles.changesCurrent)}>
        <div className={cn(styles.changedItemList)}>
          {displayList?.map((a) => {
            const { ItemId, ItemNo, System, SubQty } = a?.ItemInfo;
            return (
              <div key={ItemId} className={cn(styles.itemInfoRow)}>
                <div className={cn(styles.changedItemRow)}>
                  Item: [{System}] {ItemNo}: {SubQty}{" "}
                </div>
                {a?.Changes?.map((b) => {
                  const { Field, OldValue, NewValue } = b;
                  const displayField = Field;
                  return (
                    <div
                      key={`item_changed_${Field}`}
                      className={cn(styles.changesRow)}
                    >
                      <div className={cn(styles.changesField)} title={Field}>
                        {constants.constants_labelMapping[displayField]
                          ?.title || displayField}
                      </div>
                      <div className={cn(styles.changesOld)}>{OldValue}</div>
                      <div className={cn(styles.changesNew)}>{NewValue}</div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Files = ({ list, label }) => {
  const displayList = list
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
                <div
                  className={cn(styles.changesRow)}
                >
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

// const AllFields = ({ historyData }) => {
//   return (
//     <div className={cn(styles.changesList)}>
//       {_.keys(historyData?.PreData)
//         ?.sort(sortByPrefix)
//         ?.map((k) => {
//           if (constants.constants_labelMapping[k] === false) return null;
//           const value = historyData?.PreData[k];
//           let jsxValue = <></>;
//           if (historyData?.ChangedData_Order[k]) {
//             const { OldValue, NewValue } = historyData?.ChangedData_Order[k];
//             jsxValue = (
//               <>
//                 <div className={cn(styles.changesOld)}>{OldValue}</div>
//                 <div className={cn(styles.changesNew)}>{NewValue}</div>
//               </>
//             );
//           } else {
//             jsxValue = <div className={cn(styles.changesCurrent)}>{value}</div>;
//           }

//           return (
//             <div key={`changed_${k}`} className={cn(styles.changesRow)}>
//               <div className={cn(styles.changesField)} title={k}>
//                 {constants.constants_labelMapping[k]?.title || k}
//               </div>
//               {jsxValue}
//             </div>
//           );
//         })}
//     </div>
//   );
// };

const sortByPrefix = (a, b) => {
  const prefixA = a?.split("_")?.[0];
  const prefixB = b?.split("_")?.[0];

  if (prefixOrder[prefixA] !== prefixOrder[prefixB]) {
    return prefixOrder[prefixA] - prefixOrder[prefixB];
  }
  return a?.localeCompare(b);
};

export default Com;
