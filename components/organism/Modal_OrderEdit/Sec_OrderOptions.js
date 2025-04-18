import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

import Editable from "components/molecule/Editable";

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

const group = "options"

const COMMON_FIELDS = constants.applyField([
  {
    icon: () => <CustomerPickupIcon />,
    id: "m_CustomerPickup",
  },
]);

const WINDOW_FIELDS = constants.applyField([
  {
    icon: () => <RushIcon />,
    id: "w_RushOrder",
  },
  {
    icon: () => <PaintIcon />,
    id: "w_PaintIcon",
  },
  {
    icon: () => <CapStockIcon />,
    id: "w_CapstockIcon",
  },
  {
    icon: () => <MiniBlindIcon />,
    id: "w_MiniblindIcon",
  },
  {
    icon: () => <EngineeredIcon />,
    id: "w_EngineeredIcon",
  },
  {
    icon: () => <RbmIcon />,
    id: "w_RBMIcon",
  },
  {
    icon: () => <VinylWrapIcon />,
    id: "w_VinylWrapIcon",
  },
  {
    icon: () => <ShapesIcon />,
    id: "w_ShapesRequires",
  },
  {
    icon: () => <GridIcon />,
    id: "w_GridsRequired",
  },
  // {
  //   icon: () => <WaterTestingIcon />,
  //   id: "w_WaterTestingRequired",

  //   // NOTE: specific layout. triggered by w_WaterTestingRequired
  //   renderSubItem: (data, onChange, isEditable) => {
  //     if (data?.["w_WaterTestingRequired"] == 1) {
  //       return (
  //         <div className={styles.columnOptionsSubContainer}>
  //           <label>
  //             {
  //               constants.constants_labelMapping["w_WaterPenetrationResistance"]
  //                 .title
  //             }
  //           </label>
  //           <Editable.EF_Input
  //             className="text-right"
  //             type="number"
  //             id={"w_WaterPenetrationResistance"}
  //             value={data?.["w_WaterPenetrationResistance"]}
  //             onChange={(v) => onChange(v, "w_WaterPenetrationResistance")}
  //             disabled={!isEditable}
  //           />
  //         </div>
  //       );
  //     }
  //     return null;
  //   },
  // },
]);
const DOOR_FIELDS = constants.applyField([
  {
    icon: () => <RushIcon />,
    id: "d_RushOrder",
  },
  {
    icon: () => <DoorPaintIcon />,
    id: "d_PaintIcon",
  },
  {
    icon: () => <RbmIcon />,
    id: "d_RBMIcon",
  },
  {
    icon: () => <GridIcon />,
    id: "d_GridsRequired",
  },
  {
    icon: () => <MiniBlindIcon />,
    id: "d_MiniblindIcon",
  },
  {
    icon: () => <EngineeredIcon />,
    id: "d_EngineeredIcon",
  },
  {
    icon: () => <ShapesIcon />,
    id: "d_ShapesRequires",
  },
]);

const Com = ({}) => {
  const { uiOrderType, kind } = useContext(LocalDataContext);

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
      <div className={cn(styles.columnOptionsContainer)}>
        {COMMON_FIELDS?.map((a) => {
          return <Block inputData={a} id={a.id} key={a.id} />;
        })}
      </div>

      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Windows</label>
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
            <label>Doors</label>
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
  const { data, onChange, checkEditable, dictionary } =
    useContext(LocalDataContext);
  let { title, icon, id, renderSubItem } = inputData;
  return (
    <DisplayBlock id={id} key={id}>
      <div>
        <Editable.EF_Checkbox_Yesno
          id={id}
          value={data?.[id]}
          onChange={(v) => onChange(v, id)}
          disabled={!checkEditable({id, group})}
        />
      </div>
      <div>
        <label
          htmlFor={id}
          className="align-items-center flex gap-1"
          style={{
            cursor: checkEditable({id, group}) ? "pointer" : "default",
          }}
        >
          <div className="w-6">{icon()}</div>
          {title}
        </label>
        {typeof renderSubItem === "function"
          ? renderSubItem(data, onChange, checkEditable({id, group}))
          : null}
      </div>
    </DisplayBlock>
  );
};

export default Com;
