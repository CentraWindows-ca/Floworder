import { useContext  } from "react";
import { GeneralContext } from "lib/provider/GeneralProvider";

export default ({ featureCode, op, children }) => {
  const { checkPermission } = useContext(GeneralContext);
  if (!checkPermission(featureCode, op)) return null;

  return children;
};
