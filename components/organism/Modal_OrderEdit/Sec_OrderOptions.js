import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";

import Editable from "components/molecule/Editable";
import LoadingBlock from "components/atom/LoadingBlock";
import {
  RushIcon,
  PaintIcon,
  DoorPaintIcon,
  CapStockIcon,
  MiniBlindIcon,
  EngineeredIcon,
  RbmIcon,
  VinylWrapIcon,
} from "lib/icons";
// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";
import { DisplayBlock } from "./Com";

const OPTIONS = [
  {
    label: "Rush Order",
    icon: () => <RushIcon />,
    key: "rushOrder",
  },
  {
    label: "Paint Icon",
    icon: () => <PaintIcon />,
    key: "paintIcon",
  },
  {
    label: "Door Paint Icon",
    icon: () => <DoorPaintIcon />,
    key: "doorPaintIcon",
  },
  {
    label: "Capstock Icon",
    icon: () => <CapStockIcon />,
    key: "capstockIcon",
  },
  {
    label: "Miniblind Icon",
    icon: () => <MiniBlindIcon />,
    key: "miniblindIcon",
  },
  {
    label: "Engineered Order Icon",
    icon: () => <EngineeredIcon />,
    key: "engineeredOrderIcon",
  },
  {
    label: "RBM Icon",
    icon: () => <RbmIcon />,
    key: "rBMIcon",
  },
  {
    label: "Vinyl Wrap Icon",
    icon: () => <VinylWrapIcon />,
    key: "vinylWrapIcon",
  },
];

const Com = ({ className, ...props }) => {
  const { data, onChange, orderId, isEditable, onHide } =
    useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnOptionsContainer)}>
      {OPTIONS?.map((a) => {
        const { label, icon, key } = a;
        return (
          <DisplayBlock data={data} id={key} key={key}>
            <div>
              <Editable.EF_Checkbox
                id={key}
                options={[]}
                value={data?.[key]}
                onChange={(v) => onChange(v, { key })}
                disabled={!isEditable}
              />
            </div>
            <label htmlFor={key}
            className="flex align-items-center gap-1"
            >
              <div>{icon()}</div>
              {label}
            </label>
          </DisplayBlock>
        );
      })}
    </div>
  );
};

export default Com;
