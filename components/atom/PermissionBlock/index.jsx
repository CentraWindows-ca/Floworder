import { useContext  } from "react";
import { GeneralContext } from "lib/provider/GeneralProvider";

export default ({ featureCode, children }) => {
  const { checkPermission } = useContext(GeneralContext);
  if (!checkPermission(featureCode)) return null;

  return children;
};
