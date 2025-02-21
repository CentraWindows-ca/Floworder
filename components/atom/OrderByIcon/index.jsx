import _ from "lodash";
import cn from "classnames";
// styles
import styles from "./styles.module.scss";

// TODO: add title if we have more pages
const Com = ({ orderBy, col, ...props }) => {
  const {sortBy, dir} = orderBy || {};

  let iconClass = "";
  if (sortBy !== col) {
    iconClass = "fa-solid fa-sort text-slate-300";
  } else if (dir === "asc") {
    iconClass = "fa-solid fa-sort-up text-blue-600";
  } else {
    iconClass = "fa-solid fa-sort-down text-blue-600";
  }

  return (
    <span className={cn(styles.sortIcon)} {...props}>
      <div
        className={cn("inline-block")}
        style={{
          position: "relative",
          width: "8px",
          height: "10px",
          verticalAlign: "middle",
        }}
      >
        <i
          className={cn("fa-solid fa-sort text-slate-200")}
          style={{
            fontSize: "10px",
            position: "absolute",

            right: "0px",
          }}
        />
        <i
          className={cn(iconClass, styles.iconBehind)}
          style={{
            fontSize: "10px",
            position: "absolute",

            right: "0px",
          }}
        />
      </div>
    </span>
  );
};
export default Com;
