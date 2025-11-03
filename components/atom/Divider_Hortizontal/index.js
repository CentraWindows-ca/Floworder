import React, { useEffect } from "react";
import cn from "classnames";
import styles from "./styles.module.scss";

const Com = ({ children, className }) => {
  return (
    <div className={cn(className)}>
      <div className={cn(styles.root)}>
        <div className={cn(styles.title)}>{children}</div>
      </div>
    </div>
  );
};

export default React.memo(Com);
