import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import PermissionBlock from "components/atom/PermissionBlock";
import TableSortable from "components/atom/TableSortable";
import constants from "lib/constants";
import utils from "lib/utils";
import SubModal_ChangesOnly from "./SubModal_ChangesOnly";
import SubModal_All from "./SubModal_All";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext, LocalDataProvider } from "./LocalDataProvider";
import LoadingBlock from "components/atom/LoadingBlock";

const Com = ({}) => {
  const { isLoading, initWorkOrder, onHide, data } =
    useContext(LocalDataContext);

  const [idChanges, setIdChanges] = useState(null);
  const [idAll, setIdAll] = useState(null);

  const handleShowItemChanges = setIdChanges;
  const handleShowItemAll = setIdAll;

  const columns = [
    {
      title: "Operation",
      key: "Operation",
    },
    {
      title: "Submission time",
      key: "CreatedAt",
    },
    {
      title: "Submitted by",
      key: "ChangedBy",
    },
    {
      title: "",
      render: (t, record) => {
        return (
          <div className="flex gap-2">
            <button
              className="btn btn-sm btn-outline-primary"
              onClick={() => handleShowItemChanges(record)}
            >
              Detail
            </button>
          </div>
        );
      },
      width: 230,
      isNotTitle: true,
    },
  ];

  // use swr later

  const jsxTitle = (
    <div className="justify-content-between align-items-center flex-grow-1 flex">
      <div className="align-items-center flex gap-2">
        Work Order # {initWorkOrder}
        <div className="align-items-center flex gap-2"></div>
      </div>
      <div></div>
    </div>
  );

  return (
    <>
      <Modal
        show={initWorkOrder}
        title={jsxTitle}
        size="lg"
        onHide={onHide}
        bodyClassName={styles.modalBody}
        titleClassName={"flex justify-content-between flex-grow-1"}
      >
        <LoadingBlock isLoading={isLoading}>
          <div className="p-2">
            <TableSortable
              {...{
                data: data?.sort((a, b) =>
                  a.CreatedAt < b.CreatedAt ? 1 : -1,
                ),
                columns,
              }}
            />
          </div>
        </LoadingBlock>
      </Modal>
      <SubModal_ChangesOnly data={idChanges} onHide={() => setIdChanges(0)} />
    </>
  );
};

export default (props) => {
  return (
    <LocalDataProvider {...props}>
      <Com />
    </LocalDataProvider>
  );
};
