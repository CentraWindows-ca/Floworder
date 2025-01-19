import { useState, useEffect } from "react";
import cn from "classnames";
import DatePicker from "react-datepicker";
import { parse, format } from "date-fns";
// styles
import styles from "./styles.module.scss";

const DFDatePicker = ({
  value = "",
  className,
  onChange,
  onSelect,
  style = { width: "100px" },
  size,
  viewType = "date",
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
    default:
      otherProps = {
        dateFormat: "yyyy-MM-dd",
      };
      break;
  }

  const dateValue = value ? parse(value, "yyyy-MM-dd", new Date()) : null;

  const handleSelect = (v) => {
    const formattedDate = v ? format(v, "yyyy-MM-dd") : null;
    onSelect(v, formattedDate);
  };

  const handleChange = (v) => {
    const formattedDate = v ? format(v, "yyyy-MM-dd") : null;
    onChange(v, formattedDate);
  };

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
