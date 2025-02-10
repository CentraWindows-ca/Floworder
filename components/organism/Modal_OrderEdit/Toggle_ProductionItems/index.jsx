import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
import TableSortable from "components/atom/TableSortable";
// styles
import styles from "../styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, DisplayBlock } from "../Com";
import Modal_ItemEdit from "./Modal_ItemEdit";

const Com = ({ className, title, id, ...props }) => {
  const {
    windowItems,
    doorItems,
    onUpdateDoorItem,
    onUpdateWindowItem,
    isEditable,
  } = useContext(LocalDataContext);

  const [stats, setStats] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const _stats = {
      W: 0,
      PD: 0,
      VD: 0,
      ED: 0,
      GL: 0,
    };

    windowItems?.map((a) => {
      const { System } = a;
      switch (System) {
        case "52PD":
          _stats["PD"] = _stats["PD"] + 1;
          break;
        case "61DR":
          _stats["VD"] = _stats["VD"] + 1;
          break;
        case "GL01":
          _stats["GL"] = _stats["GL"] + 1;
          break;
        default:
          _stats["W"] = _stats["W"] + 1;
          break;
      }
    });
    _stats["ED"] = doorItems?.length;
    setStats(_stats);
  }, [windowItems, doorItems]);

  const handleShowItem = (item, kind) => {
    setEditingItem({ ...item, kind });
  };

  const handleSaveItem = async (Id, item, kind) => {
    if (kind === "d") {
      await onUpdateDoorItem(Id, item);
    }

    if (kind === "w") {
      await onUpdateWindowItem(Id, item);
    }
  };

  const handleCloseItem = () => {
    setEditingItem(null);
  };

  const jsxTitle = (
    <div className="flex gap-2">
      {title}
      <div className="text-primary font-normal">
        W: {stats.W} | PD: {stats.PD} | VD: {stats.VD} | ED: {stats.ED} | GL:{" "}
        {stats.GL}
      </div>
    </div>
  );

  return (
    <>
      <ToggleBlock title={jsxTitle} id={id}>
        <TableWindow
          {...{
            handleShowItem,
          }}
        />
        <TableDoor
          {...{
            handleShowItem,
          }}
        />
        
      </ToggleBlock>
      <Modal_ItemEdit
        onSave={handleSaveItem}
        onHide={handleCloseItem}
        initItem={editingItem}
        isEditable={isEditable}
      />
    </>
  );
};

