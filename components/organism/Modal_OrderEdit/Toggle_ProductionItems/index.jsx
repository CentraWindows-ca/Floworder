import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import { ITEM_STATUS, ITEM_LITES, ITEM_DOOR_TYPES } from "lib/constants";
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

const ITEM_CATEGORIES = {
  W: {
    label: "Windows",
  },
  PD: {
    label: "Patio Doors",
  },
  SD: {
    label: "Swing Doors",
  },
  ED: {
    label: "Exterior Doors",
  },
  GL: {
    label: "Glass",
  },
};

const Com = ({ title, id }) => {
  const {
    windowItems,
    doorItems,
    onUpdateDoorItem,
    onUpdateWindowItem,
    checkEditable,
  } = useContext(LocalDataContext);

  const [stats, setStats] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const _stats = {
      W: 0,
      PD: 0,
      SD: 0,
      ED: 0,
      GL: 0,
    };

    windowItems?.map((a) => {
      const { System } = a;
      switch (System) {
        case "52PD":
          a.itemType = "PD";
          break;
        case "61DR":
          a.itemType = "SD";
          break;
        case "GL01":
          a.itemType = "GL";
          break;
        default:
          a.itemType = "W";
          break;
      }
      _stats[a.itemType] = _stats[a.itemType] + 1;
    });

    doorItems?.map((a) => {
      const { System } = a;
      a.itemType = "ED";
      _stats[a.itemType] = _stats[a.itemType] + 1;
    });

    setStats(_stats);
  }, [windowItems, doorItems]);

  const handleShowItem = (item, kind) => {
    setEditingItem({ ...item, kind });
  };

  const handleSaveItem = async (Id, item, kind, initItem) => {
    if (kind === "d") {
      await onUpdateDoorItem(Id, item, initItem);
    }

    if (kind === "w") {
      await onUpdateWindowItem(Id, item, initItem);
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
            itemType: "W",
            list: windowItems?.filter((a) => a.itemType === "W"),
          }}
        />
        <TableWindow
          {...{
            handleShowItem,
            itemType: "PD",
            list: windowItems?.filter((a) => a.itemType === "PD"),
          }}
        />
        <TableWindow
          {...{
            handleShowItem,
            itemType: "VD",
            list: windowItems?.filter((a) => a.itemType === "VD"),
          }}
        />
        <TableDoor
          {...{
            handleShowItem,
            itemType: "ED",
            list: doorItems?.filter((a) => a.itemType === "ED"),
          }}
        />
        <TableWindow
          {...{
            handleShowItem,
            itemType: "W",
            list: windowItems?.filter((a) => a.itemType === "GL"),
          }}
        />
      </ToggleBlock>
      <Modal_ItemEdit
        onSave={handleSaveItem}
        onHide={handleCloseItem}
        initItem={editingItem}
        checkEditable={checkEditable}
      />
    </>
  );
};

