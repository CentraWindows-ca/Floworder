import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const defaultTab = "";
const list = [
  {
    label: "All Work orders",
    key: "",
  },
  {
    label: "Draft",
    key: "draft",
  },
  {
    label: "Scheduled",
    key: "scheduled",
  },
  {
    label: "In Progress",
    key: "inProgress",
  },
  {
    label: "Ready to Ship",
    key: "readyToShip",
  },
  {
    label: "Shipped",
    key: "shipped",
  },
  {
    label: "On Hold",
    key: "onHold",
  },
];

const Com = (props) => {
  const router = useRouter();
  const state = router?.query?.state || defaultTab;

  const handleClick = (v) => {
    const pathname = router?.asPath?.split("?")?.[0];

    router.replace(
      {
        pathname,
        query: { ...router.query, state: v },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className={cn("w-full", styles.root)}>
      {list?.map((a) => {
        const { key, label } = a;
        const isActive = key === state;

        return (
          <Item
            item={a}
            key={label}
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
