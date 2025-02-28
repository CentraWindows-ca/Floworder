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
    className,
    headerClassName,
  } = props;

  return (
    <>
      <div className={cn("w-full", styles.root, className)}>
        <table
          className={cn(styles.orderTable, "table-sm table-hover mb-0 table")}
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
          <tbody>
            {data?.map((a) => {
              return (
                <tr key={a[keyField]}>
                  {columns?.map((b) => {
                    const { key, render, onCell, className } = b;

                    let cell = onCell ? onCell(a) : null;

                    if (typeof render === "function") {
                      return (
                        <React.Fragment key={key}>
                          <td {...cell}>
                            <div>{render("", a, b)}</div>
                          </td>
                        </React.Fragment>
                      );
                    }
                    return (
                      <td className={cn(className)} key={key} {...cell}>
                        <div className={cn(styles.tableTdWrapper)}>
                          <LabelDisplay>{a[key]}</LabelDisplay>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
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
        [k]: v,
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
        {columns?.map((a) => {
          const { title, key, width, initKey, isNotTitle } = a;
          const sortKey = initKey || key;
          return (
            <th key={key} style={{ width: width || "auto" }}>
              {!isNotTitle ? (
                <div className={cn(styles.tableTitle, !!setSort && styles.sortableTitle)}>
                  <span className={cn(styles.sortTitle)}>{title}</span>
                  {setSort ? (
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
            const { key, initKey, isNotTitle, filterPlaceHolder = "--" } = a;
            return (
              <td key={`filter_${a.key}`}>
                <div style={{ padding: 2 }}>
                  {!isNotTitle ? (
                    <Editable.EF_InputDebounce
                      value={filters?.[initKey || key]}
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
