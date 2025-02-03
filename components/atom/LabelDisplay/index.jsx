import _ from "lodash";

// TODO: add title if we have more pages
const Com = ({ children }) => {
  // ====== consts
  if (!children) {
    return <span className="text-gray-400">--</span>
  }
  return <>{children}</>;
};
export default Com;
