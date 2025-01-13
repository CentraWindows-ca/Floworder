import React, { useContext } from "react";
import cn from "classnames";

// components
import styles from "./styles.module.scss";

// note: styled component doesnt work on layout, so use scss module instead
const Layout = ({ children }) => {

  return (
    <div className={styles.root}>
      <div className={cn("md:ml-64", styles.rightContainer)}>   
        {children}
      </div>
    </div>
  );
};


export default Layout;
