import { useState, useEffect } from "react";
import { subMonths, subYears, subDays } from "date-fns";

import Datepicker from "components/atom/Datepicker";
// styles
import styles from "./styles.module.scss";

const DateRange = ({ onApply, viewType, defaultStart = subDays(new Date(), 7), defaultEnd = new Date() }) => {
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);

  const handleApploy = () => {
    onApply(start, end);
  };

  // a layer to handle (end < start) case
  const handleSetStart = (d) => {
    const newDate = d; // || new Date()
    setStart(newDate);
  };

  const handleSetEnd = (d) => {
    const newDate = d; // || new Date()
    setEnd(newDate);
  };

  const handleSetStartSelect = (d) => {
    handleSetStart(d)
    if (d && d > end) {
      setEnd(d);
    }
  }
  
  const handleSetEndSelect = (d) => {
    handleSetEnd(d)
    if (d && d < start) {
      setStart(d);
    }
  }

  return (
    <>
      <Datepicker viewType={viewType} onChange={handleSetStart} onSelect={handleSetStartSelect} value={start} />
      <div className="input-group-text">TO</div>
      <Datepicker viewType={viewType} onChange={handleSetEnd} onSelect={handleSetEndSelect} value={end} />
      <button className="btn btn-outline-primary" onClick={handleApploy}>
        Apply
      </button>
    </>
  );
};

export default DateRange;
