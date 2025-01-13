import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleFull } from "../Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, orderId, onHide } = useContext(LocalDataContext);

  const jsxClose = <div className="p-2 text-left flex flex-column gap-2">
    <div>[shipping] notes notes</div>
    <div>[shipping] notes notes</div>
    
  </div>;

  return (
    <ToggleFull title={"Notes"} titleClass={styles.title} jsxClose={jsxClose} id={'notes'}>
      <div>No Data</div>
    </ToggleFull>
  );
};

export default Com;
