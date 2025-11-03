"use client";
import React, { useState, useId } from "react";
import FocusLock from "react-focus-lock";
import cn from "classnames";
import {
  useFloating,
  offset,
  safePolygon,
  useHover,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  autoUpdate,
} from "@floating-ui/react";

import styles from "./styles.module.scss";

const HoverPopover = ({
  trigger,
  children,
  panelClassName,
  className,
  placement = "bottom-start",
  // "top-start" | "top-end" | "right-start" | "right-end" | "bottom-start" | "bottom-end" | "left-start" | "left-end"
  offsetPx = 8,
  // Accessible name for icon-only trigger; override from parent if needed
  ariaLabel = "Open menu",
  // Focus lock is optional; not required by WCAG for non-modal popovers
  lockFocus = false,
  isClick = false,
  layer = 1,
}) => {
  const [open, setOpen] = useState(false);

  const panelId = useId(); // used by aria-controls to link trigger and panel

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement, // right-aligned + below
    middleware: [offset(offsetPx)], // fixed below; no flip/shift
    whileElementsMounted: autoUpdate,
  });

  // Desktop hover (with safePolygon to avoid accidental close)
  const hover = useHover(context, {
    handleClose: safePolygon(),
    move: false,
    delay: { open: 80, close: 100 },
  });
  // Touch devices: click to toggle (also works on desktop)
  const click = useClick(context);
  // Close on outside click / Escape
  const dismiss = useDismiss(context);
  // A11y role for the floating panel (generic popover -> dialog role)
  const role = useRole(context, { role: "dialog" });

  const _interactions = [
    hover,
    dismiss,
    role,
  ]

  if (isClick) {
    _interactions.push(click)
  }

  const { getReferenceProps, getFloatingProps } = useInteractions(_interactions);

  // Keyboard support on trigger to satisfy WCAG 2.1.1 (Keyboard)
  const onTriggerKeyDown = (e) => {
    // Use key (not keyCode). Space should prevent page scroll.
    // if (e.key === " " || e.key === "Enter") {
    //   e.preventDefault();
    //   setOpen((prev) => !prev);
    // } else

    if (e.key === "ArrowDown") {
      // APG: Down Arrow may open the popup for menu-button-like triggers
      if (!open) setOpen(true);
    } else if (e.key === "Escape") {
      if (open) setOpen(false);
    }
  };

  // Delegate "select-to-close" inside the panel (opt-in via [data-close])
  const onPanelClick = (e) => {
    const target = e.target;
    if (target.closest("[data-close]")) setOpen(false);
  };

  const panelNode = (
    <div
      id={panelId}
      ref={refs.setFloating}
      {...getFloatingProps({ onClick: onPanelClick })}
      className={cn(panelClassName, styles.panel)}
      style={{ ...floatingStyles }}
    >
      {children}
    </div>
  );

  return (
    <>
      {/* Focusable, semantic trigger with an accessible name */}
      <span
        ref={refs.setReference}
        {...getReferenceProps({
          // Make non-interactive element behave like a button for a11y
          role: "button",
          tabIndex: 0,
          // Provide a programmatic name for icon-only triggers
          "aria-label": ariaLabel,
          // Expose the relationship & state
          "aria-haspopup": "dialog", // content is arbitrary (not a strict ARIA menu)
          "aria-expanded": open,
          "aria-controls": open ? panelId : undefined,
          onKeyDown: onTriggerKeyDown,
          // Visual affordance only; your styles handle focus ring
          style: { cursor: "pointer" },
        })}
        className={cn(className)}
      >
        {trigger}
      </span>
      {open &&
        (lockFocus ? (
          <FocusLock returnFocus>{panelNode}</FocusLock>
        ) : (
          panelNode
        ))}
    </>
  );
};

export default HoverPopover;
