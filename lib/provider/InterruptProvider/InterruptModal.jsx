import React, { useState } from "react";
import { useInterrupt } from "./index.js";
import Modal from "components/molecule/Modal/index.jsx";

export function InterruptModal({ children }) {
  const { isPaused, missingFields, resumeAction, cancelAction, data } =
    useInterrupt();

  return React.cloneElement(children, {
        isPaused,
        missingFields,
        onSubmit: resumeAction,
        onCancel: cancelAction,
        data
      })
}