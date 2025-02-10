import React from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const router = useRouter();
  const defaultTab = "";
  const facility = router?.query?.facility || defaultTab;

  const tabs = [
    {
      eventKey: "langley",
      title: "Langley",
    },
    {
      eventKey: "calgary",
      title: "Calgary",
    },
    {
      eventKey: "",
      title: "All",
    },
  ];

  const handleClick = (v) => {
    const pathname = router?.asPath?.split("?")?.[0];
    router.replace(
      {
        pathname,
        query: { ...router.query, facility: v },
      },
      undefined,
      { shallow: true },
    );
  };
  // ====== consts
  return (
    <div className="input-group input-group-sm bg-white">
      <span className="input-group-text text-primary flex align-items-center gap-2" id="">
        <i className="fas fa-tools"></i>
        Manufacturing Facility:
      </span>
      {tabs?.map((a) => {
        const { title, eventKey } = a;
        const isActive = eventKey === (facility || "");
        return (
          <button
            key={eventKey}
            className={cn(
              "btn",
              isActive ? "btn-primary" : "btn-outline-primary",
            )}
            onClick={() => handleClick(eventKey)}
          >
            {title}
          </button>
        );
      })}
    </div>
  );
};
export default Com;
