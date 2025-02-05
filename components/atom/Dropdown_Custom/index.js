import { Dropdown } from "antd";
import { useState } from "react";

const Dropdown_Custom = ({
  renderTrigger = () => {},
  content,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dropdown
      open={open}
      onOpenChange={setOpen}
      trigger={["click"]}
      dropdownRender={() => (
        <div
          style={{
            padding: "5px",
            background: "white",
            borderRadius: "4px",
            boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          {content}
        </div>
      )}
    >
      {renderTrigger((e) => e.preventDefault())}
    </Dropdown>
  );
};

export default Dropdown_Custom;
