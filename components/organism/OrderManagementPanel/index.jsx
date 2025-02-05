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
import useDataInit from "lib/hooks/useDataInit";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const router = useRouter();
  const {
    status,
    q,
    p = 0,
    facility,
    tab = "m",
    order,
    isEdit,
  } = router?.query || {};

  const [treatedData, setTreatedData] = useState({});
  const [isShowCreate, setIsShowCreate] = useState(false);

  const [editingOrder, setEditingOrder] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const [uiIsShowWindow, setUiIsShowWindow] = useState(true);
  const [uiIsShowDoor, setUiIsShowDoor] = useState(true);

  useEffect(() => {
    if (order) {
      setEditingOrder(order);
      setIsEditable(isEdit);
    } else {
      setEditingOrder(null);
    }
  }, [order, isEdit]);

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
  const { data, error, mutate } = useDataInit(endPoint);

  useEffect(() => {
    if (data) {
      setTreatedData(runTreatment(data));
    }
  }, [data]);

  const runTreatment = (data) => {
    return data;
  };

  const handleEdit = (order, isEdit) => {
    // setEditingOrder(order);
    const pathname = router?.asPath?.split("?")?.[0];

    const query = { ...router.query, order, isEdit };
    if (!order) {
      delete query.order;
    }
    if (!isEdit) {
      delete query.isEdit;
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
    handleEdit(m_WorkOrderNo, true);
    mutate('*');
    // endPoint
  };

  const handleSaveDone = async () => {
    mutate('*');
    // endPoint
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
          {tab === "m" && (
            <>
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
            </>
          )}
        </div>
        <div>
          <Pagination count={treatedData?.total} basepath={"/"} />
          <button onClick={() =>handleSaveDone()}>test</button>
        </div>
      </div>
      <div className={cn(styles.detail)}>
        <OrderList
          kind={tab}
          onEdit={(wo) => handleEdit(wo, 1)}
          onView={(wo) => handleEdit(wo)}
          onUpdate={handleSaveDone}
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
        initIsEditable={isEditable}
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
