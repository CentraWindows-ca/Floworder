import React, { useContext, useState } from "react";
import cn from "classnames";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider";
import OverlayWrapper from "components/atom/OverlayWrapper";

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

  return (
    <>
      <div className={cn(styles.addonContainer)}>
        <div
          className={cn(
            styles.addonMainContainer,
            parent?.m_MasterId === data?.m_MasterId
              ? styles.isAddonOnParent
              : "",
          )}
        >
          <span className={cn(styles.addonLabel, "me-2")}>Add-Ons:</span>
          <div className={cn(styles.addonListContainer)}>
            {addons?.map((a) => {
              return (
                <div
                  className={cn(
                    styles.addonItem,
                    a?.m_MasterId === data?.m_MasterId ? styles.active : "",
                  )}
                  onClick={() => handleSwitch(a?.m_MasterId)}
                >
                  {a.m_WorkOrderNo}
                </div>
              );
            })}
          </div>

          <div
            className={cn(
              styles.addonParent,
              parent?.m_MasterId === data?.m_MasterId ? styles.active : "",
            )}
            onClick={() => handleSwitch(parent?.m_MasterId)}
          >
            <span className={cn(styles.addonLabel, "")}>
              {/* <i
                    className={cn("fas fa-box me-1", styles.addonParentIcon)}
                  /> */}
              Parent order:
            </span>
            {parent.m_WorkOrderNo}
            <OverlayWrapper
              renderTrigger={() => (
                <i
                  className={cn(
                    styles.addonIconInfo,
                    "fa-solid fa-circle-info ms-2",
                  )}
                />
              )}
            >
              <div className="d-flex align-items-center p-2">
                background color <div className={cn(styles.addonIcon)}></div>{" "}
                means inherited data from {parent.m_WorkOrderNo}
              </div>
            </OverlayWrapper>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddOnSelector;
