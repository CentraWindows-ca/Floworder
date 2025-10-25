import React, { useContext, useState, useEffect } from "react";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import constants from "lib/constants";

import Editable from "components/molecule/Editable";
const Com = ({ missingFields, onSubmit, onCancel, isPaused, data }) => {
  const [values, setValues] = useState({});
  useEffect(() => {
    if (isPaused && data) {
      const _values = {};
      const mapping = {
        rejectReason: data["rejectReason"],
        rejectNotes: data["rejectNotes"],
      };

      // get init values
      _.keys(missingFields)?.map((k) => {
        _values[k] = mapping[k] || null;
      });

      setValues(_values);
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

        {missingFields?.rejectReason && (
          <div className="form-group row">
            <label className="col-lg-3">
              Reject Reason
              {missingFields?.rejectReason?.required && " *"}
            </label>
            <div className="col-lg-9">
              <Editable.EF_SelectWithLabel
                k="rejectReason"
                value={values?.rejectReason || ""}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, ["rejectReason"]: v }))
                }
                placeholder={"Reject Reason"}
                options={constants.InvoiceSelectOptions.rejectReasonList}
              />
            </div>
          </div>
        )}

        {missingFields?.rejectNotes && (
          <div className="form-group row">
            <label className="col-lg-3">Notes</label>
            <div className="col-lg-9">
              <Editable.EF_Text
                k="rejectNotes"
                value={values?.rejectNotes}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, ["rejectNotes"]: v }))
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
