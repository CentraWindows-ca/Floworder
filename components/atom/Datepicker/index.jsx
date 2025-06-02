import React, { useState, useEffect } from "react";
import _ from "lodash";
import cn from "classnames";
import DatePicker from "react-datepicker";
import {
  parse,
  parseISO,
  formatISO,
  format,
  getYear,
  getMonth,
} from "date-fns";

// styles
import styles from "./styles.module.scss";

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DFDatePicker = ({
  value = "",
  className,
  onChange,
  onSelect,
  style = { width: "140px" },
  size,
  viewType = "",
  disabled,
  disabledCloseButton,
  ...props
}) => {
  let otherProps = {};
  const dateValue = value ? parseISO(value) : null;

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
  };

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
      )}
      style={style}
    >
      <div
        className={cn(
          "form-control",
          value ? styles.dateInput : styles.dateInputBlank,
          className,
        )}
        onClick={onClick}
        ref={ref}
      >
        {value || "Select Date..."}
      </div>
      {value && !disabled && !disabledCloseButton && (
        <button className="btn btn-outline-secondary" onClick={handleClear}>
          <i className="fa-solid fa-xmark" />
        </button>
      )}
    </div>
  ));

  const jsxCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    return (
      <div className="input-group input-group-sm px-3" style={{width: "220px"}}>
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={decreaseMonth}
          disabled={prevMonthButtonDisabled}
        >
          {"<"}
        </button>
        <input
          className="form-control form-control-sm"
          value={getYear(date)}
          onChange={({ target: { value } }) => changeYear(value)}
          placeholder="Year(i.e. 2025)"
        />

        <select
          className="form-select-sm form-select"
          value={months[getMonth(date)]}
          onChange={({ target: { value } }) =>
            changeMonth(months.indexOf(value))
          }
        >
          {months.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={increaseMonth}
          disabled={nextMonthButtonDisabled}
        >
          {">"}
        </button>
      </div>
    );
  };

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
          renderCustomHeader={jsxCustomHeader}
          {...otherProps}
          {...props}
        />
      )}
    </>
  );
};


export default DFDatePicker;
