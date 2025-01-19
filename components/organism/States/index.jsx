import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { ORDER_STATUS } from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const defaultTab = "0";
const list = ORDER_STATUS;

const Com = (props) => {
  const router = useRouter();
  const status = router?.query?.status || defaultTab;

  const handleClick = (v) => {
    const pathname = router?.asPath?.split("?")?.[0];

    router.replace(
      {
        pathname,
        query: { ...router.query, status: v },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className={cn("w-full", styles.root)}>
      {list?.map((a) => {
        const { key, label } = a;
        const isActive = key?.toString() === status;

        return (
          <Item
            item={a}
            key={key}
            isActive={isActive}
            onClick={() => {
              handleClick(key);
            }}
          />
        );
      })}
    </div>
  );
};

const Item = ({ onClick, item, isActive }) => {
  const { label } = item;

  return (
    <div
      className={cn(styles.item, isActive && styles.active)}
      onClick={onClick}
    >
      {label}
    </div>
  );
};

export default Com;
