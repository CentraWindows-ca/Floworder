import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import Modal from "components/molecule/Modal";
import utils from "lib/utils";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";
import { DisplayBlock } from "./Com";

const Com = ({ className, ...props }) => {
  const {
    data,
    onChange,
    newAttachments,
    setNewAttachments,
    isEditable,
    orderId,
    onHide,
  } = useContext(LocalDataContext);

  return (
    <>
      <div className={cn(styles.columnAttachmentsContainer)}>
        <div className="p-2">
          <table className="table-xs table-bordered table-hover mb-0 table border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <td>PO#</td>
              <td>Req. Date</td>
              <td>Prom. Date</td>
              <td>Exp. Date</td>
              <td>Rec. Date</td>
              <td>Status</td>
            </tr>
          </thead>
            <tbody>
              <tr>
                <td>joij</td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
};

export default Com;
