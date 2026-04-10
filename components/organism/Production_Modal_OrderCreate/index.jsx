import React, { useState, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { List, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import LoadingBlock from "components/atom/LoadingBlock";
import OrdersApi from "lib/api/OrdersApi";
import WM2CWProdApi from "lib/api/WM2CWProdApi";
import Wrapper_OrdersApi from "lib/api/Wrapper_OrdersApi";
import External_FromApi from "lib/api/External_FromApi";

import { spreadFacilities } from "lib/constants/production_constants_labelMapping";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import Editable from "components/molecule/Editable";
import { GeneralContext } from "lib/provider/GeneralProvider";
import constants, { WORKORDER_STATUS_MAPPING } from "lib/constants";
import PermissionBlock from "components/atom/PermissionBlock";
import Sec_LockoutOrService from "./Sec_LockoutOrService";

import styles from "./styles.module.scss";
import utils from "lib/utils";

const DEFAULT_DOOR_FACILITY = "Calgary";

const FIELDS = [
  { fieldCode: "w_ProductionStartDate", title: "Window Production Date" },
  { fieldCode: "d_ProductionStartDate", title: "Door Production Date" },
];

const Com = (props) => {
  const { show, onHide, onCreate } = props;
  const [workOrderNo, setWorkOrderNo] = useState("");
  const [windowMakerData, setWindowMakerData] = useState(null);
  const [dbSource, setDbSource] = useState("");
  const [existingWorkOrder, setExistingWorkOrder] = useState(null);
  const [initWithOriginalStructure, setInitWithOriginalStructure] =
    useState(null);

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
    setDbSource("");
    setExistingWorkOrder(null);
    setInitWithOriginalStructure(null);
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
            dbSource,
            setDbSource,
            workOrderNo,
            setWorkOrderNo,
            windowMakerData,
            setWindowMakerData,
            existingWorkOrder,
            setExistingWorkOrder,
            initWithOriginalStructure,
            setInitWithOriginalStructure,
          }}
        />
      ) : (
        <Screen2
          {...{
            dbSource,
            setDbSource,
            workOrderNo,
            setWorkOrderNo,
            windowMakerData,
            setWindowMakerData,
            onCreate: handleCreate,
            existingWorkOrder,
            initWithOriginalStructure,
            setInitWithOriginalStructure,
          }}
        />
      )}
    </Modal>
  );
};

const WM_MAPPING = {
  WM_AB: "WM_AB",
  WM_BC: "WM_BC",
};

const FACILITY_MAPPING = {
  WM_AB: "Calgary",
  WM_BC: "Langley",
};

