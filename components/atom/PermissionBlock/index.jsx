import { useContext } from "react";
import { GeneralContext } from "lib/provider/GeneralProvider";

export default ({
  featureCode,
  featureCodeGroup,
  op,
  isHidden,
  children,
  render,
}) => {
  if (isHidden) return null;

  // doesnt check permission. only use it like a filter
  if (!featureCode && !featureCodeGroup) return children;

  // check permission
  const { checkPermission } = useContext(GeneralContext);

  const isAllow = checkPermission({ featureCode, featureCodeGroup, op });

  if (render) {
    return render(isAllow);
  } else {
    return isAllow ? children : null;
  }
};
