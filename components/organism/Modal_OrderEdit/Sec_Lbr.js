import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import utils from "lib/utils";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";
import { DisplayBlock , displayFilter} from "./Com";

const COMMON_FIELDS = [
  {
    title: "Total LBR Min",
    id: "m_TotalLBRMin",
  },
];
const WINDOW_FIELDS = [
  {
    title: "Window LBR Min",
    id: "w_TotalLBRMin",
  },
  {
    title: "26CA",
    id: "w__26CA",
  },
  {
    title: "26CAMin",
    id: "w__26CAMin",
  },
  {
    title: "26HY",
    id: "w__26HY",
  },
  {
    title: "26HYMin",
    id: "w__26HYMin",
  },
  {
    title: "27DS",
    id: "w__27DS",
  },
  {
    title: "27DSMin",
    id: "w__27DSMin",
  },
  {
    title: "29CA",
    id: "w__29CA",
  },
  {
    title: "29CAMin",
    id: "w__29CAMin",
  },
  {
    title: "29CM",
    id: "w__29CM",
  },
  {
    title: "29CMMin",
    id: "w__29CMMin",
  },
  {
    title: "52PD",
    id: "w__52PD",
  },
  {
    title: "52PDMin",
    id: "w__52PDMin",
  },

  {
    title: "61DR",
    id: "w__61DR",
  },
  {
    title: "61DRMin",
    id: "w__61DRMin",
  },

  {
    title: "68CA",
    id: "w__68CA",
  },
  {
    title: "68CAMin",
    id: "w__68CAMin",
  },
  {
    title: "68SL",
    id: "w__68SL",
  },
  {
    title: "68SLMin",
    id: "w__68SLMin",
  },
  {
    title: "68VS",
    id: "w__68VS",
  },
  {
    title: "68VSMin",
    id: "w__68VSMin",
  },
];
const DOOR_FIELDS = [
  {
    title: "Door LBR Min",
    id: "d_TotalLBRMin",
  },
];

const Com = ({ className, ...props }) => {
  const { data,  kind, uiOrderType, onChange, onHide } = useContext(LocalDataContext);


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
      <div className={cn(styles.columnSummaryContainer)}>
        {COMMON_FIELDS?.map((a) => {
          const { title, id } = a;
          return <Block key={id} id={id} title={title} />;
        })}
      </div>

      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label className="text-sky-600">Window</label>
          </div>
          <div className={cn(styles.columnSummaryContainer)}>
            {windowInputs?.map((a) => {
              const { title, id } = a;
              return <Block key={id} id={id} title={title} />;
            })}
          </div>
        </>
      )}

      {!_.isEmpty(doorInputs) && (
        <>
          <div className={styles.subTitle}>
            <label className="text-sky-600">Door</label>
          </div>
          <div className={cn(styles.columnSummaryContainer)}>
            {doorInputs?.map((a) => {
              const { title, id } = a;
              return <Block key={id} id={id} title={title} />;
            })}
          </div>
        </>
      )}

     
    </>
  );
};

const Block = ({title, id}) => {
    const { data } = useContext(LocalDataContext);
  
  return (
    <>
      <label>{title}</label>
      <div className={cn(styles.valueContainer)}>
        {utils.formatNumber(data?.[id])}
      </div>
    </>
  );
};

export default Com;
