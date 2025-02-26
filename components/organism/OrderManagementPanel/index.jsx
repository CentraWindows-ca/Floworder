import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";


// components
import Pagination from "components/atom/Pagination";
import OrderList from "components/organism/OrderList";
import Editable from "components/molecule/Editable";

import Modal_OrderEdit from "components/organism/Modal_OrderEdit";
import Modal_OrderCreate from "components/organism/Modal_OrderCreate";

// styles
import styles from "./styles.module.scss";

const Com = ({
  data,
  mutate,
  filters,
  setFilters,
  applyFilter,
  setApplyFilter,
}) => {
  const router = useRouter();
  const {
    facility,
    tab = "m",
    order,
    isEdit,
    sort,
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


  const handleSortChange = (newSortObj) => {
    const pathname = router?.asPath?.split("?")?.[0];
    // const newSortObj = {};
    // only 1 sorting field currently
    // JSON.parse(JSON.stringify(sortObj || {}))

    // assemble to like--- "w_Id:desc,m_WorkOrderNo:asc"
    let newSort = undefined
    if (newSortObj) {
      newSort = `${newSortObj?.sortBy}:${newSortObj?.dir}`;
    } 
    const newQuery = { ...router.query, sort: newSort, p: undefined }
    _.keys(newQuery)?.map(k => {
      if (!newQuery[k]) delete newQuery[k]
    })

    router.replace(
      {
        pathname,
        query: newQuery,
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
    mutate(null);
    // endPoint
  };

  const handleSaveDone = async () => {
    mutate(null);
    // endPoint
  };

  const [sortBy, dir] = sort?.split(":") || [];

  // ====== consts
  return (
    <div className={cn("w-full", styles.root)}>
      <div className={cn(styles.topBar)}>
        <div className="align-items-center flex gap-2">
          <button
            className="btn btn-success me-2 px-2"
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
        </div>
      </div>
      <div className={cn(styles.detail)}>
        <OrderList
          kind={tab}
          onEdit={(wo) => handleEdit(wo, 1)}
          onView={(wo) => handleEdit(wo)}
          onUpdate={handleSaveDone}
          isLoading={!data}
          count={treatedData?.total}
          {...{
            uiIsShowWindow,
            uiIsShowDoor,
            data: treatedData?.data,
            applyFilter,
            filters,
            setFilters,
            sort: {
              sortBy,
              dir,
            }, 
            onApplyFilter: (v) => setApplyFilter(v),
            setSort: handleSortChange,
          }}
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
