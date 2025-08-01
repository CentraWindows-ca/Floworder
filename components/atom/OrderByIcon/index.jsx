import _ from "lodash";
import cn from "classnames";
// styles
import styles from "./styles.module.scss";

const Com = ({ orderBy, col, ...props }) => {
  const {sortBy, dir} = orderBy || {};

  let iconClass = "";
  if (sortBy !== col) {
    iconClass = cn("fa-solid fa-sort text-slate-300");
  } else if (dir === "asc") {
    iconClass = cn("fa-solid fa-sort-up", styles.iconActive);
  } else {
    iconClass = cn("fa-solid fa-sort-down", styles.iconActive);
  }

  return (
    <span className={cn(styles.sortIcon)} {...props}>
      <div
        className={cn("inline-block")}
        style={{
          position: "relative",
          width: "8px",
          height: "12px",
          verticalAlign: "middle",
        }}
      >
        <i
          className={cn("fa-solid fa-sort text-slate-200")}
          style={{
            fontSize: "12px",
            position: "absolute",

            right: "0px",
          }}
        />
        <i
          className={cn(iconClass, styles.iconBehind)}
          style={{
            fontSize: "12px",
            position: "absolute",

            right: "0px",
          }}
        />
      </div>
    </span>
  );
};
export default Com;
