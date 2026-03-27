import React, { useState, useEffect, useContext, useMemo, useRef } from "react";
import Editable from "components/molecule/Editable";
import cn from "classnames";
import _ from "lodash";

import OrderByIcon from "components/atom/OrderByIcon";
import LabelDisplay from "components/atom/LabelDisplay";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const {
    data,
    filters,
    setFilters,
    isEnableFilter = true,
    columns,
    sort,
    setSort,
    multiChecked,
    setMultiChecked,
    keyField = "m_MasterId",
    keyFieldPrefix = "",
    className,
    headerClassName,
    isLockFirstColumn = true,
    trParams, // () => {} render <tr/> properties
    renderInfoBefore,
    renderInfoAfter,
    ...rest
  } = props;

  const _filteredColumns = useMemo(() => columns.filter(Boolean), [columns]);

  const handleSelectAll = () => {
    const _v = {};
    data?.forEach((a) => {
      _v[a[keyField]] = true;
    });
    setMultiChecked(_v);
  };

  return (
    <>
      <TableWrapper
        {...{
          isLockFirstColumn,
          className,
          ...rest,
        }}
      >
        <TableHeader
          {...{
            columns,
            sort,
            setSort,
            // === for multi select (
            multiChecked,
            setMultiChecked,
            dataCount: data?.length,
            onSelectAll: handleSelectAll,
            // === for multi select )
            filters,
            setFilters,
            isEnableFilter,
            className: headerClassName,
          }}
        />
        <tbody>
          {renderInfoBefore ? (
            <>
              <tr>
                <td colSpan={_filteredColumns?.length}>{renderInfoBefore()}</td>
              </tr>
            </>
          ) : null}
          {data?.map((a, i) => {
            const key = `table_${keyFieldPrefix}_${a[keyField] || i}`;
            return (
              <TableRow
                {...{
                  trParams,
                  keyFieldPrefix,
                  keyField,
                  _filteredColumns,
                  multiChecked,
                  setMultiChecked,
                }}
                data={a}
                key={key}
              />
            );
          })}
          {renderInfoAfter ? (
            <>
              <tr>
                <td colSpan={_filteredColumns?.length}>{renderInfoAfter()}</td>
              </tr>
            </>
          ) : null}
        </tbody>
      </TableWrapper>
    </>
  );
};

const TableRow = React.memo(
  ({
    keyFieldPrefix,
    keyField,
    trParams,
    _filteredColumns,
    data,
    multiChecked,
    setMultiChecked,
  }) => {
    const _trParams = trParams ? trParams(data) : {};
    return (
      <tr {..._trParams}>
        {typeof setMultiChecked === "function" && (
          <td>
            <label style={{cursor: 'pointer', padding: '8px'}}>
              <input
                type="checkbox"
                checked={multiChecked?.[data[keyField]] || false}
                onChange={(e) =>
                  setMultiChecked((prev) => ({
                    ...prev,
                    [data[keyField]]: e.target.checked,
                  }))
                }
                className={cn(styles.multiCheck)}
              />
            </label>
          </td>
        )}
        {_filteredColumns?.map((b) => {
          const { fieldCode, render, onCell, onWrapper, className } = b;
          let cell = onCell ? onCell(data) : null;
          let wrapper = onWrapper ? onWrapper(data) : null;

          if (typeof render === "function") {
            return (
              <React.Fragment
                key={`${keyFieldPrefix}_${data[keyField]}_${fieldCode}`}
              >
                <td {...cell}>
                  <div {...wrapper}>{render("", data, b)}</div>
                </td>
              </React.Fragment>
            );
          }
          if (Component) {
            return (
              <React.Fragment
                key={`${keyFieldPrefix}_${data[keyField]}_${fieldCode}`}
              >
                <td {...cell}>
                  <div {...wrapper}>
                    <Component {...{ record: data, ...b }} />
                  </div>
                </td>
              </React.Fragment>
            );
          }

          return (
            <td
              className={cn(className)}
              key={`${keyFieldPrefix}_${data[keyField]}_${fieldCode}`}
              {...cell}
            >
              <div
                className={cn(styles.tableTdWrapper, wrapper?.className)}
                {...wrapper}
              >
                <LabelDisplay>{data[fieldCode]}</LabelDisplay>
              </div>
            </td>
          );
        })}
      </tr>
    );
  },
  (prev, nex) => {
    let multiCheckSame = true;
    if (prev.multiChecked) {
      const prev_multiCheck = prev.multiChecked[prev.data[prev.keyField]];
      const nex_multiCheck = nex.multiChecked[nex.data[nex.keyField]];
      multiCheckSame = prev_multiCheck === nex_multiCheck;
    }

    return (
      prev.keyFieldPrefix === nex.keyFieldPrefix &&
      prev.keyField === nex.keyField &&
      prev.trParams === nex.trParams &&
      prev._filteredColumns === nex._filteredColumns &&
      prev.data === nex.data &&
      multiCheckSame
    );
  },
);

