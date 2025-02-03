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
import Editable from "components/molecule/Editable";

import Modal_OrderEdit from "components/organism/Modal_OrderEdit";
import Modal_OrderCreate from "components/organism/Modal_OrderCreate";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";
import useDataInit, { triggerMutate } from "lib/hooks/useDataInit";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const router = useRouter();
  const { status, q, p = 0, facility, tab = "m", order } = router?.query || {};

  const [treatedData, setTreatedData] = useState({});
  const [isShowCreate, setIsShowCreate] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const [uiIsShowWindow, setUiIsShowWindow] = useState(false);
  const [uiIsShowDoor, setUiIsShowDoor] = useState(false);

  useEffect(() => {
    if (order) {
      setEditingOrder(order);
    } else {
      setEditingOrder(null);
    }
  }, [order]);

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
    page: (parseInt(p) || 0) + 1,
    pageSize: 50,
    filters: _.keys(filtersObj)?.map((k) => {
      return {
        ...filtersObj[k],
        field: k,
      };
    }),
    kind: tab,
    isDescending: true,
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

  const handleEdit = (order) => {
    // setEditingOrder(order);
    const pathname = router?.asPath?.split("?")?.[0];

    const query = { ...router.query, order };
    if (!order) {
      delete query.order;
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

  const handleCreate = () => {
    setIsShowCreate(true);
  };

  const handleCreateDone = async (m_WorkOrderNo) => {
    handleEdit(m_WorkOrderNo);

    triggerMutate(endPoint);
  };

  const handleSaveDone = async () => {
    triggerMutate(endPoint);
  };

  // ====== consts
  return (
    <div className={cn("w-full", styles.root)}>
      <div className={cn(styles.topBar)}>
        <div className="align-items-center flex gap-2">
          <button
            className="btn btn-sm btn-success me-2 px-2"
            onClick={handleCreate}
          >
            <i className="fa-solid fa-circle-plus me-2"></i>
            Create
          </button>
          <div className="align-items-center flex gap-2">
            <div>
              <Editable.EF_Checkbox
                id={"ui_window"}
                value={uiIsShowWindow}
                onChange={(v) => setUiIsShowWindow(v)}
              />
            </div>
            <label
              htmlFor={"ui_window"}
              className="align-items-center flex gap-1"
            >
              Window Info
            </label>
          </div>
          <div className="align-items-center flex gap-2">
            <div>
              <Editable.EF_Checkbox
                id={"ui_door"}
                value={uiIsShowDoor}
                onChange={(v) => setUiIsShowDoor(v)}
              />
            </div>
            <label
              htmlFor={"ui_door"}
              className="align-items-center flex gap-1"
            >
              Door Info
            </label>
          </div>
        </div>
        <div>
          <Pagination count={treatedData?.total} basepath={"/"} />
        </div>
      </div>
      <div className={cn(styles.detail)}>
        <OrderList
          kind={tab}
          onEdit={handleEdit}
          data={treatedData?.data}
          {...{ uiIsShowWindow, uiIsShowDoor }}
        />
      </div>
      <Modal_OrderEdit
        onHide={() => handleEdit()}
        onSave={handleSaveDone}
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
