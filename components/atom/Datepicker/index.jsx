import React, { useState, useEffect } from "react";
import cn from "classnames";
import DatePicker from "react-datepicker";
import { parse, parseISO, formatISO, format } from "date-fns";

// styles
import styles from "./styles.module.scss";

const DFDatePicker = ({
  value = "",
  className,
  onChange,
  onSelect,
  style = { width: "140px" },
  size,
  viewType = "",
  disabled,
  ...props
}) => {
  let otherProps = {};

  switch (viewType) {
    case "month":
      otherProps = {
        dateFormat: "yyyy-MM",
        showMonthYearPicker: true,
        showFullMonthYearPicker: true,
      };
      break;
    case "date":
      otherProps = {
        dateFormat: "yyyy-MM-dd",
      };
      break;
    default:
      otherProps = {
        dateFormat: "MM/dd/yyyy",
      };
      break;
  }

  const dateValue = value ? parseISO(value) : null;

  const handleSelect = (v) => {
    try {
      const formattedDate = v ? format(v, "yyyy-MM-dd") : null;
      onSelect(v, formattedDate);
    } catch (e) {
      onSelect("", null);
    }
  };

  const handleClear = () => {
    onSelect("", null);
    onChange("", null);
  }

  // const handleChange = (v) => {
  //   const formattedDate = v ? format(v, "yyyy-MM-dd") : null;
  //   onChange(v, formattedDate);
  // };

  // text for disabled
  const valueTextDisabled = dateValue
    ? format(dateValue, otherProps.dateFormat)
    : "";

  const CustomInput = React.forwardRef(({ value, onClick }, ref) => (
    <div
      className={cn(
        "input-group",
        size === "sm" ? styles.containersm : styles.container,
        disabled ? styles.disabled : "",
        className,
      )}
      style={style}
    >
      <div
        className={cn(
          "form-control",
          value ? styles.dateInput : styles.dateInputBlank,
        )}
        onClick={onClick}
        ref={ref}
      >
        {value || "Select Date..."}
      </div>
      {value && (
        <button className="btn btn-secondary" onClick={handleClear}>
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  ));

  // 01/15/2025 14:27:05
  return (
    <>
      {disabled ? (
        <input
          {...props}
          style={style}
          value={valueTextDisabled || ""}
          onChange={() => {}}
          className={cn(
            "form-control text-center",
            size === "sm" ? styles.containersm : styles.container,
            className,
          )}
          disabled
        />
      ) : (
        <DatePicker
          selected={dateValue}
          // onChange={handleChange}
          onSelect={handleSelect}
          className={styles.root}
          readOnly={disabled}
          customInput={<CustomInput />}
          {...otherProps}
          {...props}
        />
      )}
    </>
  );
};

export default DFDatePicker;
