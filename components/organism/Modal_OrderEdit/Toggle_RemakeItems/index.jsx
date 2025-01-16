import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "../styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock } from "../Com";

const Com = ({ className, ...props }) => {
  const { data, onChange, onHide } = useContext(LocalDataContext);

  const jsxTitle = (
    <div className="flex gap-2">
      Remake Items
      <div className="text-primary font-normal">W: 0</div>
    </div>
  );

  return (
    <ToggleBlock title={jsxTitle} id={'remakeItems'}>
      <div>No Data</div>
    </ToggleBlock>
  );
};

export default Com;
