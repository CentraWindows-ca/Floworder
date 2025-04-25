import React, { useState, useEffect, useContext, useMemo } from "react";
import Editable from "components/molecule/Editable";
import cn from "classnames";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";

import OrderByIcon from "components/atom/OrderByIcon";

import LoadingBlock from "components/atom/LoadingBlock";
import LabelDisplay from "components/atom/LabelDisplay";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const {
    data,
    filters,
    setFilters,
    applyFilter = true,
    columns,
    sort,
    setSort,
    keyField = "m_MasterId",
    keyFieldPrefix = "",
    className,
    headerClassName,
    isLockFirstColumn = true,
    trParams = () => {},
    ...rest
  } = props;

  return (
    <>
      <TableWrapper
        {...{
          isLockFirstColumn,
          className,
          ...rest
        }}
      >
        <TableHeader
          {...{
            columns,
            sort,
            setSort,
            filters,
            setFilters,
            applyFilter,
            className: headerClassName,
          }}
        />
        <tbody>{data?.map((a, i) => {
            const _trParams = trParams(a);
            
            return (
              <tr key={`table_${keyFieldPrefix}_${a[keyField]}_${i}`} {..._trParams}>
                {columns?.map((b) => {
                  const { key, render, onCell, onWrapper, className } = b;
                  let cell = onCell ? onCell(a) : null;
                  let wrapper = onWrapper ? onWrapper(a) : null;

                  if (typeof render === "function") {
                    return (
                      <React.Fragment key={`${keyFieldPrefix}_${a[keyField]}_${key}`}>
                        <td {...cell}>
                          <div {...wrapper}>{render("", a, b)}</div>
                        </td>
                      </React.Fragment>
                    );
                  }
                  return (
                    <td className={cn(className)} key={`${keyFieldPrefix}_${a[keyField]}_${key}`} {...cell}>
                      <div
                        className={cn(
                          styles.tableTdWrapper,
                          wrapper?.className,
                        )}
                        {...wrapper}
                      >
                        <LabelDisplay>{a[key]}</LabelDisplay>
                      </div>
                    </td>
                  );
                })}
              </tr>
            );
          })}</tbody>
      </TableWrapper>
    </>
  );
};

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
  applyFilter = true,
  sort,
  setSort,
  filters,
  setFilters,
  className,
}) => {
  const handleSortChange = (k) => {
    const newSortObj = null;
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
        [k]: {value: v},
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
        {columns?.map((a, i) => {
          const { title, key, width, initKey, isNotTitle, isNotSortable } = a;
          const sortKey = initKey || key;
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
                  {(!isNotSortable && setSort) ? (
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
          {columns?.map((a) => {
            const { key, initKey, isNotTitle, isNotFilter, filterPlaceHolder = "--" } = a;
            return (
              <td key={`filter_${a.key}`}>
                <div style={{ padding: 2 }}>
                  {(!isNotTitle && !isNotFilter) ? (
                    <Editable.EF_InputDebounce
                      value={filters?.[initKey || key]?.value}
                      onChange={(v) => handleFilterChange(v, initKey || key)}
                      style={{ width: "100%" }}
                      placeholder={filterPlaceHolder}
                      disabled={!applyFilter}
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

export default React.memo(Com);
