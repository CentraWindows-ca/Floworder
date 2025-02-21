import { useState, useEffect } from "react";
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
  style = { width: "100px" },
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

  const dateValue = value
    ? parseISO(value)
    : null;

  const handleSelect = (v) => {
    const formattedDate = v ? format(v, "yyyy-MM-dd'T'HH:mm:ss") : null;
    onSelect(v, formattedDate);
  };

  const handleChange = (v) => {
    const formattedDate = v ? format(v, "yyyy-MM-dd'T'HH:mm:ss") : null;
    onChange(v, formattedDate);
  };

  console.log(value)

  // 01/15/2025 14:27:05
  return (
    <div
      className={cn(
        "form-control form-control-sm",
        size === "sm" ? styles.containersm : styles.container,
        className,
      )}
      style={style}
    >
      <DatePicker
        selected={dateValue}
        onChange={handleChange}
        onSelect={handleSelect}
        className={styles.root}
        readOnly={disabled}
        {...otherProps}
        {...{ props }}
      />
    </div>
  );
};

export default DFDatePicker;
