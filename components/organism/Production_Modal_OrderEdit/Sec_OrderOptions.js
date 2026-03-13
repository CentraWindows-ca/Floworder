import React, { useState, useEffect, useContext, useCallback } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";

import Editable from "components/molecule/Editable";

import {
  labelMapping,
  applyField,
  spreadFacilities,
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

import {
  LocalDataContext,
  LocalDataContext_data,
  GeneralContext,
} from "./LocalDataProvider";
import { DisplayBlock, displayFilter } from "./Com";

const COMMON_FIELDS = applyField([
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <CustomerPickupIcon />,
    fieldCode: "m_CustomerPickup",
  },
]);

const WINDOW_FIELDS = applyField([
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <RushIcon />,
    fieldCode: "w_RushOrder",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <PaintIcon />,
    fieldCode: "w_PaintIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <CapStockIcon />,
    fieldCode: "w_CapstockIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <MiniBlindIcon />,
    fieldCode: "w_MiniblindIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <EngineeredIcon />,
    fieldCode: "w_EngineeredIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <RbmIcon />,
    fieldCode: "w_RBMIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <VinylWrapIcon />,
    fieldCode: "w_VinylWrapIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <ShapesIcon />,
    fieldCode: "w_ShapesRequires",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
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
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <RushIcon />,
    fieldCode: "d_RushOrder",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <DoorPaintIcon />,
    fieldCode: "d_PaintIcon",
  },
  !constants.DEV_HOLDING_FEATURES.v20250113_multipoint
    ? {
        Component: Editable.EF_Checkbox_Yesno,
        icon: () => <DoorMultipointIcon />,
        fieldCode: "d_MultipointFlag",
      }
    : null,
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <MiniBlindIcon />,
    fieldCode: "d_MiniblindIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <EngineeredIcon />,
    fieldCode: "d_EngineeredIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <RbmIcon />,
    fieldCode: "d_RBMIcon",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <ShapesIcon />,
    fieldCode: "d_ShapesRequires",
  },
  {
    Component: Editable.EF_Checkbox_Yesno,
    icon: () => <GridIcon />,
    fieldCode: "d_GridsRequired",
  },
]);

const Com = ({}) => {
  const { permissions } = useContext(GeneralContext);
  const { uiOrderType, kind, initData, initWithOriginalStructure } =
    useContext(LocalDataContext);

  const [doorInputs, setDoorInputs] = useState(null);
  const [windowInputs, setWindowInputs] = useState(null);
  const [masterInputs, setMasterInputs] = useState(null);

  useEffect(() => {
    let _doorFields = displayFilter(DOOR_FIELDS, {
      kind,
      uiOrderType,
      permissions,
      initWithOriginalStructure,
    });
    // spread to different facilities [{facility: "", fields: [], facilityRoleType: ""}]
    _doorFields = spreadFacilities(
      _doorFields,
      initWithOriginalStructure,
    )?.facilities;
    setDoorInputs(_doorFields);

    let _windowFields = displayFilter(WINDOW_FIELDS, {
      kind,
      uiOrderType,
      permissions,
      initWithOriginalStructure,
    });
    _windowFields = spreadFacilities(
      _windowFields,
      initWithOriginalStructure,
    )?.facilities;
    setWindowInputs(_windowFields);

    const _masterFields = spreadFacilities(
      COMMON_FIELDS,
      initWithOriginalStructure,
    )?.master;
    setMasterInputs(_masterFields);
  }, [kind, uiOrderType]);

  return (
    <>
      <div className={cn(styles.columnOptionsContainer)}>
        {masterInputs?.map((a) => {
          return <Block inputData={a} key={a.fieldCode} />;
        })}
      </div>

      {!_.isEmpty(windowInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Windows</label>
          </div>
          {windowInputs?.map((fac) => {
            const { facility, fields } = fac;
            return (
              <React.Fragment key={`w_${facility}`}>
                <div className={cn(styles.columnFacility)}>
                  <span>{facility}</span>
                </div>
                <div className={cn(styles.columnOptionsContainer)}>
                  {fields?.map((a) => {
                    return <Block key={a.field} inputData={a} />;
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </>
      )}
      {!_.isEmpty(doorInputs) && (
        <>
          <div className={styles.subTitle}>
            <label>Doors</label>
          </div>
          {doorInputs?.map((fac) => {
            const { facility, fields } = fac;
            return (
              <React.Fragment key={`d_${facility}`}>
                <div className={cn(styles.columnFacility)}>
                  <span>{facility}</span>
                </div>
                <div className={cn(styles.columnOptionsContainer)}>
                  {fields?.map((a) => {
                    return <Block key={a.field} inputData={a} />;
                  })}
                </div>
              </React.Fragment>
            );
          })}
        </>
      )}
    </>
  );
};

const Block = React.memo(
  ({ inputData }) => {
    const { data, validationResult } = useContext(LocalDataContext_data);
    const { initData, onChange, checkEditable, checkAddOnField } =
      useContext(LocalDataContext);
    let { title, icon, fieldCode, field, renderSubItem } = inputData;

    const addon = checkAddOnField({ id: fieldCode });
    const addonClass = addon?.isSyncedFromParent ? styles.addonSync_input : "";

    const handleBlockChange = useCallback((v) => {
      onChange(v, field);
    }, []);

    return (
      <DisplayBlock blockId={fieldCode} key={field}>
        <div>
          <Editable.EF_Checkbox_Yesno
            id={field}
            value={data?.[field]}
            initValue={initData?.[field]}
            isHighlightDiff
            onChange={handleBlockChange}
            disabled={!checkEditable({ fieldCode })}
            errorMessage={validationResult?.[field]}
            className={cn(addonClass)}
          />
        </div>
        <div
          className={cn(
            addon?.isSyncedFromParent ? styles.addonSync_option : "",
          )}
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
          {/* {typeof renderSubItem === "function"
            ? renderSubItem(data, onChange, checkEditable({ fieldCode }), addon)
            : null} */}
        </div>
      </DisplayBlock>
    );
  },
  (prev, nex) => {
    return (
      prev.data === nex.data &&
      prev.inputData.renderSubItem === nex.inputData.renderSubItem
    );
  },
);


export default React.memo(Com);
