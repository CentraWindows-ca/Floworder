import _ from "lodash";
import {
  uiWoFieldEditGroupMapping,
  labelMapping,
  parseFieldsByfieldCode,
  parseFieldInfoByField,
} from "lib/constants/production_constants_labelMapping";
import { getIfFieldDisplayAsProductType } from "../Com";

import { getVConfig } from "./vconfig";

// ===

const hook = ({ setValidationResult, checkEditable }) => {
  /**
   * data is current value;
   * initData to search extra conditions (if window, if door, ...)
   */
  const onValidate = ({
    initData,
    data,
    uiOrderType,
    kind,
    initWithOriginalStructure,
  }) => {
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
          initWithOriginalStructure,
        },
        data,
      );
      if (!isAvailabe) return;

      // ===== if field visually disabled, skip
      const isDisabled = !checkEditable({ fieldCode });

      if (isDisabled) return;

      // ===== if product type doesnt have this field. skip
      const _payload = {
        errorMessages,
        initData,
        data,
        fieldCode,
        initWithOriginalStructure,
      };
      if (checkingConfig[fieldCode]?.required) {
        c_required(_payload);
      }
    });

    setValidationResult(errorMessages);
    return errorMessages;
  };

  const c_required = ({
    errorMessages,
    initData,
    data,
    fieldCode,
    initWithOriginalStructure,
  }) => {
    const fieldLabel = labelMapping[fieldCode]?.title || fieldCode;
    // const field = fieldCode;

    const fields = parseFieldsByfieldCode(fieldCode, initWithOriginalStructure);

    fields?.forEach((field) => {
      const { facility, fieldObj } = parseFieldInfoByField(field) || {}
      const fieldLabelDisplay = [fieldLabel, facility]?.filter(Boolean)?.join("-")
      if (
        !data[field] ||
        // legacy key from FF
        data[field] === "Select One" ||
        data[field] === "selectOne"
      ) {
        errorMessages[field] = `[${fieldLabelDisplay}] Required`;
      }
    });
  };
  return {
    onValidate,
  };
};

export default hook;
