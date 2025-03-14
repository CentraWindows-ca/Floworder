import React, { useContext, useState, useEffect } from "react";
import _ from "lodash";
import Modal from "components/molecule/Modal";

import Editable from "components/molecule/Editable";
const Com = ({ missingFields, onSubmit, onCancel, isPaused, data }) => {
  const [values, setValues] = useState({});

  // transferredDate: true,
  // transferredLocation: true,
  // notes: true,

  useEffect(() => {
    if (isPaused && data) {
      const _values = {};
      const mapping = {
        transferredLocation: data['m_TransferredLocation'],
        transferredDate: data['m_TransferredDate']|| new Date().toISOString(),
        shippedDate: data['m_ShippedDate'] || new Date().toISOString()
      }

      // get init values
      _.keys(missingFields)?.map((k) => {
        _values[k] = mapping[k] || null
      });

      setValues(_values)
    }
  }, [isPaused, data]);

  const handleSave = () => {
    onSubmit(values);
  };

  const disabled = !_.keys(missingFields)?.every(
    (k) => values[k] || !missingFields[k]?.required,
  );
  return (
    <Modal
      size="md"
      show={isPaused}
      onHide={onCancel}
      layer={3}
      footer={
        <>
          <div className="justify-content-center mt-2 flex w-full">
            <button
              className="btn btn-primary align-items-center flex gap-2"
              onClick={handleSave}
              disabled={disabled}
            >
              <span>Save</span>
            </button>
          </div>
        </>
      }
    >
      <div className="flex-column flex gap-2">
        {missingFields?.transferredDate && (
          <div className="form-group row">
            <label className="col-lg-6">
              Transferred Date{missingFields?.transferredDate?.required && " *"}
            </label>
            <div className="col-lg-6">
              <Editable.EF_Date
                k="transferredDate"
                value={values?.transferredDate}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, ["transferredDate"]: v }))
                }
              />
            </div>
          </div>
        )}

        {missingFields?.shippedDate && (
          <div className="form-group row">
            <label className="col-lg-6">Shipped Date</label>
            <div className="col-lg-6">
              <Editable.EF_Date
                k="shippedDate"
                value={values?.shippedDate}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, ["shippedDate"]: v }))
                }
              />
            </div>
          </div>
        )}

        {missingFields?.transferredLocation && (
          <div className="form-group row">
            <label className="col-lg-6">
              Transferred Location
              {missingFields?.transferredLocation?.required && " *"}
            </label>
            <div className="col-lg-6">
              <Editable.EF_Input
                k="transferredLocation"
                value={values?.transferredLocation}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, ["transferredLocation"]: v }))
                }
              />
            </div>
          </div>
        )}

        {missingFields?.notes && (
          <div className="form-group row">
            <label className="col-lg-6">Notes</label>
            <div className="col-lg-6">
              <Editable.EF_Input
                k="notes"
                value={values?.notes}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, ["notes"]: v }))
                }
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default Com;
