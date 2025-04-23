import _ from "lodash";
import {
  uiWoFieldEditGroupMapping,
  labelMapping,
} from "lib/constants/constants_labelMapping";
import { getIfFieldDisplayAsProductType } from "../Com";

const hook = ({ validationResult, setValidationResult, checkEditable }) => {
  /**
   * data is current value;
   * initData to search extra conditions (if window, if door, ...)
   */
  const onValidate = ({ initData, data, uiOrderType, kind }) => {
    // initData condition

    const errorMessages = {};

    _.keys(uiWoFieldEditGroupMapping)?.map((groupName) => {
      const _fieldsFromGroup = uiWoFieldEditGroupMapping[groupName];
      _.keys(_fieldsFromGroup)?.map((fieldName) => {

        // ===== if product type doesnt have this field. skip
        const isAvailabe = getIfFieldDisplayAsProductType(
          {
            id: fieldName,
            uiOrderType,
            kind,
          },
          data,
        );
        if (!isAvailabe) return

        // ===== group level checking (error message still on field)
        switch (groupName) {
          case "information":
            c_required({ errorMessages, initData, data, fieldName, groupName });
            break;
        }

        // ===== field level checking
        switch (fieldName) {
          case "":
            //

            break;

          default:
            break;
        }
      });
    });

    setValidationResult(errorMessages);

    return errorMessages;
  };

  const c_required = ({ errorMessages, initData, data, fieldName }) => {
    const fieldLabel = labelMapping[fieldName]?.title || fieldName;
    if (!data[fieldName]) {
      errorMessages[fieldName] = `[${fieldLabel}] Required`;
    }
  };

  return {
    onValidate,
  };
};

export default hook;
