import React, { useState, useContext } from "react";
import { useRouter } from "next/router";
import { List, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
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
  const [existingStatus, setExistingStatus] = useState(false);

  const handleCreate = (...params) => {
    handleClear();
    onCreate(...params);
    handleHide();
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
      size="lg"
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
            existingStatus,
            setExistingStatus,
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
            existingStatus,
            setExistingStatus,
          }}
        />
      )}
    </Modal>
  );
};

const FACILITY = {
  WM_AB: "Calgary",
  WM_BC: "Langley",
};

const Screen1 = ({
  setManufacturingFacility,
  workOrderNo,
  setWorkOrderNo,
  windowMakerData,
  setWindowMakerData,
  setExistingStatus,
}) => {
  const { toast } = useContext(GeneralContext);

  const [resList, setResList] = useState();

  const doRead = useLoadingBar(async () => {
    const _resList = [
      await External_FromApi.getWindowMakerWorkerOrder(workOrderNo, "WM_BC"),
      await External_FromApi.getWindowMakerWorkerOrder(workOrderNo, "WM_AB"),
    ]?.filter((a) => a?.data);

    setResList(_resList);

    if (_resList?.length === 1) {
      setWindowMakerData(_resList[0]?.data);
      setManufacturingFacility(FACILITY[_resList[0]?.dbSource]);

      // check if exists
      setExistingStatus(true);
    } else if (_resList?.length > 1) {
    } else {
      toast(
        <>
          Could not find order <b className="px-2">{workOrderNo}</b>
        </>,
        {
          type: "error",
        },
      );
    }
  });

  const handleSelect = (wm_record) => {
    setWindowMakerData(wm_record);
    setManufacturingFacility(FACILITY[wm_record?.dataSource]);
  };

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
      {resList?.length > 1 && (
        <>
          <hr />
          <List
            size="small"
            // header={<>Select:</>}
            bordered
            dataSource={resList}
            renderItem={(item) => (
              <List.Item
                className="cursor-pointer hover:bg-blue-100"
                onClick={() => handleSelect(item)}
              >
                <b>[{item.dataSource}]</b> {item.name} | {item.city}
              </List.Item>
            )}
          />
        </>
      )}

      <hr />
      <div className="justify-content-center mt-2 flex gap-2">
        <button
          className="btn btn-primary"
          onClick={() => doRead()}
          disabled={!workOrderNo}
        >
          Fetch From Windowmaker
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
  existingStatus,
  setExistingStatus,
}) => {
  const [initValues, setInitValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedOverrideOption, setSelectedOverrideOption] =
    useState("override");

  const isWindow = !!(
    windowMakerData?.wmWindows || windowMakerData?.wmPatioDoors
  );
  const isDoor = !!windowMakerData?.wmDoors;

  const disabled =
    (isWindow && !initValues?.WinStartDate) ||
    (isDoor && !initValues?.DoorStartDate);

  const doFetch = async () => {
    setIsLoading(true);
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
        WorkOrderNo: workOrderNo,
        ...updateValues,
      });
    } else {
      await OrdersApi.sync_BC_WindowMakerByWorkOrderAsync({
        WorkOrderNo: workOrderNo,
        ...updateValues,
      });
    }

    // update init values

    setInitValues({});
    setIsLoading(false);
    onCreate(workOrderNo);
  };

  return (
    <div className="flex-column flex gap-2">
      {isWindow && (
        <div className="form-group row">
          <label className="col-lg-3">Window Production Date</label>
          <div className="col-lg-3 justify-content-center flex">
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
          <label className="col-lg-3">Door Production Date</label>
          <div className="col-lg-3 justify-content-center flex">
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
        <label className="col-lg-3">Reservation</label>
        <div className="col-lg-3 justify-content-center flex">
          <Editable.EF_Checkbox
            id="reservation"
            value={isReservation}
            onChange={(v) => setIsReservation((prev) => v)}
          />
        </div>
      </div>

      <hr />
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Work Order Number</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.workOrderNumber}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Status</label>
        <div className="col-lg-8 border-b border-gray-200 font-bold">
          {isReservation ? "Draft Reservation" : "Draft"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Customer Number</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.customerNo || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Customer Name</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.name || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Telephone</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.telephone || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Email</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.email || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Address</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.address || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">City</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.city || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Zip Code</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.zipcode || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Work Type</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.workType || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Branch</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.branchName || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Number of Windows</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.wmWindows || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Number of Patio Doors</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.wmPatioDoors || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Number of Doors</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.wmDoors || "--"}
        </div>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Job Type</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.jobType || "--"}
        </div>
      </div>
      <hr />
      {existingStatus ? (
        <div className="p-4">
          <div
            className="alert alert-danger align-items-center mb-0 flex"
            role="alert"
          >
            The order you are trying to create already exists. You can:
            <div className="ms-2" style={{ width: 240 }}>
              <Editable.EF_SelectWithLabel
                id={"exists"}
                value={selectedOverrideOption}
                onChange={(v) => setSelectedOverrideOption(v)}
                options={[
                  { label: "Update it", key: "override" },
                  { label: "Delete it and create a new one", key: "recreate" },
                ]}
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="justify-content-center flex gap-2">
        <button
          className="btn btn-primary align-items-center flex gap-2"
          onClick={doFetch}
          disabled={disabled}
        >
          <Spin
            size="small"
            indicator={<LoadingOutlined />}
            spinning={isLoading}
            style={{ color: "white" }}
          />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

export default Com;
