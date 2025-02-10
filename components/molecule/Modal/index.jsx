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
      onExited = () => {},
      size = "lg",
      title,
      subtitle,
      closeButton = true,
      children,
      hasModalBody = true,
      footer,
      className,
      bodyClassName,
      fullscreen,
      layer = 0,
      style,
      ...rest
    }) => {
      const styleWithLayer = { ...style };
      let styleBackdrop = "";

      if (layer) {
        styleWithLayer["zIndex"] = 1055 + (layer * 10);
        styleBackdrop = `
          .custom-backdrop_${layer} {
            z-index: ${1050 + (layer * 10)} !important;
          }
        `;
      }

      return (
        <>
          <Modal
            show={show}
            fullscreen={fullscreen}
            className={className}
            onHide={onHide}
            onExited={onExited}
            size={size}
            aria-labelledby="modal"
            style={styleWithLayer}
            backdropClassName={`custom-backdrop_${layer}`}
            {...rest}
          >
            <Modal.Header closeButton={closeButton}>
              <Modal.Title> {title} </Modal.Title> {subtitle}
            </Modal.Header>
            {hasModalBody ? (
              <Modal.Body className={bodyClassName}>{children}</Modal.Body>
            ) : (
              children
            )}
            {footer ? <Modal.Footer>{footer}</Modal.Footer> : null}
          </Modal>
          <style>{styleBackdrop}</style>
        </>
      );
    },
  ),
);
