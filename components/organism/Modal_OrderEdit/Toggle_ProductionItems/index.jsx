import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import { ITEM_STATUS, ITEM_LITES, ITEM_DOOR_TYPES } from "lib/constants";
import Editable from "components/molecule/Editable";
import TableSortable from "components/atom/TableSortable";
import Tooltip from "components/atom/Tooltip";
// styles

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, DisplayBlock } from "../Com";
import Modal_ItemEdit from "./Modal_ItemEdit";
// styles
import stylesRoot from "../styles.module.scss";
import stylesCurrent from "./styles.module.scss";

const styles = { ...stylesRoot, ...stylesCurrent };

// TODO: change to from remote
const ITEM_CATEGORIES = [
  {
    label: "Windows",
    dictKey: "windows_Windows",
    labelCode: "W",
    category: "Windows",
    sortOrder: 10,
  },
  {
    label: "Patio Doors",
    dictKey: "windows_PatioDoor",
    labelCode: "PD",
    category: "Windows",
    sortOrder: 20,
  },
  {
    label: "Swing Doors",
    dictKey: "windows_SwingDoor",
    labelCode: "SD",
    category: "Windows",
    sortOrder: 30,
  },
  {
    label: "Window NPD",
    dictKey: "windows_NPD",
    labelCode: "NPD",
    category: "Windows",
    sortOrder: 40,
  },
  {
    label: "Exterior Doors",
    dictKey: "doors_Doors",
    labelCode: "ED",
    category: "Doors",
    sortOrder: 50,
  },
  {
    label: "Window Glass",
    dictKey: "windows_Glass",
    labelCode: "WGL",
    category: "Others",
    sortOrder: 60,
  },
  {
    label: "Door Glass",
    dictKey: "doors_Glass",
    labelCode: "DGL",
    category: "Others",
    sortOrder: 70,
  },
  {
    label: "Door Others",
    dictKey: "doors_Others",
    labelCode: "Door others",
    category: "Others",
    sortOrder: 80,
  },
  {
    label: "Others",
    dictKey: "others_Others",
    labelCode: "Others",
    category: "Others",
    sortOrder: 90,
  },
];

const getCategoryBySystem = (system) => {};

