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
  ShapesIcon,
  GridIcon,
  WaterResistanceIcon,
  WaterTestingIcon,
  CustomerPickupIcon,
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
    kind: "MASTER",
  },
  {
    label: "Paint Icon",
    icon: () => <PaintIcon />,
    key: "paintIcon",
    kind: "WIN",
  },
  {
    label: "Door Paint Icon",
    icon: () => <DoorPaintIcon />,
    key: "doorPaintIcon",
    kind: "DOOW",
  },
  {
    label: "Capstock Icon",
    icon: () => <CapStockIcon />,
    key: "capstockIcon",
    kind: "WIN",
  },
  {
    label: "Window Miniblind Icon",
    icon: () => <MiniBlindIcon />,
    key: "miniblindIcon",
    kind: "WIN",
  },
  {
    label: "Door Miniblind Icon",
    icon: () => <MiniBlindIcon />,
    key: "miniblindIcon",
    kind: "DOOR",
  },
  {
    label: "Window Engineered Order Icon",
    icon: () => <EngineeredIcon />,
    key: "engineeredOrderIcon",
    kind: "WIN",
  },
  {
    label: "Door Engineered Order Icon",
    icon: () => <EngineeredIcon />,
    key: "engineeredOrderIcon",
    kind: "DOOR",
  },

  {
    label: "Window RBM Icon",
    icon: () => <RbmIcon />,
    key: "rBMIcon",
    kind: "WIN",
  },
  {
    label: "Door RBM Icon",
    icon: () => <RbmIcon />,
    key: "rBMIcon",
    kind: "DOOR",
  },

  {
    label: "Vinyl Wrap Icon",
    icon: () => <VinylWrapIcon />,
    key: "vinylWrapIcon",
    kind: "WIN",
  },

  {
    label: "Window Shapes Requires",
    icon: () => <ShapesIcon />,
    key: "shapesRequires",
    kind: "WIN",
  },
  {
    label: "Door Shapes Requires",
    icon: () => <ShapesIcon />,
    key: "shapesRequires",
    kind: "DOOR",
  },
  {
    label: "Window Grids Required",
    icon: () => <GridIcon />,
    key: "gridsRequired",
    kind: "WIN",
  },
  {
    label: "Door Grids Required",
    icon: () => <GridIcon />,
    key: "gridsRequired",
    kind: "DOOR",
  },
  {
    label: "Water Testing Required",
    icon: () => <WaterTestingIcon />,
    key: "waterTestingRequired",
    kind: "WIN",
  },
  {
    label: "Water Penetration Resistance",
    icon: () => <WaterResistanceIcon />,
    key: "waterResistance",
    kind: "WIN",
  },

  {
    label: "Customer Pick-up",
    icon: () => <CustomerPickupIcon />,
    key: "customerPickup",
    kind: "MASTER",
  },
];

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, kind, onHide } =
    useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnOptionsContainer)}>
      {OPTIONS?.map((a) => {
        const { kind, label, icon, key } = a;
        return (
          <DisplayBlock
            data={data}
            id={`${kind}.${key}`}
            key={`${kind}.${key}`}
          >
            <div>
              <Editable.EF_Checkbox
                id={key}
                value={data?.[kind]?.[key]}
                onChange={(v) => onChange(v, `${kind}.${key}`)}
                disabled={!isEditable}
              />
            </div>
            <label htmlFor={key} className="align-items-center flex gap-1">
              <div className="w-6">{icon()}</div>
              {label}
            </label>
          </DisplayBlock>
        );
      })}
    </div>
  );
};

export default Com;
