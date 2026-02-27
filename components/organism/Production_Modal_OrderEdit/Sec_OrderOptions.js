import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

import Editable from "components/molecule/Editable";

import {
  labelMapping,
  applyField,
} from "lib/constants/production_constants_labelMapping";

import {
  RushIcon,
  PaintIcon,
  DoorPaintIcon,
  DoorMultipointIcon,
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

import { LocalDataContext, GeneralContext } from "./LocalDataProvider";
import { DisplayBlock, displayFilter } from "./Com";

const COMMON_FIELDS = applyField([
  {
    icon: () => <CustomerPickupIcon />,
    fieldCode: "m_CustomerPickup",
  },
]);

const WINDOW_FIELDS = applyField([
  {
    icon: () => <RushIcon />,
    fieldCode: "w_RushOrder",
  },
  {
    icon: () => <PaintIcon />,
    fieldCode: "w_PaintIcon",
  },
  {
    icon: () => <CapStockIcon />,
    fieldCode: "w_CapstockIcon",
  },
  {
    icon: () => <MiniBlindIcon />,
    fieldCode: "w_MiniblindIcon",
  },
  {
    icon: () => <EngineeredIcon />,
    fieldCode: "w_EngineeredIcon",
  },
  {
    icon: () => <RbmIcon />,
    fieldCode: "w_RBMIcon",
  },
  {
    icon: () => <VinylWrapIcon />,
    fieldCode: "w_VinylWrapIcon",
  },
  {
    icon: () => <ShapesIcon />,
    fieldCode: "w_ShapesRequires",
  },
  {
    icon: () => <GridIcon />,
    fieldCode: "w_GridsRequired",
  },
  // {
  //   icon: () => <WaterTestingIcon />,
  //   fieldCode: "w_WaterTestingRequired",

  //   // NOTE: specific layout. triggered by w_WaterTestingRequired
  //   renderSubItem: (data, onChange, isEditable, addon) => {
  //     if (data?.["w_WaterTestingRequired"] == 1) {
  //       return (
  //         <div className={styles.columnOptionsSubContainer}>
  //           <label>
  //             {
  //               labelMapping["w_WaterPenetrationResistance"]
  //                 .title
  //             }
  //           </label>
  //           <Editable.EF_Input
  //             className="text-right"
  //             type="number"
  //             fieldCode={"w_WaterPenetrationResistance"}
  //             value={data?.["w_WaterPenetrationResistance"]}
  //             onChange={(v) => onChange(v, "w_WaterPenetrationResistance")}
  //             disabled={!isEditable}
  //             addon = {addon}
  //           />
  //         </div>
  //       );
  //     }
  //     return null;
  //   },
  // },
]);
const DOOR_FIELDS = applyField([
  {
    icon: () => <RushIcon />,
    fieldCode: "d_RushOrder",
  },
  {
    icon: () => <DoorPaintIcon />,
    fieldCode: "d_PaintIcon",
  },
  !constants.DEV_HOLDING_FEATURES.v20250113_multipoint
    ? {
        icon: () => <DoorMultipointIcon />,
        fieldCode: "d_MultipointFlag",
      }
    : null,
  {
    icon: () => <MiniBlindIcon />,
    fieldCode: "d_MiniblindIcon",
  },
  {
    icon: () => <EngineeredIcon />,
    fieldCode: "d_EngineeredIcon",
  },
  {
    icon: () => <RbmIcon />,
    fieldCode: "d_RBMIcon",
  },
  {
    icon: () => <ShapesIcon />,
    fieldCode: "d_ShapesRequires",
  },
  {
    icon: () => <GridIcon />,
    fieldCode: "d_GridsRequired",
  },
]);

const Com = ({}) => {
  const { permissions } = useContext(GeneralContext);
  const { uiOrderType, kind } = useContext(LocalDataContext);

  const [doorInputs, setDoorInputs] = useState(null);
  const [windowInputs, setWindowInputs] = useState(null);

  useEffect(() => {
    setDoorInputs(
      displayFilter(DOOR_FIELDS, {
        kind,
        uiOrderType,
        permissions,
      }),
    );

    setWindowInputs(
      displayFilter(WINDOW_FIELDS, {
        kind,
        uiOrderType,
        permissions,
      }),
    );
  }, [kind, uiOrderType]);

  return (
    <>
      <div className={cn(styles.columnOptionsContainer)}>
        {COMMON_FIELDS?.map((a) => {
          return <Block inputData={a} key={a.fieldCode} />;
        })}
      </div>

      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Windows</label>
          </div>
          <div className={cn(styles.columnOptionsContainer)}>
            {windowInputs?.map((a) => {
              return <Block key={a.fieldCode} inputData={a} />;
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
              return <Block key={a.fieldCode} inputData={a} />;
            })}
          </div>
        </>
      )}
    </>
  );
};

const Block = ({ inputData }) => {
  const {
    data,
    initData,
    onChange,
    checkEditable,
    checkAddOnField,
    validationResult,
    dictionary,
  } = useContext(LocalDataContext);
  let { title, icon, fieldCode, renderSubItem } = inputData;

  const field = fieldCode

  const addon = checkAddOnField({ id: fieldCode });
  const addonClass = addon?.isSyncedFromParent ? styles.addonSync_input : "";
  return (
    <DisplayBlock fieldCode={fieldCode} key={field}>
      <div>
        <Editable.EF_Checkbox_Yesno
          id={field}
          value={data?.[field]}
          initValue={initData?.[field]}
          isHighlightDiff
          onChange={(v) => onChange(v, field)}
          disabled={!checkEditable({ fieldCode })}
          errorMessage={validationResult?.[field]}
          className={cn(addonClass)}
        />
      </div>
      <div
        className={cn(addon?.isSyncedFromParent ? styles.addonSync_option : "")}
      >
        <label
          htmlFor={field}
          className="align-items-center flex gap-1"
          style={{
            cursor: checkEditable({ fieldCode }) ? "pointer" : "default",
          }}
        >
          <div className="w-6">{icon()}</div>
          {title}
        </label>
        {typeof renderSubItem === "function"
          ? renderSubItem(data, onChange, checkEditable({ fieldCode }), addon)
          : null}
      </div>
    </DisplayBlock>
  );
};

export default Com;
