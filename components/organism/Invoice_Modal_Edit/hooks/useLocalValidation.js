import _ from "lodash";
import {
  uiWoFieldEditGroupMapping,
  labelMapping,
} from "lib/constants/production_constants_labelMapping";
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

    _.keys(checkingConfig).map((fieldCode) => {
      // ===== if product type doesnt have this field. skip
      const isAvailabe = getIfFieldDisplayAsProductType(
        {
          fieldCode,
          uiOrderType,
          kind,
        },
        data,
      );
      if (!isAvailabe) return;

      // ===== if field visually disabled, skip
      const isDisabled = !checkEditable({fieldCode })

      if (isDisabled) return

      // ===== if product type doesnt have this field. skip
      const _payload = {
        errorMessages,
        initData,
        data,
        fieldCode,
      };
      if (checkingConfig[fieldCode]?.required) {
        c_required(_payload);
      }
    });

    setValidationResult(errorMessages);
    return errorMessages;
  };

  const c_required = ({ errorMessages, initData, data, fieldCode }) => {
    const fieldLabel = labelMapping[fieldCode]?.title || fieldCode;

    const field = fieldCode
    if (
      !data[field] ||
      // legacy key from FF
      data[field] === "Select One" ||
      data[field] === "selectOne"
    ) {
      errorMessages[field] = `[${fieldLabel}] Required`;
    }
  };
  return {
    onValidate,
  };
};

export default hook;
