import React, { useState, useEffect, useRef } from "react";
import { Table } from "antd";


const TableFullHeight = ({ columns, dataSource, pagination = false, ...rest }) => {
  const containerRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(300); // Default fallback height

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const containerStyle = window.getComputedStyle(containerRef.current);
        
        // Get padding values
        const paddingTop = parseFloat(containerStyle.paddingTop) || 0;
        const paddingBottom = parseFloat(containerStyle.paddingBottom) || 0;
        
        // Calculate available height inside the container
        const availableHeight = window.innerHeight - rect.top - paddingBottom - 20; // Extra margin
        setTableHeight(availableHeight > 0 ? availableHeight - paddingTop : 300);
      }
    };

    updateHeight(); // Run on mount
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative", borderBottom: '1px solid #F0F0F0' }}>
      <Table 
        columns={columns?.map(a => ({...a, ellipsis: true}))} 
        dataSource={dataSource} 
        pagination={pagination} 
        scroll={{ y: tableHeight - 28, x: "max-content" }} 
        {...rest}
      />
    </div>
  );
};

export default React.memo(TableFullHeight)
