import _ from "lodash";

const Com = ({ children }) => {
  // ====== consts
  if (!children) {
    return <span className="text-gray-400">--</span>
  }
  return <>{children}</>;
};
export default Com;
