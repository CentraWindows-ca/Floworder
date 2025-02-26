import React, {  } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { ORDER_STATUS } from "lib/constants";

// styles
import styles from "./styles.module.scss";

const defaultTab = "";
const list = ORDER_STATUS;

const Com = (props) => {
  const router = useRouter();
  const status = router?.query?.status || defaultTab;

  const handleClick = (v) => {
    const pathname = router?.asPath?.split("?")?.[0];
    router.replace(
      {
        pathname,
        query: { ...router.query, status: v, p: undefined },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className={cn("w-full", styles.root)}>
      {list?.map((a) => {
        const { key, label } = a;
        const isActive = key?.toString() === status?.toString();

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
  const { label, color, icon } = item;

  return (
    <div
      className={cn(styles.item, isActive && styles.active)}
      onClick={onClick}
    >
      <div className="flex align-items-center gap-2">
        <div style={{ border:'1px solid #A0A0A0', height: 15, width: 15, backgroundColor: color }} />
        <label className="align-items-center flex gap-1">{label}</label>
      </div>
      <div className="text-slate-300">{icon}</div>
    </div>
  );
};

export default Com;
