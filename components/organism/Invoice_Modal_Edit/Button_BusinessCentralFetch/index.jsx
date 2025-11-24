import React, { useContext, useState, useEffect } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import { LocalDataContext, LocalDataProvider } from "../LocalDataProvider";
import { Spin } from "antd";
import styles from "./styles.module.scss";
import utils from "lib/utils";

export default ({}) => {
  const { onFetchBusinessCentral } = useContext(LocalDataContext);

  const [show, setShow] = useState(false);

  const onHide = () => {
    setShow(false);
  };

  return (
    <>
      <button
        className="btn btn-xs btn-outline-primary"
        onClick={() => setShow(true)}
      >
        <i className="fa-solid fa-cloud-arrow-down me-2"></i>
        Business Central Lookup
      </button>
      <Modal
        title={"Business Central Lookup"}
        size="md"
        show={show}
        onHide={onHide}
        layer={1}
      >
        <Modal_BusinessCentralLookup
          {...{
            show,
            setShow,
          }}
        />
      </Modal>
    </>
  );
};

const Modal_BusinessCentralLookup = ({ show, setShow }) => {
  const { onFetchBusinessCentral, onChange } = useContext(LocalDataContext);
  const [bCData, setBCData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!show) {
      setBCData(null);
      setIsLoading(false);
    }
  }, [show]);

  const handleSearch = async (province) => {
    setIsLoading(true);
    setBCData(null);
    const _bcData = await onFetchBusinessCentral(province);

    let inv_invoiceAmount = _bcData?.total;

    if (typeof inv_invoiceAmount === 'string') {
      inv_invoiceAmount = utils.formatCurrencyStringToNumber(inv_invoiceAmount);
    }

    if (_bcData) {
      setBCData({
        invh_bcInvoiceNo: _bcData?.invoiceNo,
        inv_invoiceAmount,
        display_inv_invoiceAmount: inv_invoiceAmount ? utils.formatCurrency2Decimal(inv_invoiceAmount, "$") : undefined
      });
    }
    setIsLoading(false);
  };

  const handleApply = () => {
    const { invh_bcInvoiceNo, inv_invoiceAmount } = bCData || {};

    onChange(invh_bcInvoiceNo, "invh_bcInvoiceNo");
    onChange(inv_invoiceAmount, "inv_invoiceAmount");

    setShow(false);
  };

  return (
    <div>
      <div className="">
        <div className="justify-content-center flex gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              handleSearch("BC");
            }}
          >
            <i className="fa-solid fa-magnifying-glass me-2"></i>
            Search BC Branch
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => {
              handleSearch("BC");
            }}
          >
            <i className="fa-solid fa-magnifying-glass me-2"></i>
            Search AB Branch
          </button>
        </div>
      </div>
      <div className={cn(styles.tableContainer)}>
        {isLoading ? (
          <div className={cn(styles.tableLoading)}>
            <Spin spinning={true} size="large" />
          </div>
        ) : (
          <>
            {bCData ? (
              <div>
                <div className={cn(styles.tableResult, "mt-2")}>
                  <div>Invoice Amount</div>
                  <div className={cn(styles.tableValue, "fw-bold text-right")}>
                    {bCData?.display_inv_invoiceAmount ?? (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
                  <div>Business Central Invoice#</div>
                  <div className={cn(styles.tableValue, "fw-bold text-right")}>
                    {bCData?.invh_bcInvoiceNo ?? (
                      <span className="text-gray-400">N/A</span>
                    )}
                  </div>
                </div>
                <div className="justify-content-center flex p-2 mt-2">
                  <button
                    className="btn btn-outline-primary"
                    onClick={handleApply}
                  >
                    Apply
                  </button>
                </div>
              </div>
            ) : (
              <div className={cn(styles.tableLoading)}>-- No Data --</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
