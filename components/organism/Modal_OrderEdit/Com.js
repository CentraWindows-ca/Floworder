import { useState, useContext } from "react";
import cn from "classnames";
import constants, {HEADER_COLUMNS} from "lib/constants";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

export const DisplayBlock = ({ children, id = 'MASTER', displayAs,  ...props }) => {
  const { kind, data } = useContext(LocalDataContext);
  const [ currentKind, currentFieldName ] = id?.split?.('.')

  const displayKind = displayAs || kind

  if (displayKind === currentKind || currentKind === 'MASTER' || displayKind === 'MASTER') {
    return children;
  } else {
    return null
  }
};

export const ToggleBlock = ({
  children,
  data,
  id,
  title,
  titleClass,
  jsxClose = null,
  ...props
}) => {
  const { onAnchor, expands, setExpands } = useContext(LocalDataContext);
  const toggle = !expands[id];

  const setToggle = () => {
    if (expands[id]) {
      setExpands((prev) => {
        const _v = JSON.parse(JSON.stringify(prev || {}));
        _v[id] = !_v[id];
        return _v;
      });
    } else {
      onAnchor(id);
    }
  };

  return (
    <div className={cn(styles.toggleContainer)} id={id}>
      <div
        className={cn(styles.toggleTitle, titleClass)}
        onClick={() => setToggle((prev) => !prev)}
      >
        {title}
        <div>
          <i
            className={cn("fa-solid", toggle ? "fa-angle-up" : "fa-angle-down")}
          ></i>
        </div>
      </div>
      {toggle ? (
        jsxClose
      ) : (
        <div className={cn(styles.toggleZone)}>{children}</div>
      )}
    </div>
  );
};

export const ToggleFull = ({
  children,
  data,
  id,
  title,
  titleClass,
  jsxClose = null,
  ...props
}) => {
  const { expands, setExpands } = useContext(LocalDataContext);
  const toggle = !expands[id];

  const setToggle = () => {
    setExpands((prev) => {
      const _v = JSON.parse(JSON.stringify(prev || {}));
      _v[id] = !_v[id];
      return _v;
    });
  };

  return (
    <div className={cn(styles.toggleContainer, styles.toggleFull)} id={id}>
      <div
        className={cn(styles.toggleTitle, titleClass)}
        onClick={() => setToggle((prev) => !prev)}
      >
        {title}
        <div>
          <i
            className={cn("fa-solid", toggle ? "fa-angle-up" : "fa-angle-down")}
          ></i>
        </div>
      </div>
      {toggle ? (
        <div
          className={cn(styles.toggleFullClose)}
          onClick={() => setToggle((prev) => !prev)}
        >
          {jsxClose}
        </div>
      ) : (
        <div className={cn(styles.toggleZone)}>{children}</div>
      )}
    </div>
  );
};
