import { useState, useEffect } from "react";
import cn from "classnames";
import DatePicker from "react-datepicker";
// styles
import styles from "./styles.module.scss";

const DFDatePicker = ({
  value = new Date(),
  className,
  onChange,
  onSelect,
  style = { width: "100px" },
  size,
  viewType = "date",
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

  return (
    <div className={cn("form-control", size === "sm" ? styles.containersm : styles.container, className)} style={style}>
      <DatePicker
        selected={value}
        onChange={onChange}
        onSelect={onSelect}
        className={styles.root}
        {...otherProps}
        {...{ props }}
      />
    </div>
  );
};

export default DFDatePicker;
