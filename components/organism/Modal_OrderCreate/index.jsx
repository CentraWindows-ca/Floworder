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
import { GeneralContext } from "lib/provider/GeneralProvider";

const Com = (props) => {
  const { show, onHide, onCreate } = props;

  const [workOrderNo, setWorkOrderNo] = useState("");
  const [windowMakerData, setWindowMakerData] = useState(null);
  const [manufacturingFacility, setManufacturingFacility] = useState("");
  const [isReservation, setIsReservation] = useState(false);

  const handleCreate = (...params) => {
    handleClear();
    onCreate(...params);
  };

  const handleHide = () => {
    handleClear();
    onHide();
  };

  const handleClear = () => {
    setWorkOrderNo("");
    setWindowMakerData(null);
    setManufacturingFacility("");
    setIsReservation(false);
  };

  return (
    <Modal
      show={show}
      title={"Create work order from Windowmaker"}
      size="md"
      onHide={handleHide}
    >
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
            onCreate: handleCreate,
            isReservation,
            setIsReservation,
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
  const { toast } = useContext(GeneralContext);

  const doRead = useLoadingBar(async () => {
    const resLangley = await External_FromApi.getWindowMakerWorkerOrder(
      workOrderNo,
      'Langley',
    );

    const resCalgary = await External_FromApi.getWindowMakerWorkerOrder(
      workOrderNo,
      'Calgary',
    );


    if (resLangley || resCalgary) {
      setManufacturingFacility(manufacturingFacility);
      setWindowMakerData(res);
    } else {
      toast(<>Could not find order <b className="px-2">{workOrderNo}</b> from {manufacturingFacility}</>, {
        type: "error",
      });
    }
  });

  return (
    <>
      <div className="form-group row">
        <label className="col-lg-4">Work Order Number</label>
        <div className="col-lg-8">
          <Editable.EF_Input
            k="workOrderNo"
            value={workOrderNo}
            onChange={(v) => setWorkOrderNo(v)}
          />
        </div>
      </div>
      <hr />
      <div className="justify-content-center mt-2 flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => doRead()}
          disabled={!workOrderNo}
        >
          Fetch From Calgary
        </button>
      </div>
    </>
  );
};

const Screen2 = ({
  manufacturingFacility,
  setManufacturingFacility,
  workOrderNo,
  windowMakerData,
  setWindowMakerData,
  onCreate,
  isReservation,
  setIsReservation,
}) => {
  const [initValues, setInitValues] = useState({});

  const isWindow = !!(
    windowMakerData?.wmWindows || windowMakerData?.wmPatioDoors
  );
  const isDoor = !!windowMakerData?.wmDoors;

  const disabled =
    (isWindow && !initValues?.WinStartDate) ||
    (isDoor && !initValues?.DoorStartDate);

  const doFetch = async () => {
    const updateValues = {
      ...initValues,
    };

    if (isReservation) {
      updateValues.Status = "Draft Reservation";
    } else {
      updateValues.Status = "Draft";
    }

    // fetch from WM
    if (manufacturingFacility === "Calgary") {
      await OrdersApi.sync_AB_WindowMakerByWorkOrderAsync({
        workOrderNo,
        ...updateValues,
      });
    } else {
      await OrdersApi.sync_BC_WindowMakerByWorkOrderAsync({
        workOrderNo,
        ...updateValues,
      });
    }

    // update init values

    setInitValues({});
    onCreate(workOrderNo);
  };

  return (
    <div className="flex-column flex gap-2">
      {isWindow && (
        <div className="form-group row">
          <label className="col-lg-6">Window Production Date</label>
          <div className="col-lg-6 justify-content-center flex">
            <Editable.EF_Date
              id="WinStartDate"
              value={initValues?.WinStartDate}
              onChange={(v) =>
                setInitValues((prev) => ({
                  ...prev,
                  WinStartDate: v,
                }))
              }
            />
          </div>
        </div>
      )}
      {isDoor && (
        <div className="form-group row">
          <label className="col-lg-6">Door Production Date</label>
          <div className="col-lg-6 justify-content-center flex">
            <Editable.EF_Date
              id="DoorStartDate "
              value={initValues?.DoorStartDate}
              onChange={(v) =>
                setInitValues((prev) => ({
                  ...prev,
                  DoorStartDate: v,
                }))
              }
            />
          </div>
        </div>
      )}
      <div className="form-group row">
        <label className="col-lg-6">Reservation</label>
        <div className="col-lg-6 justify-content-center flex">
          <Editable.EF_Checkbox
            id="reservation"
            value={isReservation}
            onChange={(v) => setIsReservation((prev) => v)}
          />
        </div>
      </div>

      <hr />
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Work Order Number</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.workOrderNumber}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Status</label>
        <div className="col-lg-6 border-b border-gray-200 font-bold">
          {isReservation? "Draft Reservation": "Draft"}
        </div>
      </div>     
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Customer Number</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.customerNo || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Customer Name</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.name || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Telephone</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.telephone || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Email</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.email || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Address</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.address || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">City</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.city || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Zip Code</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.zipcode || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Work Type</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.workType || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Branch</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.branchName || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Number of Windows</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.wmWindows || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Number of Patio Doors</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.wmPatioDoors || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Number of Doors</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.wmDoors || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-6 font-bold">Job Type</label>
        <div className="col-lg-6 border-b border-gray-200">
          {windowMakerData?.jobType || "--"}
        </div>
      </div>
      <hr />
      <div className="justify-content-center flex gap-2">
        <button
          className="btn btn-primary"
          onClick={doFetch}
          disabled={disabled}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Com;