const Screen1 = ({
  setDbSource,
  workOrderNo,
  setWorkOrderNo,
  windowMakerData,
  setWindowMakerData,
  setExistingWorkOrder,
  initWithOriginalStructure,
  setInitWithOriginalStructure,
}) => {
  const { toast } = useContext(GeneralContext);
  const [resList, setResList] = useState();

  const doRead = useLoadingBar(async () => {
    // check if exists
    const existingRecord = await OrdersApi.getIsExistByWOAsync({ workOrderNo });
    let _resList;

    if (existingRecord && existingRecord.dbSource) {
      //
      // get exist work order
      let _wo = await Wrapper_OrdersApi.getWorkOrder(
        existingRecord.masterId,
        existingRecord.isActive,
      );
      _wo = _wo?.[0];
      const { value } = _wo;
      setInitWithOriginalStructure(value);
      _wo = _.assign({}, ..._.values(value));

      setExistingWorkOrder(_wo);
      setDbSource(existingRecord.dbSource);
      const res = await External_FromApi.getWindowMakerWorkerOrder(
        workOrderNo,
        existingRecord.dbSource,
      );
      if (res?.data) {
        setWindowMakerData(res?.data);
      } else {
        toast(
          <div>
            Failed to search existing work order <br />
            <b>
              [{existingRecord.dbSource}] {workOrderNo}
            </b>{" "}
            <br />
            from Windowmaker
          </div>,
          {
            type: "error",
          },
        );
      }
    } else {
      // NOTE: its possible exist in our db, but duplicate from WM
      _resList = [
        await External_FromApi.getWindowMakerWorkerOrder(workOrderNo, "WM_BC"),
        await External_FromApi.getWindowMakerWorkerOrder(workOrderNo, "WM_AB"),
      ]?.filter((a) => a?.data);

      if (_resList?.length === 1) {
        setWindowMakerData(_resList[0]?.data);
        setDbSource(WM_MAPPING[_resList[0]?.dbSource]);
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
    }

    setResList(_resList);
  });

  const handleSelect = (wm_record) => {
    setWindowMakerData(wm_record?.data);
    setDbSource(WM_MAPPING[wm_record?.dbSource]);
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
            onPressEnter={doRead}
            autoFocus
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
                <b>[{item?.dbSource}]</b> {item.data?.name} |{" "}
                {item.data?.branchName}
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
  dbSource,
  workOrderNo,
  windowMakerData,
  setWindowMakerData,
  onCreate,
  existingWorkOrder,
  initWithOriginalStructure,
}) => {
  const [initValues, setInitValues] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const [selectedOverrideOption, setSelectedOverrideOption] =
    useState("override");

  const [viewExistingByFacilities, setViewExistingByFacilities] = useState([]);

  const [doorManufacturingFacility, setDoorManufacturingFacility] = useState(
    constants.ManufacturingFacilities.Calgary,
  );
  const [windowManufacturingFacility, setWindowManufacturingFacility] =
    useState(constants.ManufacturingFacilities.Langley);

  const [isLockoutOrService, setIsLockoutOrService] = useState("No");
  const [lockoutOrder, setLockoutOrder] = useState(null);
  const [serviceOrder, setServiceOrder] = useState(null);

  const isWindow = !!(
    windowMakerData?.wmWindows ||
    windowMakerData?.wmPatioDoors ||
    windowMakerData?.wmGlasss
  );
  const isDoor = !!windowMakerData?.wmDoors || !!windowMakerData?.wmDoorGlasss;

  useEffect(() => {
    if (existingWorkOrder) {
      // NOTE: if existing, read only
      const _filteredFields = spreadFacilities(
        FIELDS,
        initWithOriginalStructure,
      );

      setViewExistingByFacilities(_filteredFields || []);

      console.log("spread", _filteredFields, initWithOriginalStructure);
    } else {
      setInitValues({});
      setDoorManufacturingFacility(DEFAULT_DOOR_FACILITY);
      setWindowManufacturingFacility(FACILITY_MAPPING[dbSource]);
    }
  }, [existingWorkOrder, windowMakerData]);

  const disabled =
    (isWindow && !initValues?.winStartDate) ||
    (isDoor && !initValues?.doorStartDate) ||
    (isWindow && !windowManufacturingFacility) ||
    (isDoor && !doorManufacturingFacility) ||
    (!existingWorkOrder && !isLockoutOrService);

  const doFetch = async (newStatus = "", isReservationWorkOrder = false) => {
    setIsLoading(true);
    const updateValues = {
      ...initValues,
    };

    // if existing. dont touch status
    if (newStatus) {
      updateValues.status = newStatus;
    } else {
      updateValues.status =
        existingWorkOrder?.m_Status || WORKORDER_STATUS_MAPPING.Scheduled.key;
    }

    if (selectedOverrideOption === "ResetWorkOrder") {
      if (
        !confirm(
          "Are you sure you want to delete current work order and then refetch from WindowMaker?",
        )
      ) {
        return;
      }
    }

    // if toggle on lockout or service and has selected from lookup
    if (isLockoutOrService === "Yes") {
      if (serviceOrder) {
        // "can be split by comma". it only accept id, not the "serviceId"
        updateValues.serviceIds = serviceOrder?.id?.toString();
      }
      if (lockoutOrder) {
        // "can be split by comma"
        updateValues.siteLockoutIds = lockoutOrder?.siteLockoutId?.toString();
      }
    }

    let res = null;

    const _updatingBody = {
      workOrderNo,
      resetWorkOrder: selectedOverrideOption === "ResetWorkOrder",
      winManufacturingFacility: windowManufacturingFacility,
      doorManufacturingFacility: doorManufacturingFacility,
      isReservationWorkOrder,
      ...updateValues,
    };

    // fetch from WM
    if (dbSource === "WM_AB") {
      res = await WM2CWProdApi.sync_AB_WindowMakerByWorkOrderAsync(
        null,
        _updatingBody,
        existingWorkOrder,
      );
    } else {
      res = await WM2CWProdApi.sync_BC_WindowMakerByWorkOrderAsync(
        null,
        _updatingBody,
        existingWorkOrder,
      );
    }

    // update init values
    setInitValues({});
    setIsLoading(false);

    onCreate(res?.masterId);
  };

  const jsxEdit = (
    <>
      {isWindow && (
        <div className="form-group row">
          <label className="col-lg-4">Windows Production Date</label>
          <div className="col-lg-8 flex justify-start">
            <Editable.EF_DateOnly
              id="winStartDate"
              value={initValues?.winStartDate || null}
              onChange={(v) =>
                setInitValues((prev) => ({
                  ...prev,
                  winStartDate: v,
                }))
              }
            />
          </div>
        </div>
      )}
      {isDoor && (
        <div className="form-group row">
          <label className="col-lg-4">Doors Production Date</label>
          <div className="col-lg-8 flex justify-start">
            <Editable.EF_DateOnly
              id="doorStartDate "
              value={initValues?.doorStartDate || null}
              onChange={(v) =>
                setInitValues((prev) => ({
                  ...prev,
                  doorStartDate: v,
                }))
              }
            />
          </div>
        </div>
      )}
      {isWindow && (
        <div className="form-group row">
          <label className="col-lg-4">Window Manufacturing Facility</label>
          <div className="col-lg-8 flex justify-start">
            <Editable.EF_SelectWithLabel
              id="windowManufacturingFacility"
              value={windowManufacturingFacility}
              // placeholder = {"-"}
              onChange={(v) => setWindowManufacturingFacility((prev) => v)}
              options={_.keys(constants.ManufacturingFacilities)?.map((k) => ({
                label: k,
                value: k,
                key: k,
              }))}
              style={{ width: 140 }}
            />
          </div>
        </div>
      )}

      {isDoor && (
        <div className="form-group row">
          <label className="col-lg-4">Door Manufacturing Facility</label>
          <div className="col-lg-8 flex justify-start">
            <Editable.EF_SelectWithLabel
              id="doorManufacturingFacility"
              value={doorManufacturingFacility}
              // placeholder = {"-"}
              onChange={(v) => setDoorManufacturingFacility((prev) => v)}
              options={_.keys(constants.ManufacturingFacilities)?.map((k) => ({
                label: k,
                value: k,
                key: k,
              }))}
              style={{ width: 140 }}
            />
          </div>
        </div>
      )}
    </>
  );

  const jsxView = (
    <>
      {viewExistingByFacilities?.facilities?.map((fac) => {
        const { facility, facilityRoleType, fields } = fac;
        return (
          <React.Fragment key={`${facility}`}>
            <div className={cn(styles.columnFacility)}>
              <span>Manufacturing Facility: {facility}</span>
            </div>
            <div className={cn(styles.columnInputsContainer)}>
              {fields?.map((a) => {
                const { field, title } = a;
                return (
                  <div key={field} className="form-group row">
                    <label className="col-lg-4 font-bold">{title} ({facility})</label>
                    <div className="col-lg-8 border-gray-200">
                      {utils.formatDate(existingWorkOrder?.[field]) || "--"}
                    </div>
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        );
      })}
    </>
  );

  return (
    <div className="flex-column flex gap-2">
      {existingWorkOrder ? jsxView : jsxEdit}
      <div className={cn(styles.columnFacility)}>
        <span>Work Order Information</span>
      </div>
      <div className="form-group row">
        <label className="col-lg-4 font-bold">Work Order Number</label>
        <div className="col-lg-8 border-b border-gray-200">
          {windowMakerData?.workOrderNumber}
        </div>
      </div>
      {existingWorkOrder ? (
        <div className="form-group row">
          <label className="col-lg-4 font-bold">Status</label>
          <div className="col-lg-8 border-b border-gray-200 font-bold">
            {existingWorkOrder?.m_Status}
          </div>
        </div>
      ) : null}
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
          {/* NOTE: 
            in WindowMaker the workType is our job type. 
            the job type from WindowMaker is useless 
          */}
          {windowMakerData?.workType || "--"}
        </div>
      </div>
      {!existingWorkOrder && (
        <Sec_LockoutOrService
          {...{
            lockoutOrder,
            setLockoutOrder,
            serviceOrder,
            setServiceOrder,
            isLockoutOrService,
            setIsLockoutOrService,
            existingWorkOrder,
          }}
        />
      )}

      <hr />
      {existingWorkOrder ? (
        <div className="p-4">
          <div
            className="alert alert-danger align-items-center mb-0 flex"
            role="alert"
          >
            The order you are trying to create already exists.
          </div>
        </div>
      ) : null}
      {/* new order needs it */}

      <div className="justify-content-center flex gap-2">
        {!existingWorkOrder || selectedOverrideOption === "ResetWorkOrder" ? (
          <>
            <PermissionBlock
              featureCodeGroup={constants.FEATURE_CODES["om.prod.reservation"]}
              op="canAdd"
            >
              <button
                className="btn btn-outline-secondary align-items-center flex gap-2"
                onClick={() =>
                  doFetch(WORKORDER_STATUS_MAPPING.DraftReservation.key, true)
                }
                disabled={disabled || isLoading}
              >
                <Spin
                  size="small"
                  indicator={<LoadingOutlined />}
                  spinning={isLoading}
                  style={{ color: "blue" }}
                />
                <div
                  style={{
                    display: "inline-block",
                    height: "15px",
                    width: "15px",
                    background: WORKORDER_STATUS_MAPPING.DraftReservation.color,
                    border: "1px solid, white",
                  }}
                ></div>
                <span>Save Reservation</span>
              </button>
            </PermissionBlock>
            <button
              className="btn btn-outline-secondary align-items-center flex gap-2"
              onClick={() => doFetch(WORKORDER_STATUS_MAPPING.Draft.key)}
              disabled={disabled || isLoading}
            >
              <Spin
                size="small"
                indicator={<LoadingOutlined />}
                spinning={isLoading}
                style={{ color: "blue" }}
              />{" "}
              <div
                style={{
                  display: "inline-block",
                  height: "15px",
                  width: "15px",
                  background: WORKORDER_STATUS_MAPPING.Draft.color,
                  border: "1px solid, white",
                }}
              ></div>
              <span>Save Work Order</span>
            </button>
          </>
        ) : (
          <>
            {!existingWorkOrder && (
              <button
                className="btn btn-primary align-items-center flex gap-2"
                onClick={() => doFetch(null)}
                disabled={disabled || isLoading}
              >
                <Spin
                  size="small"
                  indicator={<LoadingOutlined />}
                  spinning={isLoading}
                  style={{ color: "white" }}
                />
                <span>Save</span>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Com;
