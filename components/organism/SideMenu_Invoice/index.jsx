import React from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { INVOICE_STATUS_AS_GROUP } from "lib/constants";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const router = useRouter();
  const status = router?.query?.status;
  const isDeleted = router?.query?.isDeleted;
  const activeKey = router?.asPath?.split("?")?.[0];

  const handleClick = (v) => {
    const currentPath = router?.asPath?.split("?")?.[0];
    const targetPath = "/";
    let newQuery = {};

    newQuery = {
      ...router.query,
      status: v,
    };

    if (currentPath === targetPath) {
      delete newQuery.p;
      delete newQuery.isDeleted;
    }

    router.replace(
      {
        pathname: targetPath,
        query: newQuery,
      },
      undefined,
      { shallow: false },
    );
  };

  return (
    <div className={cn("w-full", styles.root)}>
      <div className={cn(styles.statusGroups)}>
        <NavSideMenu
          item={{
            label: "All Invoice",
            color: "#005db9",
            textColor: "#005db9",
            icon: (
              <i
                className="fa-solid fa-file-lines"
                style={{ fontSize: "16px" }}
              />
            ),
          }}
          isActive={
            activeKey === "/" &&
            (!status || status === "All") &&
            !isDeleted?.toString()
          }
          onClick={() => {
            handleClick("All");
          }}
        />
      </div>

      {INVOICE_STATUS_AS_GROUP?.map((group, i) => {
        return (
          <div className={cn(styles.statusGroups)} key={`status_group_${i}`}>
            {group?.map((a) => {
              const { key, label } = a;
              let isActive = false;
              if (!isDeleted) {
                isActive =
                  activeKey === "/" &&
                  key?.toString() === (status?.toString() || "");
              }

              return (
                <NavStatus
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
      })}
    </div>
  );
};
{
  /* <i class="fa-regular fa-file-lines"></i> */
}

const NavStatus = ({ onClick, item, isActive }) => {
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

const NavSideMenu = ({ onClick, item, isActive }) => {
  const { label, color, textColor, icon } = item;

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
            color,
          }}
          className="align-items-center flex"
        >
          {icon}
        </div>
        <div
          className="align-items-center flex gap-1"
          style={{ color: textColor }}
        >
          {label}
        </div>
      </div>
    </div>
  );
};

export default Com;
