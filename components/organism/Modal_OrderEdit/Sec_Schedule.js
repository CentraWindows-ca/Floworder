import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock, displayFilter } from "./Com";

const COMMON_FIELDS = [
  {
    title: "Shipping Start",
    id: "m_ShippingStartDate",
  },

  {
    title: "Shipping End",
    id: "m_ShippingEndDate",
  },
  {
    title: "Revised Delivery Date",
    id: "m_RevisedDeliveryDate",
  },
];
const WINDOW_FIELDS = [
  {
    title: "Window Customer Date",
    id: "w_CustomerDate",
  },
  {
    title: "Windows Production Start",
    id: "w_ProductionStartDate",
  },
  // auto update by start
  // {
  //   title: "Windows Production End",
  //   id: "w_ProductionEndDate",
  // },
  {
    title: "Window Paint Start",
    id: "w_PaintStartDate",
  },
  {
    title: "Window Paint End",
    id: "w_PaintEndDate",
  },

  {
    title: "Window Glass Order Date",
    id: "w_GlassOrderDate",
  },
  {
    title: "Window Glass Receive Date",
    id: "w_GlassRecDate",
  },
];
const DOOR_FIELDS = [
  {
    title: "Door Customer Date",
    id: "d_CustomerDate",
  },
  {
    title: "Doors Production Start",
    id: "d_ProductionStartDate",
  },
  // {
  //   title: "Doors Production End",
  //   id: "d_ProductionEndDate",
  // },
  {
    title: "Door Paint Start",
    id: "d_PaintStartDate",
  },
  {
    title: "Door Paint End",
    id: "d_PaintEndDate",
  },
  {
    title: "Door Glass Order Date",
    id: "d_GlassOrderDate",
  },
];

const Com = ({ className, ...props }) => {
  const { data, kind, uiOrderType } =
    useContext(LocalDataContext);

  const [doorInputs, setDoorInputs] = useState(null);
  const [windowInputs, setWindowInputs] = useState(null);

  useEffect(() => {
    setDoorInputs(
      displayFilter(DOOR_FIELDS, {
        kind,
        uiOrderType,
      }),
    );

    setWindowInputs(
      displayFilter(WINDOW_FIELDS, {
        kind,
        uiOrderType,
      }),
    );
  }, [kind, uiOrderType]);

  return (
    <>
      <div className={cn(styles.columnInputsContainer)}>
        {COMMON_FIELDS?.map((a) => {
          const { title, id } = a;
          return <DisplayDate key={id} id={id} title={title} />;
        })}
      </div>

      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label >Window</label>
          </div>
          <div className={cn(styles.columnInputsContainer)}>
            {windowInputs?.map((a) => {
              const { title, id } = a;
              return <DisplayDate key={id} id={id} title={title} />;
            })}
          </div>
        </>
      )}

      {!_.isEmpty(doorInputs) && (
        <>
          <div className={styles.subTitle}>
            <label >Door</label>
          </div>
          <div className={cn(styles.columnInputsContainer)}>
            {doorInputs?.map((a) => {
              const { title, id } = a;
              return <DisplayDate key={id} id={id} title={title} />;
            })}
          </div>
        </>
      )}
    </>
  );
};

const DisplayDate = ({ id, title }) => {
  const { data, onChange, isEditable } = useContext(LocalDataContext);

  return (
    <DisplayBlock id={id}>
      <label className="justify-content-start align-items-center flex">
        {title}
      </label>
      <div className="justify-content-end align-items-center flex">
        <Editable.EF_Date
          k={id}
          value={data?.[id]}
          onChange={(v) => onChange(v, id)}
          disabled={!isEditable}
        />
      </div>
    </DisplayBlock>
  );
};

export default Com;
