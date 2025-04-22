import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock, displayFilter } from "./Com";

const group = "schedule"

const COMMON_FIELDS = constants.applyField([
  {
    id: "m_ShippingStartDate",
  },
  {
    id: "m_RevisedDeliveryDate",
  },
]);
const WINDOW_FIELDS = constants.applyField([
  {
    id: "w_CustomerDate",
  },
  {
    id: "w_ProductionStartDate",
  },
  {
    id: "w_PaintStartDate",
  },
  {
    id: "w_GlassOrderDate",
  },
  {
    id: "w_GlassRecDate",
  },
]);
const DOOR_FIELDS = constants.applyField([
  {
    id: "d_CustomerDate",
  },
  {
    id: "d_ProductionStartDate",
  },
  {
    id: "d_PaintStartDate",
  },
  {
    id: "d_GlassOrderDate",
  },
]);

const Com = ({}) => {
  const { kind, uiOrderType } = useContext(LocalDataContext);

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
            <label>Windows</label>
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
            <label>Doors</label>
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
  const { data, initData, onChange, checkEditable } = useContext(LocalDataContext);

  return (
    <DisplayBlock id={id}>
      <label className="justify-content-start align-items-center flex">
        {title}
      </label>
      <div className="justify-content-end align-items-center flex">
        <Editable.EF_DateOnly
          k={id}
          id={id}
          value={data?.[id]}
          initValue = {initData?.[id]}
          onChange={(v) => onChange(v, id)}
          disabled={!checkEditable({id, group})}
        />
      </div>
    </DisplayBlock>
  );
};

export default Com;
