import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

// components
import Pagination from "components/atom/Pagination";
import OrderList from "components/organism/OrderList";
import Editable from "components/molecule/Editable";
import PermissionBlock from "components/atom/PermissionBlock";

import Modal_OrderEdit from "components/organism/Modal_OrderEdit";
import Modal_OrderCreate from "components/organism/Modal_OrderCreate";
import Modal_OrderHistory from "components/organism/Modal_OrderHistory";

import { ORDER_STATUS } from "lib/constants";

// styles
import styles from "./styles.module.scss";

const Com = ({ data, }) => {
  const router = useRouter();
  const { q, facility, order } = router?.query || {};

  const [workOrderNo, setWorkOrderNo] = useState(q);
  const [treatedData, setTreatedData] = useState({});

  useEffect(() => {
    if (data) {
      setTreatedData(runTreatment(data));
    }
  }, [data]);

  const runTreatment = (data) => {
    return data;
  };

  const handleSearch = () => {
    const pathname = router?.asPath?.split("?")?.[0];
    const query = {
      ...router.query,
      q: workOrderNo
    };
    if (!workOrderNo) {
      delete query.q;
    }
    router.replace(
      {
        pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  const jsxTrash = (
    <label className="align-items-center me-3 flex">
      <div
        style={{
          height: 15,
          width: 15,
          fontSize: "13px",
          color: "#bd148a",
        }}
        className="align-items-center me-1 flex"
      >
        <i className="fa-solid fa-magnifying-glass" />
      </div>
      <div className="align-items-center flex gap-1 font-bold">
        {"Profile Lookup"}
      </div>
    </label>
  );

  // ====== consts
  return (
    <div className={cn("w-full", styles.root)}>
      <div className={cn(styles.topBar)} style={{ paddingLeft: "25px" }}>
        <div className="align-items-center justify-content-between flex gap-2">
          {jsxTrash}
        </div>
      </div>
      <div className={cn(styles.detail)}>
        <div className={cn(styles.searchPanelContainer)}>
          <div
            className={cn("align-items-center flex gap-4", styles.searchPanel)}
          >
            <label>Work Order Number</label>
            <div className="input-group" style={{ width: "400px" }}>
              <Editable.EF_Input
                value={workOrderNo}
                onChange={setWorkOrderNo}
                onPressEnter={handleSearch}
              />
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Com;
