import _ from "lodash";
import {
  uiWoFieldEditGroupMapping,
  labelMapping,
} from "lib/constants/constants_labelMapping";
import { getIfFieldDisplayAsProductType } from "../Com";

import { getVConfig } from "./vconfig";

// ===

const hook = ({ setValidationResult, checkEditable }) => {
  /**
   * data is current value;
   * initData to search extra conditions (if window, if door, ...)
   */
  const onValidate = ({ initData, data, uiOrderType, kind }) => {
    // initData condition

    const errorMessages = {};
    let checkingConfig = getVConfig(initData);

    _.keys(checkingConfig).map((fieldName) => {
      // ===== if product type doesnt have this field. skip
      const isAvailabe = getIfFieldDisplayAsProductType(
        {
          id: fieldName,
          uiOrderType,
          kind,
        },
        data,
      );
      if (!isAvailabe) return;

      // ===== if product type doesnt have this field. skip
      const _payload = {
        errorMessages,
        initData,
        data,
        fieldName,
      };
      if (checkingConfig[fieldName]?.required) {
        c_required(_payload);
      }
    });

    setValidationResult(errorMessages);
    return errorMessages;
  };

  const c_required = ({ errorMessages, initData, data, fieldName }) => {
    const fieldLabel = labelMapping[fieldName]?.title || fieldName;
    if (
      !data[fieldName] ||
      // legacy key from FF
      data[fieldName] === "Select One" ||
      data[fieldName] === "selectOne"
    ) {
      errorMessages[fieldName] = `[${fieldLabel}] Required`;
    }
  };
  return {
    onValidate,
  };
};

export default hook;
