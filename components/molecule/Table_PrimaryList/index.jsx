import React from "react";
import cn from "classnames";
import _ from "lodash";

import { Spin } from "antd";

import TableSortable from "components/atom/TableSortable";
import FiltersManager from "components/atom/TableSortable/FilterManager";

// styles
import styles from "./styles.module.scss";

const Com = ({ error, isLoading, onEnableFilter, ...props }) => {
  return (
    <div className={cn(styles.tableContainer, (error || isLoading) && styles.tableContainerLoading)}>
      {error ? (
        <div className={cn(styles.tableError)}>
          <div>Network Error</div>
        </div>
      ) : isLoading ? (
        <div className={cn(styles.tableLoading)}>
          <Spin spinning={true} size="large" />
        </div>
      ) : null}

      <TableSortable
        {...{
          ...props,
          headerClassName: styles.theadOfMainTable,
          className: styles.table,
        }}
      />
      <FiltersManager {...{ ...props, onEnableFilter }} />
    </div>
  );
};

export default Com;
