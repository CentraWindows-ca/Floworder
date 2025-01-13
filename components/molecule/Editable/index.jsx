import React, { useState, useEffect } from "react";
import _ from "lodash";
import cn from "classnames";

import Datepicker from "components/atom/Datepicker";
import TypeaheadMultiSelect from "components/molecule/TypeaheadMultiSelect";
// styles
import styles from "./styles.module.scss";

export const EF_Date = ({
  id,
  value,
  valueType = "date",
  onChange,
  onSelect,
  ...rest
}) => {
  const handleSelect = (d) => {
    const newDate = d; // || new Date()
    onChange(newDate);
  };

  return (
    <Datepicker
      id={id}
      onChange={onChange}
      onSelect={handleSelect}
      value={value}
      {...rest}
    />
  );
};

export const EF_Select = ({
  id,
  value,
  onChange,
  options,
  children,
  exclude = {},
  keySort,
  placeholder = "all",
  ...rest
}) => {
  const modifiedChildren = React.Children.map(children, (child) => {
    // Ensure that we are only modifying `<option>` elements
    if (React.isValidElement(child) && child.type === "option") {
      // Access the value and children (content) of the option
      const { value, children: optionContent } = child.props;
      // You can now use `value` and `optionContent` to apply conditional logic

      // For example, adding a special class if the value is '1'
      const additionalProps = {};
      if (value === "") {
        additionalProps.style = { color: "#333" };
      } else {
        additionalProps.style = { color: "#F0A000" };
      }

      // Clone the element with any additional or modified props
      return React.cloneElement(child, additionalProps);
    }
    return child;
  });

  return (
    <select
      id={id}
      className="form-select-sm form-select w-full"
      value={value || ""}
      onChange={(e) => {
        onChange(e.target.value, id);
      }}
      style={{ color: value ? "#F0A000" : "unset" }}
      {...rest}
    >
      {children ? (
        modifiedChildren
      ) : (
        <>
          <option value="" style={{ color: "#333" }}>
            {placeholder}
          </option>
          {_.keys(options)
            ?.sort(keySort ? keySort : (a, b) => (a > b ? 1 : -1))
            ?.map((a) => {
              const isExcluded = exclude[a];
              let label = a;
              if (typeof options[a] === "string") {
                label = options[a];
              }

              return (
                <option
                  key={a}
                  value={a}
                  style={{ color: isExcluded ? "" : "#F0A000" }}
                  disabled={isExcluded}
                >
                  {isExcluded ? "[excluded] " : ""}
                  {label}
                </option>
              );
            })}
        </>
      )}
    </select>
  );
};

export const EF_MultiSelect = ({
  id,
  value = null,
  onChange,
  options,
  placeholder,
  className = "mr-1",
  size = "md",
}) => {
  return (
    <TypeaheadMultiSelect
      className={cn("form-select", styles.multiSelect, className)}
      labelKey="label"
      valueKey="value"
      size={size}
      id={id}
      options={_.keys(options)
        ?.sort((a, b) => (a > b ? 1 : -1))
        ?.map((key) => ({
          label: key,
          value: key,
        }))}
      onChange={(v, o) => {
        !v ? onChange("", id) : onChange(o, id);
      }}
      value={value}
      placeholder={placeholder}
    />
  );
};

export const EF_Input = ({ onChange, ...props }) => {
  const handleChange = (e) => {
    onChange(e.target.value)
  };
  return (
    <input
      className="form-control form-control-sm"
      onChange={handleChange}
      {...props}
    />
  );
};

export const EF_Text = ({ onChange, ...props }) => {
  const handleChange = (e) => {
    onChange(e.target.value)
  };
  return (
    <textarea
      className="form-control form-control-sm"
      onChange={handleChange}
      {...props}
    />
  );
};

export const EF_Checkbox = ({ onChange, value, ...props }) => {
  const handleChange = (e) => {
    onChange(e.target.checked);
  };
  return (
    <input
      className="form-check-input"
      type="checkbox"
      checked={value}
      onChange={handleChange}
      {...props}
    />
  );
};

export const Editable = {
  EF_Date,
  EF_Select,
  EF_MultiSelect,
  EF_Input,
  EF_Text,
  EF_Checkbox,
};

export default Editable;
