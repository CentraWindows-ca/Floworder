import React, { useEffect, useState, useContext } from "react";
import Modal from "react-bootstrap/Modal";
import style from "./style";

/**
 * Modal wrapper for styles
 */
export default style(
  React.memo(
    ({
      show,
      onHide = () => {},
      onExited= () => {},
      size = "lg",
      title,
      subtitle,
      closeButton = true,
      children,
      hasModalBody = true,
      footer,
      className,
      fullscreen,
      ...rest
    }) => {
      return (
        <Modal show={show} fullscreen = {fullscreen} className={className} onHide={onHide} onExited={onExited} size={size} aria-labelledby="modal" {...rest}>
          <Modal.Header closeButton={closeButton}>
            <Modal.Title> {title} </Modal.Title> {subtitle}
          </Modal.Header>
          {hasModalBody ? <Modal.Body>{children}</Modal.Body> : children}
          {footer ? <Modal.Footer>{footer}</Modal.Footer> : null}
        </Modal>
      );
    }
  )
);
