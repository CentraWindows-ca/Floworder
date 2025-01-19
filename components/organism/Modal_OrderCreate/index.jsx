import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import LoadingBlock from "components/atom/LoadingBlock";
import OrdersApi from "lib/api/OrdersApi";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import Editable from "components/molecule/Editable";

const Com = (props) => {
  const { show, onHide, onCreate } = props;

  const [workOrderNo, setWorkOrderNo] = useState("");

  const doFetchFromWindowMakerAB = useLoadingBar(async () => {
    const res = await OrdersApi.sync_AB_WindowMakerByWorkOrderAsync({
      workOrderNo,
    });

    onCreate(workOrderNo);
  });

  const doFetchFromWindowMakerBC = useLoadingBar(async () => {
    const res = await OrdersApi.sync_BC_WindowMakerByWorkOrderAsync({
      workOrderNo,
    });

    onCreate(workOrderNo);
  });

  return (
    <Modal
      show={show}
      title={'Fetch Work Order'}
      size="sm"
      onHide={onHide}
    >
      <div className="input-group input-group-sm">
        <Editable.EF_Input
          k="workOrderNo"
          value={workOrderNo}
          onChange={(v) => setWorkOrderNo(v)}
        />
      </div>
      <div className="flex justify-content-center gap-2 mt-2">
        <button
          className="btn btn-sm btn-primary"
          onClick={doFetchFromWindowMakerAB}
        >
          Fetch From AB
        </button>

        <button
          className="btn btn-sm btn-primary"
          onClick={doFetchFromWindowMakerBC}
        >
          Fetch From BC
        </button>
      </div>
    </Modal>
  );
};

export default Com;
