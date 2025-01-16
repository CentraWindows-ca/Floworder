import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

import OrdersApi from "lib/api/OrdersApi";

// components
import PageContainer from "components/atom/PageContainer";
import Pagination from "components/atom/Pagination";
import OrderList from "components/organism/OrderList";
import Modal from "components/molecule/Modal";

import Modal_OrderEdit from "components/organism/Modal_OrderEdit";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";
import useDataInit from "lib/hooks/useDataInit";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const router = useRouter();
  const { status, q, p, facility, tab } = router?.query || {};

  const [treatedData, setTreatedData] = useState({});

  const tabsCall = {
    MASTER: "initGetProdMasterAsync",
    WIN: "initGetProdWindowsAsync",
    DOOR: "initGetProdDoorsAsync",
  };

  // use swr later
  const { data, error } = useDataInit(
    OrdersApi[tabsCall[tab] || tabsCall["MASTER"]]({
      pageNumber: p || 1,
      pageSize: 30,
      searchText: q,
      branchId: facility,
    }),
  );

  useEffect(() => {
    if (data) {
      setTreatedData(runTreatment(data));
    }
  }, [data]);

  const runTreatment = (data) => {
    return data;
  };

  const [editingOrder, setEditingOrder] = useState(null);

  const handleEdit = (order) => {
    setEditingOrder(order);
  };

  const handleCreate = () => {
    setEditingOrder({});
  };

  // ====== consts
  return (
    <div className={cn("w-full", styles.root)}>
      <div className={cn(styles.topBar)}>
        <div>
          <button className="btn btn-success" onClick={handleCreate}>
            Create
          </button>
        </div>
        <div>
          <Pagination count={data?.totalCount} />
        </div>
      </div>
      <div className={cn(styles.detail)}>
        <OrderList kind={tab} onEdit={handleEdit} data={treatedData?.data} />
      </div>
      <Modal_OrderEdit
        onHide={() => setEditingOrder(null)}
        initWorkOrder={editingOrder}
        kind={tab}
        facility = {facility}
      />
    </div>
  );
};

export default Com;
