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
  windows_Windows: {
    label: "Windows",
    dict_key: "windows_Windows",
    display_key: "W",
    productType: "w"
  },
  windows_PatioDoor: {
    label: "Patio Doors",
    dict_key: "windows_PatioDoor",
    display_key: "PD",
    productType: "w"
  },
  windows_SwingDoor: {
    label: "Swing Doors",
    dict_key: "windows_SwingDoor",
    display_key: "SD",
    productType: "w"
  },
  windows_NPD: {
    label: "Window NPD",
    dict_key: "windows_NPD",
    display_key: "NPD",
    productType: "w"
  },
  windows_Glass: {
    label: "Window Glass",
    dict_key: "windows_Glass",
    display_key: "WGL",
    productType: "m"
  },
  doors_Doors: {
    label: "Exterior Doors",
    dict_key: "doors_Doors",
    display_key: "ED",
    productType: "d"
  },
  doors_Glass: {
    label: "Door Glass",
    dict_key: "doors_Glass",
    display_key: "DGL",
    productType: "m"
  },
  doors_Others: {
    label: "Door Others",
    dict_key: "doors_Others",
    display_key: "Door others",
    productType: "m"
  },
  others_Others: {
    label: "Others",
    dict_key: "others_Others",
    display_key: "Others",
    productType: "m"
  },
};

const getCategoryBySystem = (system) => {};

const Com = ({ title, id }) => {
  const {
    windowItems,
    doorItems,
    onBatchUpdateItems,
    checkEditable,
    uiOrderType,
    dictionary,
    initKind
  } = useContext(LocalDataContext);

  const [stats, setStats] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  const [grouppedItems, setGrouppedItems] = useState({});

  useEffect(() => {
    const _stats = {};

    _.keys(ITEM_CATEGORIES)?.map((k) => {
      _stats[k] = 0;
    });

    const _grouppedItems = {};

    // get item type by system code (default windows_Windows)
    const _assign_system_to_item_type = (a) => {
      const { System } = a;
      const _cat = _.keys(dictionary.systemCategoryList)?.find((k) => {
        return dictionary.systemCategoryList[k]?.includes(System);
      });
      a.itemType = _cat || "windows_Windows";

      _stats[a.itemType] = _stats[a.itemType] + 1;

      if (!_grouppedItems[a.itemType]) {
        _grouppedItems[a.itemType] = [];
      }
      _grouppedItems[a.itemType].push(a);
    };

    windowItems?.map(_assign_system_to_item_type);
    doorItems?.map(_assign_system_to_item_type);

    setGrouppedItems(_grouppedItems);

    setStats(_stats);
  }, [windowItems, doorItems, uiOrderType]);

  const handleShowItem = (item, kind) => {
    setEditingItem({ ...item, kind });
  };

  const handleSaveItem = async (Id, item, kind) => {
    await onBatchUpdateItems(
      [
        {
          keyValue: Id,
          fields: item,
        },
      ],
      kind,
    );
  };

  const handleCloseItem = () => {
    setEditingItem(null);
  };

  const jsxTitle = (
    <div className="flex gap-2">
      {title}
      <div className={cn("text-primary font-normal", styles.itemTabs)}>
        {_.keys(stats)
          .map((k) => {
            const {display_key} = ITEM_CATEGORIES[k]
            return <span>{display_key}: {stats[k]}</span>
          })
        }
      </div>
    </div>
  );

  return (
    <>
      <ToggleBlock title={jsxTitle} id={id}>
        <TableWindow
          {...{
            handleShowItem,
            itemType: "windows_Windows",
            list: grouppedItems
          }}
        />
        <TableWindow
          {...{
            handleShowItem,
            itemType: "windows_PatioDoor",
            list: grouppedItems
          }}
        />
        <TableWindow
          {...{
            handleShowItem,
            itemType: "windows_SwingDoor",
            list: grouppedItems
          }}
        />
        <TableWindow
          {...{
            handleShowItem,
            itemType: "windows_NPD",
            list: grouppedItems,
          }}
        />
        <TableDoor
          {...{
            handleShowItem,
            itemType: "doors_Doors",
            list: grouppedItems,
          }}
        />
        <TableWindow
          {...{
            handleShowItem,
            itemType: "windows_Glass",
            list: grouppedItems,
          }}
        />
        <TableWindow
          {...{
            handleShowItem,
            itemType: "doors_Glass",
            list: grouppedItems,
          }}
        />
        <TableOther
          {...{
            itemType: "others_Others",
            list: grouppedItems,
          }}
        />
        <TableOther
          {...{
            itemType: "doors_Others",
            list: grouppedItems,
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

const TableWindow = ({ handleShowItem, list, itemType }) => {
  const { onBatchUpdateItems, checkEditable } = useContext(LocalDataContext);
  const data = list?.[itemType]

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
      render: (t, record) => {
        const updatingKey = "Notes";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];
        return (
          <Editable.EF_Input
            {...{
              className: "form-control form-control-sm",
              id: `wi_${updatingKey}_${record?.Id}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) => {
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]);
              },
              disabled: !checkEditable({ group: "windowitems" }),
              size: "sm",
              placeholder: "--",
            }}
          />
        );
      },
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
          const filterValue = filters[filterBy]?.value;
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

const TableDoor = ({ handleShowItem, list, itemType }) => {
  const { onBatchUpdateItems, checkEditable } = useContext(LocalDataContext);
  const data = list?.[itemType]

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
      render: (t, record) => {
        const updatingKey = "Notes";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Input
            {...{
              id: `wi_${updatingKey}_${record?.Id}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
              disabled: !checkEditable({ group: "windowitems" }),
              size: "sm",
              placeholder: "--",
            }}
          />
        );
      },
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
          const filterValue = filters[filterBy]?.value;
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

const TableOther = ({ list, itemType }) => {
  const { onBatchUpdateItems, checkEditable } = useContext(LocalDataContext);
  const data = list?.[itemType]

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
      key: "Notes",
      render: (t, record) => {
        const updatingKey = "Notes";
        const overrideValue = updatingValues?.[record?.Id]?.[updatingKey];

        return (
          <Editable.EF_Input
            {...{
              id: `wi_${updatingKey}_${record?.Id}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
              disabled: !checkEditable({ group: "windowitems" }),
              size: "sm",
              placeholder: "--",
            }}
          />
        );
      },
    },
  ]);

  // apply filter
  const sortedList = _.orderBy(data, [sort?.sortBy], [sort?.dir])?.filter(
    (a) => {
      return _.every(
        _.keys(filters)?.map((filterBy) => {
          const filterValue = filters[filterBy]?.value;
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