export const TableWrapper = ({
  children,
  isLockFirstColumn = true,
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "w-full",
        styles.root,
        isLockFirstColumn && styles.isLockFirstColumn,
        className,
      )}
      {...rest}
    >
      <table
        className={cn(styles.orderTable, "table-sm table-hover mb-0 table")}
      >
        {children}
      </table>
    </div>
  );
};

export const TableHeader = ({
  columns,
  isEnableFilter = true,
  sort,
  setSort,
  multiChecked,
  setMultiChecked,
  dataCount,
  onSelectAll,
  filters,
  setFilters,
  className,
}) => {
  const _filteredColumns = useMemo(() => columns.filter(Boolean), [columns]);
  const handleSortChange = (k) => {
    let newSortObj = null;
    // only 1 sorting field currently
    // JSON.parse(JSON.stringify(sortObj || {}))
    const { sortBy, dir } = sort || {};
    const sortObj = {
      [sortBy]: dir,
    };

    switch (sortObj[k]) {
      case "asc":
        newSortObj = null;
        break;
      case "desc":
        newSortObj = {
          sortBy: k,
          dir: "asc",
        };
        break;
      default:
        newSortObj = {
          sortBy: k,
          dir: "desc",
        };
        break;
    }

    setSort(newSortObj);
  };

  const handleFilterChange = (v, k) => {
    setFilters((prev) => {
      const _v = {
        ...prev,
        [k]: { value: v },
      };
      if (!v) {
        delete _v[k];
      }
      return _v;
    });
  };

  return (
    <thead className={cn(styles.thead, className)}>
      <tr>
        {typeof setMultiChecked === "function" && (
          <th style={{ width: 30 }}>
            <MultiCheckForAll
              {...{ multiChecked, setMultiChecked, onSelectAll, dataCount }}
            />
          </th>
        )}

        {_filteredColumns?.map((a, i) => {
          const { title, fieldCode, width, initKey, isNotTitle, isNotSortable } = a;
          const sortKey = initKey || fieldCode;
          return (
            <th key={`${sortKey}_${i}`} style={{ width: width || "auto" }}>
              {!isNotTitle ? (
                <div
                  className={cn(
                    styles.tableTitle,
                    !!setSort && !isNotSortable && styles.sortableTitle,
                  )}
                >
                  <span className={cn(styles.sortTitle)}>{title}</span>
                  {!isNotSortable && setSort ? (
                    <OrderByIcon
                      orderBy={sort}
                      col={sortKey}
                      onClick={() => handleSortChange(sortKey)}
                      title={`sort this column`}
                    />
                  ) : null}
                </div>
              ) : (
                <div className={cn(styles.tableTitle)}>
                  <br />
                </div>
              )}
            </th>
          );
        })}
      </tr>
      {setFilters ? (
        <tr>
          {typeof setMultiChecked === "function" && (
            <td>
              <div className={cn(styles.tableTitle)}>
                <span className={cn(styles.sortTitle)}>
                  <br />
                </span>
              </div>
            </td>
          )}
          {_filteredColumns?.map((a) => {
            const {
              fieldCode,
              initKey,
              isNotTitle,
              isNotFilter,
              renderFilter,
              filterPlaceHolder = "--",
            } = a;

            if (renderFilter && typeof renderFilter !== undefined) {
              return (
                <td key={`filter_${fieldCode}`}>
                  <div style={{ padding: 2 }}>{renderFilter(a)}</div>
                </td>
              );
            }

            return (
              <td key={`filter_${fieldCode}`}>
                <div style={{ padding: 2 }}>
                  {!isNotTitle && !isNotFilter ? (
                    <Editable.EF_InputDebounce
                      value={filters?.[initKey || fieldCode]?.value}
                      onChange={(v) => handleFilterChange(v, initKey || fieldCode)}
                      style={{ width: "100%" }}
                      placeholder={filterPlaceHolder}
                      disabled={!isEnableFilter}
                    />
                  ) : (
                    <br />
                  )}
                </div>
              </td>
            );
          })}
        </tr>
      ) : null}
    </thead>
  );
};

const MultiCheckForAll = ({
  multiChecked,
  setMultiChecked,
  onSelectAll,
  dataCount,
}) => {
  const allCheckRef = useRef(null);
  const selectedCount = _.values(multiChecked)?.filter(Boolean)?.length;

  const isAllSelected = selectedCount === dataCount;
  const isIndeterminate = !isAllSelected && selectedCount > 0;

  useEffect(() => {
    if (allCheckRef.current) {
      allCheckRef.current.indeterminate = isIndeterminate;
    }
  }, [isIndeterminate]);

  const handleAllMultiChange = (e) => {
    if (!isAllSelected) {
      onSelectAll();
    } else {
      setMultiChecked({});
    }
  };

  return (
    <label className={cn(styles.tableTitle)} style={{cursor: 'pointer'}}>
      <span className={cn(styles.sortTitle)}>
        <input
          type="checkbox"
          onChange={handleAllMultiChange}
          checked={isAllSelected}
          ref={allCheckRef}
        />
      </span>
    </label>
  );
};

export default React.memo(Com);
