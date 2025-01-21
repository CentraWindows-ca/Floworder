import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import LoadingBlock from "components/atom/LoadingBlock";
import OrdersApi from "lib/api/OrdersApi";
import External_FromApi from "lib/api/External_FromApi";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import Editable from "components/molecule/Editable";

const Com = (props) => {
  const { show, onHide, onCreate } = props;

  const [workOrderNo, setWorkOrderNo] = useState("");
  const [windowMakerData, setWindowMakerData] = useState(null);
  const [manufacturingFacility, setManufacturingFacility] = useState("");

  return (
    <Modal show={show} title={"Fetch Work Order"} size="sm" onHide={onHide}>
      {!windowMakerData ? (
        <Screen1
          {...{
            manufacturingFacility,
            setManufacturingFacility,
            workOrderNo,
            setWorkOrderNo,
            windowMakerData,
            setWindowMakerData,
          }}
        />
      ) : (
        <Screen2
          {...{
            manufacturingFacility,
            setManufacturingFacility,
            workOrderNo,
            setWorkOrderNo,
            windowMakerData,
            setWindowMakerData,
            onCreate,
          }}
        />
      )}
    </Modal>
  );
};

const Screen1 = ({
  setManufacturingFacility,
  workOrderNo,
  setWorkOrderNo,
  windowMakerData,
  setWindowMakerData,
}) => {
  const doRead = useLoadingBar(async (manufacturingFacility) => {
    const res = await External_FromApi.getWindowMakerWorkerOrder(
      workOrderNo,
      manufacturingFacility,
    );

    setManufacturingFacility(manufacturingFacility);
    setWindowMakerData(res);
  });

  return (
    <>
      <div className="input-group input-group-sm">
        <Editable.EF_Input
          k="workOrderNo"
          value={workOrderNo}
          onChange={(v) => setWorkOrderNo(v)}
        />
      </div>
      <div className="justify-content-center mt-2 flex gap-2">
        <button
          className="btn btn-sm btn-primary"
          onClick={() => doRead("Calgary")}
        >
          Fetch From AB
        </button>

        <button
          className="btn btn-sm btn-primary"
          onClick={() => doRead("Langley")}
        >
          Fetch From BC
        </button>
      </div>
    </>
  );
};

const Screen2 = ({
  manufacturingFacility,
  setManufacturingFacility,
  workOrderNo,
  setWorkOrderNo,
  windowMakerData,
  setWindowMakerData,
  onCreate,
}) => {
  const [initValues, setInitValues] = useState({});

  const doFetch = async () => {

    alert('todo')

    return 

    // fetch from WM
    if (manufacturingFacility === "Calgary") {
      await OrdersApi.sync_AB_WindowMakerByWorkOrderAsync({
        workOrderNo,
      });
    } else {
      await OrdersApi.sync_BC_WindowMakerByWorkOrderAsync({
        workOrderNo,
      });
    }

    // update init values


    setInitValues({})
    onCreate(workOrderNo);
  };

  const isWindow = !!(
    windowMakerData?.wmWindows || windowMakerData?.wmPatioDoors
  );
  const isDoor = !!windowMakerData?.wmDoors;

  const disabled =
    (isWindow && !initValues?.w_ProductionStartDate) ||
    (isDoor && !initValues?.d_ProductionStartDate);

  return (
    <>
      {isWindow && (
        <div className="grid">
          <div>Window Production Date</div>
          <div className="input-group input-group-sm">
            <Editable.EF_Date
              k="w_ProductionStartDate"
              value={initValues?.w_ProductionStartDate}
              onChange={(v) =>
                setInitValues((prev) => ({
                  ...prev,
                  w_ProductionStartDate: v,
                }))
              }
            />
          </div>
        </div>
      )}
      {isDoor && (
        <div className="grid">
          <div>Door Production Date</div>
          <div className="input-group input-group-sm">
            <Editable.EF_Date
              k="d_ProductionStartDate"
              value={initValues?.d_ProductionStartDate}
              onChange={(v) =>
                setInitValues((prev) => ({
                  ...prev,
                  d_ProductionStartDate: v,
                }))
              }
            />
          </div>
        </div>
      )}

      <div className="justify-content-center mt-2 flex gap-2">
        <button className="btn btn-sm btn-primary" onClick={doFetch}
        disabled={disabled}
        >
          Save
        </button>
      </div>
    </>
  );
};

export default Com;
