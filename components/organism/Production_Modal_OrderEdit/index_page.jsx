import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";

// styles
import styles from "./styles.module.scss";

import { LocalDataProvider } from "./LocalDataProvider";
import Header from "./Header";
import Main from "./Main";

const Com = ({}) => {
  return (
    <div className={cn(styles.modalBody)}>
      <Header />
      <Main />
    </div>
  );
};

export default (props) => {
  return (
    <LocalDataProvider {...props}>
      <Com />
    </LocalDataProvider>
  );
};
