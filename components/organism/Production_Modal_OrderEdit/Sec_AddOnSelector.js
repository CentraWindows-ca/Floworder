import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";
import HoverPopover from "components/atom/HoverPopover";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

const AddOnSelector = ({}) => {
  const { data, addonGroup, isInAddOnGroup } = useContext(LocalDataContext);

  if (!isInAddOnGroup || !addonGroup.parent) {
    return null;
  }

  const { onRoute } = useContext(GeneralContext);

  const handleSwitch = (masterId) => {
    onRoute({ masterId });
  };

  const { parent, addons } = addonGroup || {};

  const _parentList = [parent];
  const _addonList = addons?.filter((a) => !a.isUnlinked);
  const _unlinkedList = addons?.filter((a) => a.isUnlinked);

  const jsxRenderParent = (a) => {
    const { m_WorkOrderNo, m_MasterId } = a;
    return (
      <div
        className={cn(
          styles.addonItem,
          a?.m_MasterId === data?.m_MasterId ? styles.active : "",
        )}
        onClick={() => handleSwitch(m_MasterId)}
        key={m_MasterId}
      >
        <span className={styles.addonLabel}>
          {m_WorkOrderNo}
          <span className={cn(styles.addonBadge, styles.addonBadge_parent)}>
            Parent
          </span>
        </span>
      </div>
    );
  };

  const jsxRenderAddon = (a) => {
    const { m_WorkOrderNo, m_MasterId } = a;
    return (
      <div
        className={cn(
          styles.addonItem,
          a?.m_MasterId === data?.m_MasterId ? styles.active : "",
        )}
        key={m_MasterId}
        onClick={() => handleSwitch(m_MasterId)}
      >
        <HoverPopover
          trigger={
            <div className="d-flex align-items-center gap-1">
              <img src="/linked.svg" className={styles.addonIcon} />
              <span className={styles.addonLabel}>{m_WorkOrderNo}</span>
              <div className={cn(styles.addonBadge)}>Add-on</div>
            </div>
          }
          className={cn(styles.addonItemPopoverTrigger)}
        >
          <div className={styles.addonHoverPopover} style={{ width: 380 }}>
            <img src="/linked.svg" className={styles.addonIcon} />{" "}
            <b>Linked Add-on</b>
            <hr />
            This Add-on ({m_WorkOrderNo}) is linked with the Parent order (
            {parent?.m_WorkOrderNo})
            <hr />
            <div className={cn(styles.addonBgIcon)} aria-hidden="true" />{" "}
            <b>Fields with light green background: </b>
            <span>
              Indicates add-on fields pulled from parent order (
              {parent.m_WorkOrderNo})
            </span>
          </div>
        </HoverPopover>
      </div>
    );
  };

  const jsxRenderAddonUnlinked = (a) => {
    const { m_WorkOrderNo, m_MasterId } = a;
    return (
      <div
        className={cn(
          styles.addonItem,
          a?.m_MasterId === data?.m_MasterId ? styles.active : "",
        )}
        onClick={() => handleSwitch(m_MasterId)}
        key={m_MasterId}
      >
        <HoverPopover
          trigger={
            <div className="d-flex align-items-center gap-1">
              <img src="/unlinked.svg" className={styles.addonIcon} />
              <span className={styles.addonLabel}>{m_WorkOrderNo}</span>
              <div className={cn(styles.addonBadge)}>Add-on</div>
            </div>
          }
        >
          <div className={styles.addonHoverPopover} style={{ width: 380 }}>
            <img src="/unlinked.svg" className={styles.addonIcon} />{" "}
            <b>Unlinked Add-on</b>
            <hr />
            This add-on ({m_WorkOrderNo}) <b>has been UNLINKED</b> from the
            parent order ({parent?.m_WorkOrderNo})
            <hr />
            <div className={cn(styles.addonBgIcon)} aria-hidden="true" />{" "}
            <b>Fields with light green background: </b>
            <span>
              Indicates add-on fields pulled from parent order (
              {parent.m_WorkOrderNo})
            </span>
          </div>
        </HoverPopover>
      </div>
    );
  };

  return (
    <>
      <div className={cn(styles.addonContainer)}>
        <div className={cn(styles.addonMainContainer, "")}>
          <div
            className={cn(
              styles.addonListContainer,
              styles.addonListContainer_parent,
            )}
          >
            {_parentList?.map((a) => jsxRenderParent(a))}
          </div>
          <div
            className={cn(
              styles.addonListContainer,
              styles.addonListContainer_addon,
            )}
          >
            {_addonList?.map((a) => jsxRenderAddon(a))}
          </div>
          <div
            className={cn(
              styles.addonListContainer,
              styles.addonListContainer_unlinked,
            )}
          >
            {_unlinkedList?.map((a) => jsxRenderAddonUnlinked(a))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOnSelector;
