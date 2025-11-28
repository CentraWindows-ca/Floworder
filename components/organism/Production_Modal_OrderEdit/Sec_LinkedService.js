import React, { useState, useEffect, useContext } from "react";
import cn from "classnames";
import _ from "lodash";
import constants from "lib/constants";
import {
  labelMapping,
  applyField,
} from "lib/constants/production_constants_labelMapping";

import { getIsRequired } from "./hooks/vconfig";
import { Block } from "./Com";

import Editable from "components/molecule/Editable";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

import { DisplayBlock, displayFilter } from "./Com";
import { PORTAL_WEBCAL } from "lib/api/SERVER";

const COMMON_FIELDS_LOCKOUT = applyField([
  {
    id: "lo_displayName",
    title: "Lockout Number",
    Component: Editable.EF_Renderer,
    disabled: true,
    isHighlightDiff: false,
    renderValue: (v, data, context) => {
      return (
        <div
          style={{ width: 140, height: 34 }}
          className="d-flex align-items-center justify-content-center"
        >
          <a
            href={`${PORTAL_WEBCAL}/?page=month&work-order-number=${context?.initDataSiteLockout?.siteLockoutId}&department=service&isLockout=1`}
            target="_blank"
          >
            {context?.initDataSiteLockout?.displayName ||
              `LO_${context?.initDataSiteLockout?.siteLockoutId}` ||
              "--"}{" "}
            <i
              className="fa-solid fa-arrow-up-right-from-square ms-1"
              style={{ fontSize: 11 }}
            ></i>
          </a>
        </div>
      );
    },
  },
  {
    id: "lo_scheduledLockoutDate",
    title: "Schedule Date",
    Component: Editable.EF_DateOnly,
    disabled: true,
    isHighlightDiff: false,
    renderValue: (v, data, context) => {
      return context?.initDataSiteLockout?.scheduledLockoutDate;
    },
  },
]);

const COMMON_FIELDS_SERVICE = applyField([
  {
    id: "serviceId",
    title: "Service number",
    Component: Editable.EF_Renderer,
    disabled: true,
    isHighlightDiff: false,
    renderValue: (v, data, context) => {
      return (
        <div
          style={{ width: 140, height: 34 }}
          className="d-flex align-items-center justify-content-center"
        >
          <a
            href={`${PORTAL_WEBCAL}/?page=month&work-order-number=${data?.serviceId}&department=service`}
            target="_blank"
          >
            {`Service#${data?.serviceId}` || "--"}{" "}
            <i
              className="fa-solid fa-arrow-up-right-from-square ms-1"
              style={{ fontSize: 11 }}
            ></i>
          </a>
        </div>
      );
    },
  },
  // {
  //   id: "windowProductionStartDate",
  //   title: "Production Date",
  //   Component: Editable.EF_DateOnly,
  //   disabled: true,
  //   isHighlightDiff: false,
  //   renderValue: (v, data, context) => {
  //     return data?.windowProductionStartDate;
  //   },
  // },
]);

const Com = ({}) => {
  const { initDataSiteLockout, initDataService } =
    useContext(LocalDataContext);

  if (!initDataSiteLockout && !initDataService) return null;

  return (
    <div className={cn(styles.serviceAndSiteLockoutContainer)}>
      {initDataSiteLockout && (
        <>
          <div className={cn(styles.sectionTitle)}>
            <span>
              <i className="fa-solid fa-building-lock me-2"></i>
              Linked Site Lockout
            </span>
          </div>
          <div id="sitelockout" className={cn(styles.collapseContainer)}>
            <div className={cn(styles.columnScheduledContainer)}>
              {COMMON_FIELDS_LOCKOUT?.map((a) => {
                const { title, id } = a;
                return (
                  <DisplayDate key={id} {...a} data={initDataSiteLockout} />
                );
              })}
            </div>
          </div>
        </>
      )}
      {initDataService && (
        <>
          <div className={cn(styles.sectionTitle)}>
            <span>
              <i className="fa-solid fa-toolbox me-2"></i> Linked Service
            </span>
          </div>
          <div id="service" className={cn(styles.collapseContainer)}>
            {initDataService?.map((service) => {
              const { serviceId } = service;
              return (
                <div
                  className={cn(styles.columnScheduledContainer)}
                  key={serviceId}
                >
                  {COMMON_FIELDS_SERVICE?.map((a) => {
                    const { title, id } = a;
                    return <DisplayDate key={id} {...a} data={service} />;
                  })}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

const DisplayDate = (props) => {
  const { id, displayId, title, Component, className, data, ...rest } = props;

  if (Component) {
    return (
      <Block
        className_input={cn(
          styles.columnScheduledInput,
          "justify-content-end align-items-center flex",
        )}
        inputData={props}
        data={data}
        {...rest}
      />
    );
  }
};

export default Com;
