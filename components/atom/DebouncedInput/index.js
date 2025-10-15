import React, { useState, useEffect, useCallback } from "react";
import { Input } from "antd";
import debounce from "lodash.debounce";

const DebouncedInput = ({ value: externalValue, placeholder, onChange, delay = 500, ...props }) => {
  const [internalValue, setInternalValue] = useState(externalValue);

  useEffect(() => {
    // If external value changes and it's different from internal value, update internal state
    if (externalValue !== internalValue) {
      setInternalValue(externalValue);
    }
  }, [externalValue]);

  // Debounce function for handling input changes
  const debouncedOnChange = useCallback(
    debounce((newValue) => {
      onChange(newValue);
    }, delay),
    [onChange, delay]
  );

  const handleChange = (e) => {
    setInternalValue(e.target.value);
    debouncedOnChange(e);
  };

  return <input {...props} value={internalValue} placeholder = {placeholder} onChange={handleChange} />;
};

export default DebouncedInput;
