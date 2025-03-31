import { useContext  } from "react";
import { GeneralContext } from "lib/provider/GeneralProvider";

export default ({ featureCode, op, isHidden, children }) => {
  if (isHidden) return null

    // doesnt check permission. only use it like a filter
  if (!featureCode) return children

  // check permission
  const { checkPermission } = useContext(GeneralContext);
  if (!checkPermission(featureCode, op)) return null;

  return children;
};
