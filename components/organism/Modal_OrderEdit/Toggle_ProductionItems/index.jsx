import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import TableSortable from "components/atom/TableSortable";
// styles


import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, DisplayBlock } from "../Com";
import Modal_ItemEdit from "./Modal_ItemEdit";
// styles
import stylesRoot from "../styles.module.scss";
import stylesCurrent from "./styles.module.scss";

const styles = { ...stylesRoot, ...stylesCurrent };

const Com = ({ title, id }) => {
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
    windowItems: data,
    onBatchUpdateItems,
    isEditable,
  } = useContext(LocalDataContext);

  const [updatingValues, setUpdatingValues] = useState({});
  const handleUpdate = (id, v, k, initV) => {
    setUpdatingValues((prev) => {
      const _v = JSON.parse(JSON.stringify(prev));

      if (v !== initV) {
        _.set(_v, [id, k], v);
      } else {
        _.unset(_v, [id, k]);
        if (_.isEmpty(_v[id])) {
          _.unset(_v[id]);
        }
      }

      return _v;
    });
  };

  const handleSave = () => {
    // treat updating items
    const updates = _.keys(updatingValues)?.map(k => ({
      keyValue: k,
      fields: updatingValues[k]
    }))
    onBatchUpdateItems(updates, 'w')
  };

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
        const updatingKey = "HighRisk";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: `wi_${updatingKey}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
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
        const updatingKey = "Custom";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: `wi_${updatingKey}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
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
        const updatingKey = "BTO";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: `wi_${updatingKey}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
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
          <div className={cn(styles.itemSubTitle, styles.subTitle)}>
            <label>Windows</label>
            <div>
              <button
                className="btn btn-primary btn-xs me-2"
                disabled={_.isEmpty(updatingValues)}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-xs"
                disabled={_.isEmpty(updatingValues)}
                onClick={() => setUpdatingValues({})}
              >
                Cancel
              </button>
            </div>
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
              headerClassName: cn(styles.thead),
            }}
          />
        </div>
      </DisplayBlock>
    )
  );
};

const TableDoor = ({ handleShowItem }) => {
  const {
    doorItems: data,
    onBatchUpdateItems,
    isEditable,
  } = useContext(LocalDataContext);

  const [updatingValues, setUpdatingValues] = useState({});
  const handleUpdate = (id, v, k, initV) => {
    setUpdatingValues((prev) => {
      const _v = JSON.parse(JSON.stringify(prev));
      if (v !== initV) {
        _.set(_v, [id, k], v);
      } else {
        _.unset(_v, [id, k]);
        if (_.isEmpty(_v[id])) {
          _.unset(_v, [id]);
        }
      }

      return _v;
    });
  };
  const handleSave = () => {
    // treat updating items
    const updates = _.keys(updatingValues)?.map(k => ({
      keyValue: k,
      fields: updatingValues[k]
    }))
    onBatchUpdateItems(updates, 'd')
  };
  
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
        const updatingKey = "BTO";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: `di_${updatingKey}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
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
          <div className={cn(styles.itemSubTitle, styles.subTitle)}>
            <label>Doors</label>
            <div>
              <button
                className="btn btn-primary btn-xs me-2"
                disabled={_.isEmpty(updatingValues)}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-xs"
                disabled={_.isEmpty(updatingValues)}
                onClick={() => setUpdatingValues({})}
              >
                Cancel
              </button>
            </div>
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
              headerClassName: cn(styles.thead),
            }}
          />
        </div>
      </DisplayBlock>
    )
  );
};

export default Com;
