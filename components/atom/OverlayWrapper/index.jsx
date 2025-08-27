import { useState, useEffect } from "react";
import cn from "classnames";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { format } from "date-fns";

// styles
import styles from "./styles.module.scss";

const Com = ({
  renderTrigger = () => <></>,
  trigger = "click",
  isLock = false,
  className,
  maxWidth = "800px",
  zIndex = 1070,
  children,
  toggle = false,
  isEnable = true,
}) => {
  if (!isEnable) return renderTrigger();

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show && trigger === "click") {
      // Create overlay element
      const overlay = document.createElement("div");
      overlay.style.position = "fixed";
      overlay.style.top = 0;
      overlay.style.left = 0;
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
      overlay.style.zIndex = zIndex - 1; // Ensure it's above other content

      // Append to body
      document.body.appendChild(overlay);

      // Cleanup: remove overlay on component unmount or when 'show' is false
      return () => {
        document.body.removeChild(overlay);
      };
    }
  }, [show, trigger]);

  useEffect(() => {
    setShow(false);
  }, [toggle]);

  const handleTrigger = () => {
    setShow((prev) => !prev);
  };

  return (
    <>
      <div style={{ position: "relative", opacity: isLock ? 0.6 : 1 }}>
        <OverlayTrigger
          show={show}
          trigger={trigger}
          rootClose
          onToggle={(a) => {
            if (isLock) {
              return;
            }
            setShow(a);
          }}
          placement="bottom"
          overlay={
            <Popover
              id="popover-positioned"
              style={{ maxWidth, zIndex }}
              className={className}
            >
              {children}
            </Popover>
          }
        >
          {renderTrigger(handleTrigger)}
        </OverlayTrigger>
      </div>
    </>
  );
};

export default Com;