const TableWindow = ({ handleShowItem }) => {
  const {
    windowItems,
    doorItems,
    onUpdateDoorItem,
    onUpdateWindowItem,
    isEditable,
  } = useContext(LocalDataContext);

  const data = windowItems

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const columnsWindow = [
    {
      title: "Item",
      key: "Item",
      width: 60,
    },
    {
      title: "Size",
      key: "Size",
      width: 160,
    },
    {
      title: "Qty",
      key: "Quantity",
      width: 60,
    },
    {
      title: "SubQty",
      key: "SubQty",
      width: 70,
    },
    {
      title: "System",
      key: "System",
      width: 70,
    },
    {
      title: "Description",
      key: "Description",
    },
    {
      title: "High Risk",
      key: "HighRisk",
      width: 80,
      render: (t, record) => {
        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: "wi_HighRisk",
              value: record.HighRisk,
              onChange: (v) =>
                onUpdateWindowItem(record?.Id, { HighRisk: v }, "w"),
              disabled: !isEditable,
            }}
          />
        );
      },
    },
    {
      title: "Custom",
      key: "Custom",
      width: 70,
      render: (t, record) => {
        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: "wi_Custom",
              value: record.Custom,
              onChange: (v) =>
                onUpdateWindowItem(record?.Id, { Custom: v }, "w"),
              disabled: !isEditable,
            }}
          />
        );
      },
    },
    {
      title: "BTO",
      key: "BTO",
      width: 50,
      render: (t, record) => {
        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: "wi_BTO",
              value: record.BTO,
              onChange: (v) => onUpdateWindowItem(record?.Id, { BTO: v }, "w"),
              disabled: !isEditable,
            }}
          />
        );
      },
    },

    {
      title: "Notes",
      key: "Notes",
    },
    {
      title: "Location",
      key: "RackLocation",
      width: 75,
    },
    {
      title: "Status",
      key: "Status",
    },
    {
      title: "",
      key: "",
      render: (t, record) => {
        return (
          <button onClick={() => handleShowItem(record, "w")}>Detail</button>
        );
      },
      width: 60,
      isNotTitle: true,
    },
  ];

  // apply filter
  const sortedList = _.orderBy(data, [sort?.sortBy], [sort?.dir])?.filter(
    (a) => {
      return _.every(
        _.keys(filters)?.map((filterBy) => {
          const filterValue = filters[filterBy];
          if (!filterValue) {
            return true;
          }
          return a[filterBy]
            ?.toLowerCase()
            ?.includes(filterValue?.toLowerCase());
        }),
      );
    },
  );

  return (
    !_.isEmpty(data) && (
      <DisplayBlock id="WIN.windowItems">
        <div className={styles.togglePadding}>
          <div className={styles.itemSubTitle}>
            <label>Windows</label>
          </div>
          <TableSortable
            {...{
              data: sortedList,
              columns: columnsWindow,
              sort,
              setSort,
              filters,
              setFilters,
              keyField: "Id",
              className: "text-left",
            }}
          />
        </div>
      </DisplayBlock>
    )
  );
};

const TableDoor = ({ handleShowItem }) => {
  const {
    doorItems,
    onUpdateDoorItem,
    isEditable,
  } = useContext(LocalDataContext);

  const data = doorItems

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const columns = [
    {
      title: "Item",
      key: "Item",
      width: 60,
    },
    {
      title: "Size",
      key: "Size",
      width: 160,
    },
    {
      title: "Qty",
      key: "Quantity",
      width: 60,
    },
    {
      title: "SubQty",
      key: "SubQty",
      width: 70,
    },
    {
      title: "System",
      key: "System",
      width: 70,
    },
    {
      title: "Description",
      key: "Description",
    },

    {
      title: "BTO",
      key: "BTO",
      width: 50,
      render: (t, record) => {
        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: "di_BTO",
              value: record.BTO,
              onChange: (v) => onUpdateDoorItem(record?.Id, { BTO: v }, "d"),
              disabled: !isEditable,
            }}
          />
        );
      },
    },
    {
      title: "Notes",
      key: "Notes",
    },
    {
      title: "Location",
      key: "RackLocation",
      width: 75,
    },
    {
      title: "Status",
      key: "Status",
    },
    {
      title: "",
      key: "",
      render: (t, record) => {
        return (
          <button onClick={() => handleShowItem(record, "d")}>Detail</button>
        );
      },
      width: 60,
      isNotTitle: true,
    },
  ];

  // apply filter
  const sortedList = _.orderBy(data, [sort?.sortBy], [sort?.dir])?.filter(
    (a) => {
      return _.every(
        _.keys(filters)?.map((filterBy) => {
          const filterValue = filters[filterBy];
          if (!filterValue) {
            return true;
          }
          return a[filterBy]
            ?.toLowerCase()
            ?.includes(filterValue?.toLowerCase());
        }),
      );
    },
  );

  return (
    !_.isEmpty(data) && (
      <DisplayBlock id="DOOR.doorItems">
        <div className={styles.togglePadding}>
          <div className={styles.itemSubTitle}>
            <label>Doors</label>
          </div>
          <TableSortable
            {...{
              data: sortedList,
              columns,
              sort,
              setSort,
              filters,
              setFilters,
              keyField: "Id",
              className: "text-left",
            }}
          />
        </div>
      </DisplayBlock>
    )
  );
};

export default Com;
