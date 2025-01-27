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
import { DisplayBlock, displayFilter } from "./Com";

const COMMON_ITEMS = [
  {
    label: "Customer Pick-up",
    icon: () => <CustomerPickupIcon />,
    id: "m_CustomerPickup",
  },
];

const WINDOW_ITEMS = [
  {
    label: "Window Rush Order",
    icon: () => <RushIcon />,
    id: "w_RushOrder",
  },
  {
    label: "Window Paint Icon",
    icon: () => <PaintIcon />,
    id: "w_PaintIcon",
  },
  {
    label: "Capstock Icon",
    icon: () => <CapStockIcon />,
    id: "w_CapstockIcon",
  },
  {
    label: "Window Miniblind Icon",
    icon: () => <MiniBlindIcon />,
    id: "w_MiniblindIcon",
  },
  {
    label: "Window Engineered Order Icon",
    icon: () => <EngineeredIcon />,
    id: "w_EngineeredIcon",
  },
  {
    label: "Window RBM Icon",
    icon: () => <RbmIcon />,
    id: "w_RBMIcon",
  },
  {
    label: "Vinyl Wrap Icon",
    icon: () => <VinylWrapIcon />,
    id: "w_VinylWrapIcon",
  },
  {
    label: "Window Shapes Requires",
    icon: () => <ShapesIcon />,
    id: "w_ShapesRequires",
  },
  {
    label: "Window Grids Required",
    icon: () => <GridIcon />,
    id: "w_GridIcon",
  },
  {
    label: "Window Water Testing Required",
    icon: () => <WaterTestingIcon />,
    id: "w_WaterTestingRequired",
  },
  {
    label: "Water Penetration Resistance",
    icon: () => <WaterResistanceIcon />,
    id: "w_WaterPenetrationResistance",
  },
];
const DOOR_ITEMS = [
  {
    label: "Door Rush Order",
    icon: () => <RushIcon />,
    id: "d_RushOrder",
  },
  {
    label: "Door Paint Icon",
    icon: () => <DoorPaintIcon />,
    id: "d_PaintIcon",
  },
  {
    label: "Door RBM Icon",
    icon: () => <RbmIcon />,
    id: "d_RBMIcon",
  },
  {
    label: "Door Grids Required",
    icon: () => <GridIcon />,
    id: "d_GridIcon",
  },
  {
    label: "Door Water Testing Required",
    icon: () => <WaterTestingIcon />,
    id: "d_WaterTestingRequired",
  },
];

const Com = ({ className, ...props }) => {
  const { uiOrderType, data, onChange, isEditable, kind, onHide } =
    useContext(LocalDataContext);

  const [doorInputs, setDoorInputs] = useState(null);
  const [windowInputs, setWindowInputs] = useState(null);

  useEffect(() => {
    setDoorInputs(
      displayFilter(DOOR_ITEMS, {
        kind,
        uiOrderType,
      }),
    );

    setWindowInputs(
      displayFilter(WINDOW_ITEMS, {
        kind,
        uiOrderType,
      }),
    );
  }, [kind, uiOrderType]);


  
  return (
    <>
      <div className={cn(styles.columnOptionsContainer)}>
        {COMMON_ITEMS?.map((a) => {
          return <Block inputData={a} id={a.key} key={a.key} />;
        })}
      </div>

      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label className="text-sky-600">Window</label>
          </div>
          <div className={cn(styles.columnOptionsContainer)}>
            {windowInputs?.map((a) => {
              return <Block key={a.id} inputData={a} />;
            })}
          </div>
        </>
      )}

      {!_.isEmpty(doorInputs) && (
        <>
          <div className={styles.subTitle}>
            <label className="text-sky-600">Door</label>
          </div>
          <div className={cn(styles.columnOptionsContainer)}>
            {doorInputs?.map((a) => {
              return <Block key={a.id} inputData={a} />;
            })}
          </div>
        </>
      )}
    </>
  );
};

const Block = ({ inputData }) => {
  const { data, onChange, isEditable, dictionary } =
    useContext(LocalDataContext);
  let { label, icon, id } = inputData;
  return (
    <DisplayBlock id={id} key={id}>
      <div>
        <Editable.EF_Checkbox
          id={id}
          value={data?.[id]}
          onChange={(v) => onChange(v, id)}
          disabled={!isEditable}
        />
      </div>
      <label htmlFor={id} className="align-items-center flex gap-1">
        <div className="w-6">{icon()}</div>
        {label}
      </label>
    </DisplayBlock>
  );
};

export default Com;
