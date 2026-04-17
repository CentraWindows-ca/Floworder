import React, { useMemo } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";
import { Segmented } from "antd";
import { RedoOutlined } from "@ant-design/icons";
import { ALL_SUBORDER_TYPES } from "lib/constants";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const { disabled } = props;
  const router = useRouter();
  const defaultFacility = "All";
  const facility = router?.query?.facility || defaultFacility;
  const kind = router?.query?.tab || ''

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

  // filter for kind=>facility. (for example door only has calgary)
  const _FACILITY_OPTIONS = useMemo(() => {
    const facilityOptions = ALL_SUBORDER_TYPES?.filter(a => a.kind === kind)
    return tabs?.filter(a => {
      if (a.eventKey === "All") return true
      return _.some(facilityOptions, (fo) => fo.facility === a.title)
    })?.map(a => a.title)
  }, [disabled, kind])

  // ====== consts
  return (
    <div className={cn("input-group input-group-sm bg-white", styles.root)}>
      <span className={cn("text-primary align-items-center flex gap-2")}>
        <i className="fas fa-tools"></i>
        Manufacturing Facility
      </span>
      <Segmented
        size="middle"
        options={_FACILITY_OPTIONS}
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
