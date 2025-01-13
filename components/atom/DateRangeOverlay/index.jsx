import { useState, useEffect } from "react";
import cn from "classnames";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { format } from "date-fns";

import Datepicker from "components/atom/Datepicker";
// styles
import styles from "./styles.module.scss";

const DateRange = ({
  buttonText,
  onApply = () => {},
  onClear = () => {},
  defaultStart = "",
  defaultEnd = "",
  className,
}) => {
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [show, setShow] = useState(false);

  const handleApploy = () => {
    setShow(false);
    if (start || end) {
      onApply(start, end);
    } else {
      onClear();
    }
  };

  const handleClear = () => {
    setShow(false);
    setStart("");
    setEnd("");
    onClear();
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

  const textStart = defaultStart ? format(defaultStart, "yyyy-MM-dd") : "";
  const textEnd = defaultEnd ? format(defaultEnd, "yyyy-MM-dd") : "";

  return (
    <div style={{ position: "relative" }}>
      <OverlayTrigger
        show={show}
        trigger="click"
        rootClose
        onToggle={(a) => {
          setShow(a);
        }}
        placement="bottom"
        overlay={
          <Popover id="popover-positioned-bottom" style={{ maxWidth: "500px" }} title="Popover bottom">
            <div className={cn("input-group p-2", styles.containersm)}>
              <Datepicker size={'sm'} onChange={handleSetStart} onSelect={handleSetStartSelect} value={start} />
              <div className={styles.to}>TO</div>
              <Datepicker size={'sm'} onChange={handleSetEnd} onSelect={handleSetEndSelect} value={end} />
              <button className={cn("btn btn-sm btn-outline-primary", styles.btn)} onClick={handleApploy}>
                Apply
              </button>
              <button className={cn("btn btn-sm btn-outline-secondary", styles.btn)} onClick={handleClear}>
                Clear
              </button>
            </div>
          </Popover>
        }
      >
        <button className={cn(className, "border")}>
          <div>
            {textStart || textEnd ? (
              <>
                <div>{textStart}</div>
                <div>{textEnd}</div>
              </>
            ) : (
              buttonText
            )}
          </div>
        </button>
      </OverlayTrigger>
      {textStart || textEnd ? (
        <i
          className="cursor-pointer fa-solid text-red-700 hover:text-red-500 fa-circle-xmark"
          style={{ position: "absolute", right: "-4px", top: "-4px" }}
          onClick={handleClear}
        />
      ) : null}
    </div>
  );
};

export default DateRange;
