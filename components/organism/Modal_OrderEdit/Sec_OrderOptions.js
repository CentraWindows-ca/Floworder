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
    label: "Window Rush Order",
    icon: () => <RushIcon />,
    key: "w_RushOrder",
  },
  {
    label: "Door Rush Order",
    icon: () => <RushIcon />,
    key: "d_RushOrder",
  },
  {
    label: "Window Paint Icon",
    icon: () => <PaintIcon />,
    key: "w_PaintIcon",
  },
  {
    label: "Door Paint Icon",
    icon: () => <DoorPaintIcon />,
    key: "d_PaintIcon",
  },
  {
    label: "Capstock Icon",
    icon: () => <CapStockIcon />,
    key: "w_CapstockIcon",
  },
  {
    label: "Window Miniblind Icon",
    icon: () => <MiniBlindIcon />,
    key: "w_MiniblindIcon",
  },
  {
    label: "Window Engineered Order Icon",
    icon: () => <EngineeredIcon />,
    key: "w_EngineeredIcon",
  },

  {
    label: "Window RBM Icon",
    icon: () => <RbmIcon />,
    key: "w_RBMIcon",
  },
  {
    label: "Door RBM Icon",
    icon: () => <RbmIcon />,
    key: "d_RBMIcon",
  },
  {
    label: "Vinyl Wrap Icon",
    icon: () => <VinylWrapIcon />,
    key: "w_VinylWrapIcon",
  },
  {
    label: "Window Shapes Requires",
    icon: () => <ShapesIcon />,
    key: "w_ShapesRequires",
  },
  {
    label: "Window Grids Required",
    icon: () => <GridIcon />,
    key: "w_GridIcon",
  },
  {
    label: "Door Grids Required",
    icon: () => <GridIcon />,
    key: "d_GridIcon",
  },
  {
    label: "Water Testing Required",
    icon: () => <WaterTestingIcon />,
    key: "w_WaterTestingRequired",
  },
  {
    label: "Water Penetration Resistance",
    icon: () => <WaterResistanceIcon />,
    key: "w_WaterPenetrationResistance",
  },

  {
    label: "Customer Pick-up",
    icon: () => <CustomerPickupIcon />,
    key: "m_CustomerPickup",
  },
];

const Com = ({ className, ...props }) => {
  const { data, onChange, isEditable, kind, onHide } =
    useContext(LocalDataContext);

  return (
    <div className={cn(styles.columnOptionsContainer)}>
      {OPTIONS?.map((a) => {
        const { label, icon, key } = a;
        return (
          <DisplayBlock
            data={data}
            id={key}
            key={key}
          >
            <div>
              <Editable.EF_Checkbox
                id={key}
                value={data?.[key]}
                onChange={(v) => onChange(v, key)}
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