const Com = ({ title, id }) => {
  const {
    windowItems,
    doorItems,
    onBatchUpdateItems,
    uiOrderType,
    dictionary,
    setExpands,
  } = useContext(LocalDataContext);

  const ITEM_CATEGORIES = dictionary.uiItemLabels || [];

  // console.log(_.values(ITEM_CATEGORIES))
  const [stats, setStats] = useState({});
  const [editingItem, setEditingItem] = useState(null);

  const [grouppedItems, setGrouppedItems] = useState({});

  useEffect(() => {
    const _stats = {};
    ITEM_CATEGORIES?.map((o) => {
      _stats[o.dictKey] = 0;
    });

    const _grouppedItems = {};

    // get item type by system code (default windows_Windows)
    const _assign_system_to_item_type = (a) => {
      const { System, Quantity } = a;
      const _cat = _.keys(dictionary.systemCategoryList)?.find((k) => {
        return dictionary.systemCategoryList[k]?.includes(System);
      });
      a.dictKey = _cat || "windows_Windows";

      _stats[a.dictKey] = _stats[a.dictKey] + Quantity;

      if (!_grouppedItems[a.dictKey]) {
        _grouppedItems[a.dictKey] = [];
      }
      _grouppedItems[a.dictKey].push(a);
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

  const handleTabClick = (e, dictKey) => {
    // Prevent the action passing to the parent component
    e.stopPropagation();
    setExpands((prev) => ({
      ...prev,
      [id]: true,
    }));

    setTimeout(() => {
      const target = document.getElementById(dictKey);

      // NOTE: its a hack. we have sticky title, so we need to scroll 24px less
      const scrollContainer = target?.closest(".modal-body");
      if (target && scrollContainer) {
        const y = target.offsetTop - 24;
        scrollContainer.scrollTo({ top: y, behavior: "smooth" });
      }
    }, 200);
  };

  const jsxTitle = (
    <div className="flex gap-2">
      {title}
      <div className={cn("text-primary font-normal", styles.itemTabs)}>
        {ITEM_CATEGORIES?.map((o, i) => {
          const { labelCode, label, dictKey } = o;
          let itemCount = grouppedItems[dictKey]?.length || 0;
          let actualQty = stats[dictKey];
          return (
            <span
              key={`${labelCode}_${i}`}
              title={label}
              className={cn(
                styles.labelCode,
                stats[dictKey] ? styles.toolButton : styles.zero,
              )}
              onClick={
                stats[dictKey] ? (e) => handleTabClick(e, dictKey) : null
              }
            >
              {labelCode}: {itemCount}
              {itemCount !== actualQty ? (
                <span className="text-gray-400"> (qty {actualQty})</span>
              ) : null}
            </span>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <ToggleBlock title={jsxTitle} id={id}>
        {ITEM_CATEGORIES?.sort((a, b) => {
          a.sortOrder > b.sortOrder ? 1 : -1;
        })?.map((o) => {
          const { dictKey, category } = o;

          switch (category) {
            case "Windows":
              return (
                <TableWindow
                  {...{
                    key: dictKey,
                    ...o,
                    handleShowItem,
                    list: grouppedItems,
                    stats,
                  }}
                />
              );
            case "Doors":
              return (
                <TableDoor
                  {...{
                    key: dictKey,
                    ...o,
                    handleShowItem,
                    list: grouppedItems,
                    stats,
                  }}
                />
              );
            case "Others":
              return (
                <TableOther
                  {...{
                    key: dictKey,
                    ...o,
                    handleShowItem,
                    list: grouppedItems,
                    stats,
                    kind: dictKey.startsWith("doors") ? "d" : "w",
                  }}
                />
              );
            default:
              break;
          }
        })}
      </ToggleBlock>
      <Modal_ItemEdit
        onSave={handleSaveItem}
        onHide={handleCloseItem}
        initItem={editingItem}
      />
    </>
  );
};

const TableWindow = ({ stats, handleShowItem, list, dictKey, label }) => {
  const { onBatchUpdateItems, checkEditable } = useContext(LocalDataContext);
  const data = list?.[dictKey];

  const blockId = "WINDOW.windowItems";
  const group = "windowitems";
  const _isGroupEditable = checkEditable({ group });

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
              disabled: !_isGroupEditable,
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
              disabled: !_isGroupEditable,
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
              disabled: !_isGroupEditable,
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
              disabled: !_isGroupEditable,
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
              disabled: !_isGroupEditable,
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
              disabled: !_isGroupEditable,
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
      <DisplayBlock id={blockId}>
        <div className={styles.togglePadding} id={dictKey}>
          <div className={cn(styles.itemSubTitle, styles.subTitle)}>
            <label>
              {label} <small className="fw-normal">( {stats[dictKey]} )</small>
            </label>
            <div>
              <button
                className="btn btn-primary btn-sm me-2"
                disabled={_.isEmpty(updatingValues) || !_isGroupEditable}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={_.isEmpty(updatingValues) || !_isGroupEditable}
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

const TableDoor = ({ stats, handleShowItem, list, label, dictKey }) => {
  const { onBatchUpdateItems, checkEditable } = useContext(LocalDataContext);
  const data = list?.[dictKey];

  const blockId = "DOOR.doorItems";
  const group = "dooritems";
  const _isGroupEditable = checkEditable({ group });

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
              disabled: !_isGroupEditable,
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
              id: `di_${updatingKey}_${record?.Id}`,
              value:
                overrideValue !== undefined
                  ? overrideValue
                  : record[updatingKey],
              onChange: (v) =>
                handleUpdate(record?.Id, v, updatingKey, record[updatingKey]),
              disabled: !_isGroupEditable,
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
              disabled: !_isGroupEditable,
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
              disabled: !_isGroupEditable,
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
      <DisplayBlock id={blockId}>
        <div className={styles.togglePadding} id={dictKey}>
          <div className={cn(styles.itemSubTitle, styles.subTitle)}>
            <label>
              {label} <small className="fw-normal">( {stats[dictKey]} )</small>
            </label>
            <div>
              <button
                className="btn btn-primary btn-sm me-2"
                disabled={_.isEmpty(updatingValues) || !_isGroupEditable}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={_.isEmpty(updatingValues) || !_isGroupEditable}
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

const initialValueOfStatus = ITEM_STATUS?.find((a) => a.sort === 0)?.key;
const TableOther = ({ stats, list, label, dictKey, kind = "w" }) => {
  const { onBatchUpdateItems, checkEditable } = useContext(LocalDataContext);
  const data = list?.[dictKey];

  const blockId = kind === "w" ? "WINDOW.windowItems" : "DOOR.doorItems";
  const group = kind === "w" ? "windowitems" : "dooritems";
  const _isGroupEditable = checkEditable({ group });

  const [isUpdatableMapping, setIsUpdatableMapping] = useState({});
  const [updatingValues, setUpdatingValues] = useState({});

  useEffect(() => {
    init(data);
  }, [data]);

  const init = (data) => {
    let _isUpdatableMappingInit = {};
    if (data) {
      // preset isUpdatableMapping
      data?.forEach((a) => {
        const { RackLocationId, Status, Id } = a;

        let _allowupdate = false;

        // NOTE: rack and status - if its updatable
        if (RackLocationId) _allowupdate = true;
        if (Status && Status !== initialValueOfStatus) _allowupdate = true;

        if (_allowupdate) {
          _isUpdatableMappingInit[Id] = true;
        }
      });

      setIsUpdatableMapping(_isUpdatableMappingInit);
    }

    setUpdatingValues({})
  };

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

    await onBatchUpdateItems(updates, kind);
    setUpdatingValues({});
    setIsUpdatableMapping({});
  };

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});

  // ====== updatable rule
  const handleChangeIsUpdatable = (v, record) => {
    setIsUpdatableMapping((prev) => {
      return {
        ...prev,
        [record?.Id]: v,
      };
    });

    if (!v) {
      setUpdatingValues((prev) => {
        const _v = JSON.parse(JSON.stringify(prev));
        
        // NOTE: rack and status - if its updatable
        _.set(_v, [record?.Id, 'RackLocationId'], '')
        _.set(_v, [record?.Id, 'Status'], initialValueOfStatus)

        return _v;
      });
    }
  };

  const columns = constants.applyField([
    _isGroupEditable
      ? {
          // NOTE 20250730: update/not update of others
          key: "isUpdatableMapping",
          title: "Update",
          width: 40,
          render: (t, record) => {
            const updatingKey = "isUpdatableMapping";
            return (
              <Editable.EF_Checkbox
                {...{
                  id: `di_${updatingKey}_${record?.Id}`,
                  value: isUpdatableMapping?.[record?.Id],
                  onChange: (v) => handleChangeIsUpdatable(v, record),
                }}
              />
            );
          },
        }
      : null,
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
              disabled: !_isGroupEditable,
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

        const value =
          overrideValue !== undefined ? overrideValue : record[updatingKey];
          
        // NOTE 20250730: update/not update of others
        if (!isUpdatableMapping?.[record?.Id]) {
          return !value || value === "Not Started" ? "" : value;
        }

        return (
          <Editable.EF_Rack
            {...{
              value,
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
              placeholder: "--",
              disabled:
                // NOTE 20250730: update/not update of others
                !isUpdatableMapping?.[record?.Id] || !_isGroupEditable,
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
        const value =
          overrideValue !== undefined ? overrideValue : record[updatingKey];

        // NOTE 20250730: update/not update of others
        if (!isUpdatableMapping?.[record?.Id]) {
          return !value || value === "Not Started" ? "" : value;
        }

        return (
          <Editable.EF_SelectWithLabel
            {...{
              value,
              onChange: (v) =>
                handleUpdate(record?.Id, v || null, "Status", record["Status"]),
              id: `Status_${record?.Id}`,
              options: ITEM_STATUS,
              className: "form-select form-select-sm",
              disabled: !_isGroupEditable,
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
      <DisplayBlock id={blockId}>
        <div className={styles.togglePadding} id={dictKey}>
          <div className={cn(styles.itemSubTitle, styles.subTitle)}>
            <label>
              {label} <small className="fw-normal">( {stats[dictKey]} )</small>
            </label>
            <div>
              <button
                className="btn btn-primary btn-sm me-2"
                disabled={_.isEmpty(updatingValues) || !_isGroupEditable}
                onClick={handleSave}
              >
                Save
              </button>
              <button
                className="btn btn-secondary btn-sm"
                disabled={_.isEmpty(updatingValues) || !_isGroupEditable}
                onClick={() => init(data)}
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
