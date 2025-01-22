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
import Modal_OrderCreate from "components/organism/Modal_OrderCreate";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";
import useDataInit, { triggerMutate } from "lib/hooks/useDataInit";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const router = useRouter();
  const { status, q, p = 1, facility, tab = 'm' } = router?.query || {};

  const [treatedData, setTreatedData] = useState({});
  const [isShowCreate, setIsShowCreate] = useState(false);


  const filtersObj = {};
  if (q) {
    filtersObj["m_WorkOrderNo"] = {
      operator: constants.FILTER_OPERATOR.Contains,
      value: q,
    };
  }

  if (facility) {
    filtersObj[tab + "_ManufacturingFacility"] = {
      operator: constants.FILTER_OPERATOR.Equals,
      value: facility,
    }; 
  }

  if (status) {
    filtersObj[tab + "_Status"] = {
      operator: constants.FILTER_OPERATOR.Equals,
      value: status,
    };  
  }

  const endPoint = OrdersApi.initQueryWorkOrderHeaderWithPrefixAsync({
    page: p,
    pageSize: 50,
    filters: _.keys(filtersObj)?.map((k) => {
      return {
        ...filtersObj[k],
        field: k,
      };
    }),
    kind: tab,
    isDescending: true
  });

  // use swr later
  const { data, error } = useDataInit(endPoint);

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
    setIsShowCreate(true);
  };

  const handleCreateDone = async (m_WorkOrderNo) => {
    setEditingOrder({
      m_WorkOrderNo,
    });

    triggerMutate(endPoint);
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
      <button
        onClick={() => {
          setEditingOrder({ m_WorkOrderNo: "VKTEST22" });
        }}
      >
        test
      </button>
      <Modal_OrderEdit
        onHide={() => setEditingOrder(null)}
        initWorkOrder={editingOrder}
        kind={tab}
        facility={facility}
      />
      <Modal_OrderCreate
        show={isShowCreate}
        onCreate={handleCreateDone}
        onHide={() => setIsShowCreate(false)}
      />
    </div>
  );
};

export default Com;
