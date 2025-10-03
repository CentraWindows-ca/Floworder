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
        tmp_rejectReason: data["tmp_rejectReason"],
        tmp_rejectNotes: data["tmp_rejectNotes"],
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

        {missingFields?.tmp_rejectReason && (
          <div className="form-group row">
            <label className="col-lg-3">
              Reject Reason
              {missingFields?.tmp_rejectReason?.required && " *"}
            </label>
            <div className="col-lg-9">
              <Editable.EF_SelectWithLabel
                k="tmp_rejectReason"
                value={values?.tmp_rejectReason || ""}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, ["tmp_rejectReason"]: v }))
                }
                placeholder={"Reject Reason"}
                options={constants.InvoiceSelectOptions.rejectReasonList}
              />
            </div>
          </div>
        )}

        {missingFields?.tmp_rejectNotes && (
          <div className="form-group row">
            <label className="col-lg-3">Notes</label>
            <div className="col-lg-9">
              <Editable.EF_Text
                k="tmp_rejectNotes"
                value={values?.tmp_rejectNotes}
                onChange={(v) =>
                  setValues((prev) => ({ ...prev, ["tmp_rejectNotes"]: v }))
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
