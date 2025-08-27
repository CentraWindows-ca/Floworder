import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";
import OverlayWrapper from "components/atom/OverlayWrapper";
import Tooltip from "components/atom/Tooltip";
import HoverPopover from "components/atom/HoverPopover";

// styles
import styles from "./styles.module.scss";

import { LocalDataContext } from "./LocalDataProvider";

// const AddOnSelector = ({}) => {
//   const { data, addonGroup, isInAddOnGroup } = useContext(LocalDataContext);

//   if (!isInAddOnGroup || !addonGroup.parent) {
//     return null;
//   }

//   const { onRoute } = useContext(GeneralContext);

//   const handleSwitch = (masterId) => {
//     onRoute({ masterId });
//   };

//   const { parent, addons } = addonGroup || {};

//   return (
//     <>
//       <div className={cn(styles.addonContainer)}>
//         <table
//           className={cn(
//             styles.addonMainContainer,
//           )}
//           border={0}
//         >
//           <tbody>
//             <tr>
//               <td className={styles.addonCell}>
//                 <div className={cn(styles.addonLabel)}>Parent order</div>
//               </td>
//               <td className={styles.addonCell} colSpan={addons.length}>
//                 <div className={cn(styles.addonLabel)}>
//                   AddOns
//                   <OverlayWrapper
//                     renderTrigger={() => (
//                       <i
//                         className={cn(
//                           styles.addonIconInfo,
//                           "fa-solid fa-circle-info",
//                         )}
//                       />
//                     )}
//                   >
//                     <div className="d-flex align-items-center p-2">
//                       background color{" "}
//                       <div className={cn(styles.addonIcon)}></div> means
//                       inherited data from {parent.m_WorkOrderNo}
//                     </div>
//                   </OverlayWrapper>
//                 </div>
//               </td>
//             </tr>
//             <tr>
//               <td
//                 className={cn(
//                   styles.addonCell,
//                   styles.addonParent,
//                   parent?.m_MasterId === data?.m_MasterId ? styles.active : "",
//                 )}
//                 onClick={() => handleSwitch(parent?.m_MasterId)}
//               >
//                 <div>{parent.m_WorkOrderNo}</div>
//               </td>
//               {addons?.map((a) => {
//                 return (
//                   <td
//                     className={cn(
//                       styles.addonCell,
//                       styles.addonItem,
//                       a?.m_MasterId === data?.m_MasterId ? styles.active : "",
//                     )}
//                     onClick={() => handleSwitch(a?.m_MasterId)}
//                     key={a.m_MasterId}
//                   >
//                     <div>{a.m_WorkOrderNo}</div>
//                   </td>
//                 );
//               })}
//             </tr>
//           </tbody>
//         </table>
//       </div>
//     </>
//   );
// };

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

  const _renderList = _.orderBy(
    [parent, ...addons],
    ["isParent", "isUnlinked"],
    ["desc", "asc"],
  );

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
        onClick={() => handleSwitch(m_MasterId)}
      >
        <HoverPopover
          trigger={
            <div key={m_MasterId}>
              <img src="/linked.svg" className={styles.addonIcon} />
              <span className={styles.addonLabel}>
                {m_WorkOrderNo}
                <span className={cn(styles.addonBadge)}>Add-on</span>
              </span>
            </div>
          }
          className={cn(styles.addonItemPopoverTrigger)}
        >
          <div className={styles.addonHoverPopover} style={{ width: 380 }}>
            <img src="/linked.svg" className={styles.addonIcon} />{" "}
            <b>Linking Add-on</b>
            <hr />
            This add-on ({m_WorkOrderNo}) <b>is linking</b> with the parent
            order ({parent?.m_WorkOrderNo})
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
            <div>
              <img src="/unlinked.svg" className={styles.addonIcon} />
              <span className={styles.addonLabel}>
                {m_WorkOrderNo}
                <span className={cn(styles.addonBadge)}>Add-on</span>
              </span>
            </div>
          }
        >
          <div className={styles.addonHoverPopover} style={{ width: 380 }}>
            <img src="/unlinked.svg" className={styles.addonIcon} />{" "}
            <b>Unlinked Add-on</b>
            <hr />
            This add-on ({m_WorkOrderNo}) <b>has been UNLINKED</b> from the
            parent order ({parent?.m_WorkOrderNo})
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

          <div className={cn(styles.addonInfoContainer)}>
            <HoverPopover
              trigger={
                <i
                  className={cn(
                    styles.addonIconInfo,
                    "fa-solid fa-circle-info ms-3",
                  )}
                />
              }
            >
              <div style={{ width: 380 }}>
                <div className={cn(styles.addonBgIcon)} aria-hidden="true" />{" "}
                <b>Fields with light green background</b>
                <hr />
                <span>
                  Indicates add-on fields pulled from parent order (
                  {parent.m_WorkOrderNo})
                </span>
              </div>
            </HoverPopover>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOnSelector;
