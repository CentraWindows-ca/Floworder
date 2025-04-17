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
    masterId,
    modalType,
    sort,
    status,
    isDeleted = "0",
  } = router?.query || {};

  const [treatedData, setTreatedData] = useState({});
  const [isShowCreate, setIsShowCreate] = useState(false);

  const [editingOrderMasterId, setEditingOrderMasterId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);

  const [historyOrderMasterId, setHistoryOrderMasterId] = useState(null);

  const [uiIsShowWindow, setUiIsShowWindow] = useState(true);
  const [uiIsShowDoor, setUiIsShowDoor] = useState(true);

  useEffect(() => {
    switch (modalType) {
      case "edit":
        setEditingOrderMasterId(masterId);
        setIsEditable(true);
        break;
      case "editPending":
        setEditingOrderMasterId(masterId);
        setIsEditable(true);
        break;
      case "view":
        setEditingOrderMasterId(masterId);
        setIsEditable(false);
        break;
      case "history":
        setHistoryOrderMasterId(masterId);
        break;
      default:
        setEditingOrderMasterId(null);
        setHistoryOrderMasterId(null);
        setIsEditable(false);
        break;
    }
  }, [masterId, modalType]);

  useEffect(() => {
    if (data) {
      setTreatedData(runTreatment(data));
    }
  }, [data]);

  const runTreatment = (data) => {
    return data;
  };

  const handleEdit = (masterId, modalType = "edit", activeOnly = false) => {
    const pathname = router?.asPath?.split("?")?.[0];

    const query = {
      ...router.query,
      masterId,
      modalType,
    };

    if (!masterId) {
      delete query.masterId;
      delete query.modalType;
    }

    if (activeOnly) {
      // only when create. we dont stay with deleted
      delete query.isDeleted;
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

  const handleHistory = (masterId) => {
    const pathname = router?.asPath?.split("?")?.[0];

    const query = {
      ...router.query,
      masterId,
      modalType: "history",
    };
    if (!masterId) {
      delete query.masterId;
      delete query.modalType;
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
    let newSort = undefined;
    if (newSortObj) {
      newSort = `${newSortObj?.sortBy}:${newSortObj?.dir}`;
    }
    const newQuery = { ...router.query, sort: newSort, p: undefined };
    _.keys(newQuery)?.map((k) => {
      if (!newQuery[k]) delete newQuery[k];
    });

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

  const handleCreateDone = async (masterId) => {
    // jump to the masterId and not deleted
    handleEdit(masterId, "edit", true);
    mutate(null);
    // endPoint
  };

  const handleSaveDone = async () => {
    mutate(null);
    // endPoint
  };

  const handleRestoreDone = async () => {
    mutate(null);

    const pathname = router?.asPath?.split("?")?.[0];

    const query = {
      ...router.query,
    };

    delete query.isDeleted;

    router.replace(
      {
        pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  const [sortBy, dir] = sort?.split(":") || [];
  const statusDisplay =
    ORDER_STATUS?.find((a) => status?.trim() === a.key?.trim()) || null;

  const jsxStatus = (
    <label className="align-items-center me-3 flex">
      <div className="align-items-center flex gap-2">
        <div
          style={{
            border: "1px solid #A0A0A0",
            height: 15,
            width: 15,
            backgroundColor: statusDisplay?.color,
          }}
        />
        <div className="align-items-center flex gap-1 font-bold">
          {statusDisplay?.label}
        </div>
      </div>
    </label>
  );

  const jsxTrash = (
    <label className="align-items-center me-3 flex">
      <div
        style={{
          height: 15,
          width: 15,
          fontSize: "13px",
          color: "#B0B0B0",
        }}
        className="align-items-center me-1 flex"
      >
        <i className="fa-solid fa-trash-can" />
      </div>
      <div
        className="align-items-center flex gap-1 font-bold"
        // style={{ color: "#999" }}
      >
        {"Trash Bin"}
      </div>
    </label>
  );

  // ====== consts
  return (
    <div className={cn("w-full", styles.root)}>
      <div className={cn(styles.topBar)} style={{ paddingLeft: "25px" }}>
        <div className="align-items-center justify-content-between flex gap-2">
          {isDeleted == 1 ? jsxTrash : statusDisplay && jsxStatus}

          <PermissionBlock
            featureCode={constants.FEATURE_CODES["om.prod.wo"]}
            op="canAdd"
          >
            <button
              className="btn btn-success me-2 px-2"
              onClick={handleCreate}
            >
              <i className="fa-solid fa-circle-plus me-2"></i>
              Create
            </button>
          </PermissionBlock>

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
          onEdit={(woMasterId) => handleEdit(woMasterId, "edit")}
          onEditPending={(woMasterId) => handleEdit(woMasterId, "editPending")}
          onView={(woMasterId) => handleEdit(woMasterId, "view")}
          onHistory={(woMasterId) => handleHistory(woMasterId)}
          onUpdate={handleSaveDone}
          isLoading={!data}
          status={status}
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
            isDeleted: isDeleted == 1,
          }}
        />
      </div>

      <Modal_OrderEdit
        onHide={() => handleEdit()}
        onSave={handleSaveDone}
        onRestore={handleRestoreDone}
        initMasterId={editingOrderMasterId}
        isDeleted={isDeleted == 1}
        kind={tab}
        facility={facility}
        initIsEditable={isEditable}
      />
      <Modal_OrderCreate
        show={isShowCreate}
        onCreate={handleCreateDone}
        onHide={() => setIsShowCreate(false)}
      />
      <Modal_OrderHistory
        initMasterId={historyOrderMasterId}
        onHide={() => handleHistory()}
      />
    </div>
  );
};

export default Com;
