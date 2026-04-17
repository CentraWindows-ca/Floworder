import React, { useState, useEffect } from "react";
import cn from "classnames";
import _ from "lodash";
import Modal from "components/molecule/Modal";
import External_FromApi from "lib/api/External_FromApi";

// styles
import Editable, { EF_Checkbox } from "components/molecule/Editable";
import Typeahead from "components/atom/Typeahead";

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
  projectFormId,
  setProjectFormId,
}) => {
  const [showLockoutLookup, setShowLockoutLookup] = useState(false);
  const [showServiceLookup, setShowServiceLookup] = useState(false);

  const [isEnableLockout, setIsEnableLockout] = useState(false);
  const [isEnableService, setIsEnableService] = useState(false);
  const [isEnableMfso, setIsEnableMfso] = useState(false);

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    doInit();
  }, []);

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

  const handleEnableMFSO39 = (v) => {
    setIsEnableMfso(v);
    if (!v) {
      setIsEnableMfso(null);
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

  const handleProjectSelect = (v) => {
    setProjectFormId(v);
  };

  const doInit = async () => {
    const data = await External_FromApi.getMFSOPart3andPart9();
    const options = data
      ?.map((a) => ({
        label: `${a?.community} (${a?.customerName})`,
        key: a?.formId,
      }))
      ?.sort((a, b) => (a.label > b.label ? 1 : -1));
    setProjects(options);
  };

  return (
    <>
      <div className="p-4">
        <div className="alert alert-light mb-0 font-bold" role="alert">
          <div>
            <div className="d-flex align-items-center gap-1" style={{ height: 30 }}>
              <span>
                <EF_Checkbox
                  id={"enableLockout"}
                  value={isEnableLockout}
                  onChange={handleEnableLockout}
                />
                <label htmlFor="enableLockout" className="px-2">
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
              <div className="d-flex align-items-center gap-1" style={{ height: 30 }}>
                <span>
                  <EF_Checkbox
                    id={"enableService"}
                    value={isEnableService}
                    onChange={handleEnableService}
                  />
                  <label htmlFor="enableService" className="px-2">
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

            <div
              className="d-flex align-items-center gap-1"
              style={{ height: 30 }}
            >
              <span>
                <EF_Checkbox
                  id={"enableMfso"}
                  value={isEnableMfso}
                  onChange={handleEnableMFSO39}
                />
                <label htmlFor="enableMfso" className="px-2">
                  This is a MFSO part3/part9
                </label>
              </span>

              {isEnableMfso && (
                <>
                  <Typeahead
                    id={"projectSelect"}
                    labelKey="label"
                    valueKey="key"
                    size="sm"
                    value={projectFormId}
                    onChange={(v) => handleProjectSelect(v)}
                    options={projects}
                    style={{ flex: "1" }}
                  />
                </>
              )}
            </div>
          </div>
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
