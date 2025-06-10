import { useState } from "react";
import cn from "classnames";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import { Nav, Container } from "react-bootstrap";

import { useRouter } from "next/router";

// styles
import styles from "./styles.module.scss";

/**
 * @param defaultTab - default active tab
 * @param {array} tabs - [
 *  {
 * eventKey,
 * title,
 * component: () => {component wants to be in the tab}
 * }
 * ]
 * @param children - will put above the tabs
 *
 */
export default ({
  defaultTab,
  tabs,
  tabName = "tab",
  children,
  renderTool = () => {},
  resetParam,
  ...rest
}) => {
  // const [tab, setTab] = useState(defaultTab);
  const router = useRouter();
  const tab = router?.query?.[tabName] || defaultTab;

  /* 
    NOTE: after we did "redirect /admin/aaa to /aaa" update, we need to handle path base on visual path
    however the question mark query is also part of visual path. need to remove that
  */
  const pathname = router?.asPath?.split("?")?.[0];

  const setTab = (v, e) => {
    const newQuery = {...router.query}
    newQuery[tabName] = v

    resetParam?.forEach(k => {
      delete newQuery[k]
    })

    router.replace(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className={cn("w-full", styles.root)} {...rest}>
      <div
        className={cn(
          "flex-column flex-grow-1 flex",
          styles.tabContainer,
        )}
      >
        <div className={cn(styles.tabs, "justify-content-between flex")}>
          <div className={cn(styles.tabsItemsContainer)}>
            {tabs?.map((a) => {
              const { eventKey, title, component } = a;
              const isActive = eventKey === tab;
              return (
                <span
                  className={cn(styles.tabsItem, isActive ? styles.active : "")}
                  key={eventKey}
                  onClick={() => setTab(eventKey)}
                >
                  {title}
                </span>
              );
            })}
          </div>
          <div className={cn(styles.tabsToolsContainer)}>{renderTool()}</div>
        </div>

        {tabs
          ?.filter((a) => a.component)
          ?.map((a) => {
            const { component, eventKey, ...restA } = a;
            return (
              <div {...restA} key={eventKey} className="flex-grow-1 flex">
                <div className="flex-grow-1 flex p-2">{component}</div>
              </div>
            );
          })}
        <div className="bg-white flex-grow-1">{children}</div>
      </div>
    </div>
  );
};
