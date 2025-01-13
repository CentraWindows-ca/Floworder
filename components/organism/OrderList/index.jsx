import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import LoadingBlock from "components/atom/LoadingBlock";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const { onEdit, data } = props;
  const router = useRouter();
  const { state } = router?.query || {};

  // use swr later

  return (
    <div className={cn("w-full", styles.root)}>
      <LoadingBlock isLoading={!data}>
        <table
          className={cn(styles.orderTable, "table-sm table-bordered table-hover table border text-xs")}
          style={{ minWidth: 1500 }}
        >
          <thead className="sticky top-0 bg-gray-100">
            <tr>
              <th>Work Order</th>
              <th>Branch</th>
              <th>Job Type</th>
              <th>Shipping Type</th>
              <th>Batch No</th>
              <th>Block No</th>
              <th>Current status</th>
              <th>Windows</th>
              <th>Patio Doors</th>
              <th>Doors</th>
              <th>INV Status</th>
              <th>Created On</th>
              <th>Created By</th>
              <th>Customer Date</th>
              <th>Glass Ordered Date</th>
              <th>Link Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td onClick={() => onEdit({ id: 1 })}>
                <div className={cn(styles.orderNumber)}>123456</div>
              </td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>654321</td>
            </tr>
          </tbody>
        </table>
      </LoadingBlock>
    </div>
  );
};

export default Com;
