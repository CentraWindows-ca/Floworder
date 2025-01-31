import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import cn from "classnames";

import Datepicker from "components/atom/Datepicker";
import TypeaheadMultiSelect from "components/molecule/TypeaheadMultiSelect";
import Typeahead from "components/atom/Typeahead";
import { GeneralContext } from "lib/provider/GeneralProvider";

// styles
import styles from "./styles.module.scss";

const preventUpdate = (prev, nex) => {
  return (
    prev.value === nex.value &&
    prev.disabled === nex.disabled &&
    prev.options === nex.options
  );
};

export const EF_Date = React.memo(
  ({ id, value, onChange, onSelect, ...rest }) => {
    const handleSelect = (d, str) => {
      const newDate = d; // || new Date()
      onChange(str);
    };

    return (
      <Datepicker
        id={id}
        onChange={onChange}
        onSelect={handleSelect}
        value={value || null}
        {...rest}
      />
    );
  },
  preventUpdate,
);

export const EF_SelectWithLabel = React.memo(
  ({
    id,
    value = "",
    onChange,
    options,
    children,
    exclude = {},
    keySort,
    placeholder,
    sortBy,
    // sortBy = "label",
    ...rest
  }) => {
    let renderOptions = options;
    if (sortBy)
      renderOptions = renderOptions?.sort(
        keySort ? keySort : (a, b) => (a[sortBy] > b[sortBy] ? 1 : -1),
      );

    return (
      <select
        id={id}
        className="form-select-sm form-select w-full"
        value={value || ""}
        onChange={(e) => {
          onChange(e.target.value, id);
        }}
        {...rest}
      >
        {placeholder ? (
          <option value="" style={{ color: "#333" }}>
            {placeholder}
          </option>
        ) : null}

        {renderOptions?.map((a, i) => {
          const isExcluded = exclude[a.key];
          let { key, value: displayValue, label } = a;

          return (
            <option key={`${key}_${i}`} value={key} disabled={isExcluded}>
              {label || displayValue}
            </option>
          );
        })}
      </select>
    );
  },
  preventUpdate,
);

export const EF_Select = React.memo(
  ({
    id,
    value,
    onChange,
    options,
    children,
    exclude = {},
    keySort,
    placeholder = "-",
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
  },
  preventUpdate,
);

export const EF_MultiSelect = React.memo(
  ({
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
  },
  preventUpdate,
);

export const EF_Input = React.memo(
  ({ onChange, value, className, ...props }) => {
    const handleChange = (e) => {
      onChange(e.target.value);
    };
    return (
      <input
        className={cn("form-control form-control-sm", className)}
        onChange={handleChange}
        value={value || ""}
        {...props}
      />
    );
  },
  preventUpdate,
);

export const EF_Text = React.memo(({ onChange, value, ...props }) => {
  const handleChange = (e) => {
    onChange(e.target.value);
  };
  return (
    <textarea
      className="form-control form-control-sm"
      onChange={handleChange}
      value={value || ""}
      {...props}
    />
  );
}, preventUpdate);

export const EF_Checkbox = React.memo(({ onChange, value, ...props }) => {
  const handleChange = (e) => {
    onChange(e.target.checked);
  };

  const checked = value === true || value === "true"; // can be true or "true"

  return (
    <input
      className="form-check-input cursor-pointer"
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      {...props}
    />
  );
}, preventUpdate);

export const EF_Checkbox_Yesno = React.memo(({ onChange, value, ...props }) => {
  const handleChange = (e) => {
    onChange(e.target.checked ? "Yes" : "No");
  };

  const checked = value === "Yes"; // can be true or "true"

  return (
    <input
      className="form-check-input cursor-pointer"
      type="checkbox"
      checked={checked}
      onChange={handleChange}
      {...props}
    />
  );
}, preventUpdate);

export const EF_Label = React.memo(({ value, id, ...props }) => {
  return <label>{value}</label>;
}, preventUpdate);

export const EF_Rack = React.memo(
  ({
    id,
    value = null,
    onChange,
    placeholder,
    className = "mr-1",
    size = "md",
  }) => {
    const { dictionary } = useContext(GeneralContext);

    return (
      <Typeahead
        // className={cn("form-select", className)}
        labelKey="label"
        valueKey="value"
        size={size}
        id={id}
        renderPrefix={(o) => {
          return (
            <div
              className="inline-block text-white text-xs bg-slate-400 px-2"
              style={{ minWidth: 100, borderRight: "1px solid", paddingRight: 10, marginRight: 10 }}
            >
              {o.SiteCity || '--'}
            </div>
          );
        }}
        renderSuffix={(o) => {
          return <span>{o.State}</span>;
        }}
        options={dictionary?.rackList
          ?.sort((a, b) => (a.RackNumber > b.RackNumber ? 1 : -1))
          ?.map((o) => ({
            ...o,
            label: `${o.RackNumber || '--'}`,
            value: o.RackNumber,
          }))}
        onChange={(v, o) => {
          onChange(v, id);
        }}
        value={value}
        placeholder={placeholder}
      />
    );
  },
  preventUpdate,
);

export const Editable = {
  EF_Date,
  EF_Select,
  EF_SelectWithLabel,
  EF_MultiSelect,
  EF_Input,
  EF_Text,
  EF_Checkbox,
  EF_Checkbox_Yesno,
  EF_Label,
  EF_Rack,
};

export default Editable;
