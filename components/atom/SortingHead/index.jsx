import React, { useState, useEffect } from "react";
import cn from "classnames";

// styles
import styles from "./styles.module.scss";

const Component = ({ targetParam = 'data-sortid', isAlwaysShowDir = false, className, children, orderBy, dir, onChange,...rest }) => {

  const modifyTh = (child, index) => {
    // Add your desired modifications to each <th> element
    const childId = child.props[targetParam]
    if (!childId) return child

    const onClickHandler = () => {
      const newOrderBy = childId
      let newDir
      if (childId !== orderBy) {
        // if not sort by, desc
        newDir = 'desc'
      } else {
        // revert
        newDir = dir === 'desc' ? 'asc': 'desc'
      }

      onChange([newOrderBy, newDir])
    } 

    const sortDirection = <OrderByIcon orderBy = {[orderBy, dir]} col={childId}/>
    let showDir = isAlwaysShowDir || (orderBy === childId)

    return React.cloneElement(child, { 
      onClick: onClickHandler ,
      className: child.props.className + " " + 'cursor-pointer',
      children: (
        showDir ? <div className="flex justify-content-between"><div>{child.props.children}</div><div>{sortDirection}</div></div> : child.props.children
      ),
    });
  };

  return <>{React.Children.map(children, (child, index) => modifyTh(child, index))}</>;
};

const OrderByIcon = ({ orderBy, col }) => {
  const [curr_col, dir] = orderBy;

  let iconClass = "";

  if (curr_col !== col) {
    iconClass = "fa-solid fa-sort text-slate-300";
  } else if (dir === "asc") {
    iconClass = "fa-solid fa-sort-up text-blue-600";
  } else {
    iconClass = "fa-solid fa-sort-down text-blue-600";
  }

  return (
    <div
      className={cn("inline-block")}
      style={{ position: "relative", width: "14px", height: "14px", verticalAlign: "middle" }}
      title={`sort this column`}
    >
      <i
        className={cn("fa-solid fa-sort text-slate-200")}
        style={{ fontSize: "14px", position: "absolute", left: "0px", right: "0px" }}
      />
      <i
        className={cn("hover:text-orange-600", iconClass)}
        style={{ fontSize: "14px", position: "absolute", left: "0px", right: "0px" }}
      />
    </div>
  );
};

export default Component;
