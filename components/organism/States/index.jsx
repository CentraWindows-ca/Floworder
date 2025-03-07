import React from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { ORDER_STATUS } from "lib/constants";

// styles
import styles from "./styles.module.scss";

const list = ORDER_STATUS;

const Com = (props) => {
  const router = useRouter();
  const status = router?.query?.status;
  const isDeleted = router?.query?.isDeleted;

  const handleClick = (v) => {
    const pathname = router?.asPath?.split("?")?.[0];
    const newQuery = {
      ...router.query,
      status: v,
    };
    delete newQuery.p;
    delete newQuery.isDeleted;

    router.replace(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  const handleTrash = (v) => {
    const pathname = router?.asPath?.split("?")?.[0];
    const newQuery = {
      ...router.query,
      isDeleted: 1,
    };

    delete newQuery.p;
    delete newQuery.status;

    router.replace(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className={cn("w-full", styles.root)}>
      {list?.map((a) => {
        const { key, label } = a;
        let isActive = false;
        if (typeof status !== "undefined") {
          isActive = key?.toString() === status?.toString();
        }
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
      <hr />
      <ItemTrash
        item={{
          label: "Trash Bin",
          color: "",
          icon: <i className="fa-solid fa-trash-can" />,
        }}
        isActive={!!isDeleted?.toString()}
        onClick={() => {
          handleTrash();
        }}
      />
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
      <div className="align-items-center flex gap-2">
        <div
          style={{
            border: "1px solid #A0A0A0",
            height: 15,
            width: 15,
            backgroundColor: color,
          }}
        />
        <div className="align-items-center flex gap-1">{label}</div>
      </div>
      <div className="text-slate-300">{icon}</div>
    </div>
  );
};

const ItemTrash = ({ onClick, item, isActive }) => {
  const { label, color, icon } = item;

  return (
    <div
      className={cn(styles.item, isActive && styles.active)}
      onClick={onClick}
    >
      <div className="align-items-center flex gap-2">
        <div
          style={{
            height: 15,
            width: 15,
            fontSize: "13px",
            color: "#B0B0B0",
          }}
          className="align-items-center flex"
        >
          {icon}
        </div>
        <div
          className="align-items-center flex gap-1"
          // style={{ color: "#999" }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default Com;