const TableWindow = ({ handleShowItem, list: data, itemType }) => {
  const { onBatchUpdateItems, checkEditable } = useContext(LocalDataContext);

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

  const handleSave = async () => {
    // treat updating items
    const updates = _.keys(updatingValues)?.map((k) => ({
      keyValue: k,
      fields: updatingValues[k],
    }));
    await onBatchUpdateItems(updates, "w");
    setUpdatingValues({});
  };

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});

  const columnsWindow = constants.applyField([
    {
      key: "Item",
      width: 80,
    },
    {
      key: "Size",
      width: 160,
    },
    {
      title: "Qty",
      key: "Quantity",
      width: 60,
    },
    {
      key: "SubQty",
      width: 85,
    },
    {
      key: "System",
      width: 85,
    },
    {
      key: "Description",
    },
    {
      key: "HighRisk",
      width: 120,
      render: (t, record) => {
        const updatingKey = "HighRisk";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: `wi_${updatingKey}_${record?.Id}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
              disabled: !checkEditable({ group: "windowitems" }),
            }}
          />
        );
      },
    },
    {
      key: "Custom",
      width: 90,
      render: (t, record) => {
        const updatingKey = "Custom";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: `wi_${updatingKey}_${record?.Id}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
              disabled: !checkEditable({ group: "windowitems" }),
            }}
          />
        );
      },
    },
    {
      key: "BTO",
      width: 70,
      render: (t, record) => {
        const updatingKey = "BTO";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: `wi_${updatingKey}_${record?.Id}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
              disabled: !checkEditable({ group: "windowitems" }),
            }}
          />
        );
      },
    },
    {
      key: "Notes",
    },
    {
      title: "Location",
      key: "RackLocationId",
      width: 120,
      render: (t, record) => {
        const updatingKey = "RackLocationId";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];
        return (
          <Editable.EF_Rack
            {...{
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v, rid, o) => {
                handleUpdate(
                  record?.Id,
                  o.RackNumber || null,
                  "RackLocation",
                  record["RackLocation"],
                );
                handleUpdate(
                  record?.Id,
                  o.RecordID || null,
                  updatingKey,
                  record[updatingKey],
                );
              },
              id: `${record?.Id}_RackLocation`,
              isDisplayAvilible: false,
              size: "sm",
              disabled: !checkEditable({ group: "windowitems" }),
            }}
          />
        );
      },
    },
    {
      key: "Status",
      width: 150,
      render: (t, record) => {
        const updatingKey = "Status";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];
        return (
          <Editable.EF_SelectWithLabel
            {...{
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v || null, "Status", record["Status"]),
              id: `Status_${record?.Id}`,
              options: ITEM_STATUS,
              className: "form-select form-select-sm",
              disabled: !checkEditable({ group: "windowitems" }),
            }}
          />
        );
      },
    },
    {
      title: "",
      key: "",
      render: (t, record) => {
        return (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleShowItem(record, "w")}
          >
            Detail
          </button>
        );
      },
      width: 60,
      isNotTitle: true,
    },
  ]);

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
            <label>{ITEM_CATEGORIES[itemType]?.label}</label>
            <div>
              <button
                className="btn btn-primary btn-sm me-2"
                disabled={
                  _.isEmpty(updatingValues) ||
                  !checkEditable({ group: "windowitems" })
                }
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={
                  _.isEmpty(updatingValues) ||
                  !checkEditable({ group: "windowitems" })
                }
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
              isLockFirstColumn: false,
            }}
          />
        </div>
      </DisplayBlock>
    )
  );
};

const TableDoor = ({ handleShowItem, list: data, itemType }) => {
  const { onBatchUpdateItems, checkEditable } = useContext(LocalDataContext);

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
  const handleSave = async () => {
    // treat updating items
    const updates = _.keys(updatingValues)?.map((k) => ({
      keyValue: k,
      fields: updatingValues[k],
    }));
    await onBatchUpdateItems(updates, "d");
    setUpdatingValues({});
  };

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const columns = constants.applyField([
    {
      key: "Item",
      width: 80,
    },
    {
      key: "Size",
      width: 160,
    },
    {
      title: "Qty",
      key: "Quantity",
      width: 60,
    },
    {
      key: "SubQty",
      width: 70,
    },
    {
      key: "System",
      width: 70,
    },
    {
      key: "Description",
    },
    {
      key: "BTO",
      width: 70,
      render: (t, record) => {
        const updatingKey = "BTO";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Checkbox_Yesno
            {...{
              id: `di_${updatingKey}_${record?.Id}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(
                  record?.Id,
                  v || null,
                  updatingKey,
                  record[updatingKey],
                ),
              disabled: !checkEditable({ group: "dooritems" }),
            }}
          />
        );
      },
    },
    {
      key: "Notes",
    },
    {
      title: "Location",
      key: "RackLocationId",
      width: 120,
      render: (t, record) => {
        const updatingKey = "RackLocationId";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];
        return (
          <Editable.EF_Rack
            {...{
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v, rid, o) => {
                handleUpdate(
                  record?.Id,
                  o.RackNumber || null,
                  "RackLocation",
                  record["RackLocation"],
                );
                handleUpdate(
                  record?.Id,
                  o.RecordID || null,
                  updatingKey,
                  record[updatingKey],
                );
              },
              id: `${record?.Id}_RackLocation`,
              isDisplayAvilible: false,
              size: "sm",
              disabled: !checkEditable({ group: "dooritems" }),
            }}
          />
        );
      },
    },
    {
      key: "Status",
      width: 150,
      render: (t, record) => {
        const updatingKey = "Status";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];
        return (
          <Editable.EF_SelectWithLabel
            {...{
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v || null, "Status", record["Status"]),
              id: `Status_${record?.Id}`,
              options: ITEM_STATUS,
              className: "form-select form-select-sm",
              disabled: !checkEditable({ group: "dooritems" }),
            }}
          />
        );
      },
    },
    {
      title: "",
      key: "",
      render: (t, record) => {
        return (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => handleShowItem(record, "d")}
          >
            Detail
          </button>
        );
      },
      width: 70,
      isNotTitle: true,
    },
  ]);

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
            <label>{ITEM_CATEGORIES[itemType]?.label}</label>
            <div>
              <button
                className="btn btn-primary btn-sm me-2"
                disabled={
                  _.isEmpty(updatingValues) ||
                  !checkEditable({ group: "dooritems" })
                }
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={
                  _.isEmpty(updatingValues) ||
                  !checkEditable({ group: "dooritems" })
                }
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
              isLockFirstColumn: false,
            }}
          />
        </div>
      </DisplayBlock>
    )
  );
};

export default Com;
