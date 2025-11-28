import React, { useState } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";

// styles
import Editable, { EF_Checkbox } from "components/molecule/Editable";

import Lookup_Lockout from "./Lookup_Lockout";
import Lookup_Service from "./Lookup_Service";

// styles
import styles from "./styles.module.scss";
import constants from "lib/constants";

export default ({
  lockoutOrder,
  setLockoutOrder,
  serviceOrder,
  setServiceOrder,
  isLockoutOrService,
  setIsLockoutOrService,
}) => {
  const [showLockoutLookup, setShowLockoutLookup] = useState(false);
  const [showServiceLookup, setShowServiceLookup] = useState(false);

  const [isEnableLockout, setIsEnableLockout] = useState(false);
  const [isEnableService, setIsEnableService] = useState(false);

  const handleEnableLockout = (v) => {
    setIsEnableLockout(v);
    if (!v) {
      setLockoutOrder(null);
    }
  };

  const handleEnableService = (v) => {
    setIsEnableService(v);
    if (!v) {
      setServiceOrder(null);
    }
  };

  const handleLockoutSelect = (v) => {
    setShowLockoutLookup(false);
    setLockoutOrder(v);
  };

  const handleServiceSelect = (v) => {
    setShowServiceLookup(false);
    setServiceOrder(v);
  };

  return (
    <>
      <div className="p-4">
        <div className="alert alert-light mb-0 font-bold" role="alert">
          <div className="justify-content-center align-items-center flex">
            Is this work order linked to a{" "}
            {!constants.DEV_HOLDING_FEATURES.v20251030_createWithService &&
              "Service"}{" "}
            or Lockout ?
            <div className="ms-2">
              <Editable.EF_SelectWithLabel
                id={"lockoutOrService"}
                value={isLockoutOrService}
                onChange={(v) => setIsLockoutOrService(v)}
                options={[
                  { label: "-", key: "" },
                  { label: "Yes", key: "Yes" },
                  { label: "No", key: "No" },
                ]}
              />
            </div>
          </div>

          {isLockoutOrService === "Yes" && (
            <div
              style={{ borderTop: "1px solid #E0E0E0" }}
              className="my-2 pt-4"
            >
              <div className="d-flex align-items-center gap-1 py-2">
                <span>
                  <EF_Checkbox
                    id={"enableLockout"}
                    value={isEnableLockout}
                    onChange={handleEnableLockout}
                  />
                  <label htmlFor="enableLockout" className="ps-2">
                    This is a Lockout order.
                  </label>
                </span>

                {isEnableLockout && (
                  <>
                    <span
                      className={cn(
                        styles.link,
                        lockoutOrder ? "" : styles.noValue,
                      )}
                      onClick={() => setShowLockoutLookup(true)}
                    >
                      {lockoutOrder ? (
                        <>[Lockout Order: {lockoutOrder?.displayName}]</>
                      ) : (
                        "[Select...]"
                      )}
                    </span>
                    {lockoutOrder ? (
                      <i
                        className={cn(
                          "fa-solid fa-circle-xmark",
                          styles.icon_close,
                        )}
                        onClick={() => setLockoutOrder(null)}
                      ></i>
                    ) : null}
                  </>
                )}
              </div>
              {!constants.DEV_HOLDING_FEATURES.v20251030_createWithService && (
                <div className="d-flex align-items-center gap-1 py-2">
                  <span>
                    <EF_Checkbox
                      id={"enableService"}
                      value={isEnableService}
                      onChange={handleEnableService}
                    />
                    <label htmlFor="enableService" className="ps-2">
                      This is a Service order.
                    </label>
                  </span>

                  {isEnableService && (
                    <>
                      <span
                        className={cn(
                          styles.link,
                          serviceOrder ? "" : styles.noValue,
                        )}
                        onClick={() => setShowServiceLookup(true)}
                      >
                        {serviceOrder
                          ? `[Service Order: ${serviceOrder?.serviceId}]`
                          : "[Select...]"}
                      </span>
                      {serviceOrder ? (
                        <i
                          className={cn(
                            "fa-solid fa-circle-xmark",
                            styles.icon_close,
                          )}
                          onClick={() => setServiceOrder(null)}
                        ></i>
                      ) : null}
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Modal
        show={showLockoutLookup}
        size="lg"
        onHide={() => setShowLockoutLookup(false)}
        layer={2}
        title={"Lockout Lookup"}
      >
        <Lookup_Lockout onSelect={handleLockoutSelect} />
      </Modal>

      <Modal
        show={showServiceLookup}
        size="lg"
        onHide={() => setShowServiceLookup(false)}
        layer={2}
        title={"Service Lookup"}
      >
        <Lookup_Service onSelect={handleServiceSelect} />
      </Modal>
    </>
  );
};
