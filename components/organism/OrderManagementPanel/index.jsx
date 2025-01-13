import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

// components
import PageContainer from "components/atom/PageContainer";
import Pagination from "components/atom/Pagination";
import OrderList from "components/organism/OrderList";
import Modal from "components/molecule/Modal";

import Modal_OrderEdit from "components/organism/Modal_OrderEdit"

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const router = useRouter();
  const {state, q, p, tab} = router?.query || {};


  const data = {};
  const [editingOrderId, setEditingOrderId] = useState(null);

  const handleEdit = (order) => {
    setEditingOrderId(order.id);
  };

  const handleCreate = () => {
    setEditingOrderId(0);
  }

  // ====== consts
  return (
    <div className={cn("w-full", styles.root)}>
      <div className={cn(styles.topBar)}>
        <div>
          <button className="btn btn-success" onClick={handleCreate}>Create</button>
        </div>
        <div>
          <Pagination count={100} />
        </div>
      </div>
      <div className={cn(styles.detail)}>
        <OrderList onEdit={handleEdit} data={data} />
      </div>
      <Modal_OrderEdit onHide={() => setEditingOrderId(null)} orderId = {editingOrderId}/>
    </div>
  );
};


export default Com;
