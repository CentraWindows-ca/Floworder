import React from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { Segmented } from "antd";
import { RedoOutlined } from "@ant-design/icons";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const { disabled } = props;
  const router = useRouter();
  const defaultTab = "All";
  const facility = router?.query?.facility || defaultTab;

  const tabs = disabled
    ? [
        {
          eventKey: "All",
          title: "All",
        },
      ]
    : [
        {
          eventKey: "langley",
          title: "Langley",
        },
        {
          eventKey: "calgary",
          title: "Calgary",
        },
        {
          eventKey: "All",
          title: "All",
        },
      ];

  const handleClick = (v) => {
    const facility = tabs.find((a) => a.title === v)?.eventKey;
    const pathname = router?.asPath?.split("?")?.[0];
    router.replace(
      {
        pathname,
        query: { ...router.query, facility },
      },
      undefined,
      { shallow: true },
    );
  };

  const _value = tabs.find((a) => a.eventKey === facility)?.title;

  // ====== consts
  return (
    <div className={cn("input-group input-group-sm bg-white", styles.root)}>
      <span className={cn("text-primary align-items-center flex gap-2")}>
        <i className="fas fa-tools"></i>
        Manufacturing Facility
      </span>
      <Segmented
        size="middle"
        options={tabs?.map((a) => a.title)}
        value={_value}
        onChange={(v) => {
          handleClick(v);
        }}
        shape="round"
      />
    </div>
  );
};
export default Com;
