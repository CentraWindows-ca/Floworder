import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

// components
import Pagination from "components/atom/Pagination";
import PrimaryList_Invoice from "components/organism/PrimaryList_Invoice";
import Editable from "components/molecule/Editable";
import PermissionBlock from "components/atom/PermissionBlock";

import Modal_OrderEdit from "components/organism/Modal_OrderEdit";
import Modal_OrderHistory from "components/organism/Modal_OrderHistory";

import { INVOICE_STATUS_MAPPING } from "lib/constants";

// styles
import styles from "./styles.module.scss";

const Com = ({
  data,
  error,
  mutate,
  filters,
  setFilters,
  isEnableFilter,
  setIsEnableFilter,
}) => {
  const router = useRouter();
  const {
    facility,
    tab = "m",
    masterId,
    modalType,
    subModalType,
    sort,
    status,
    isDeleted = "0",
  } = router?.query || {};

  const [treatedData, setTreatedData] = useState({});

  const [editingOrderMasterId, setEditingOrderMasterId] = useState(null);
  const [isEditable, setIsEditable] = useState(false);
  const [historyOrderMasterId, setHistoryOrderMasterId] = useState(null);

  useEffect(() => {
    switch (modalType) {
      case "edit":
        setEditingOrderMasterId(masterId);
        setIsEditable(true);
        break;
      case "view":
        setEditingOrderMasterId(masterId);
        setIsEditable(false);
        break;
      default:
        setEditingOrderMasterId(null);
        setIsEditable(false);
        break;
    }

    switch (subModalType) {
      case "history":
        setHistoryOrderMasterId(masterId);
        break;
      default:
        setHistoryOrderMasterId(null);
        break;
    }
  }, [masterId, modalType, subModalType]);

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
      subModalType: "history",
    };
    if (!masterId) {
      delete query.masterId;
      delete query.subModalType;
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
  
  const handleRefresh = () => {
    mutate(null);
  };

  const [sortBy, dir] = sort?.split(":") || [];
  const statusDisplay =
    _.values(INVOICE_STATUS_MAPPING)?.find((a) => status?.trim() === a.key?.trim()) || null;

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
        </div>
        <div>
          <Pagination count={treatedData?.total} basepath={"/"} />
        </div>
      </div>
      <div className={cn(styles.detail)}>
        <PrimaryList_Invoice
          onEdit={(woMasterId) => handleEdit(woMasterId, "edit")}
          onView={(woMasterId) => handleEdit(woMasterId, "view")}
          onHistory={(woMasterId) => handleHistory(woMasterId)}
          onUpdate={handleSaveDone}
          isLoading={!data}
          error={error}
          status={status}
          count={treatedData?.total}
          {...{
            data: treatedData?.data,
            isEnableFilter,
            filters,
            setFilters,
            sort: {
              sortBy,
              dir,
            },
            onEnableFilter: (v) => setIsEnableFilter(v),
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
      <Modal_OrderHistory
        initMasterId={historyOrderMasterId}
        onHide={() => handleHistory()}
      />
    </div>
  );
};

export default Com;
