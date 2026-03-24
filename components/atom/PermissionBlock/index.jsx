import { useContext, useCallback } from "react";
import { GeneralContext } from "lib/provider/GeneralProvider";

export default ({
  featureCode,
  featureCodeGroup,
  op,
  isHidden,
  children,
  render,
  isValidationInactive = false, // for testing purpose. sometimes we need to show it anyway
}) => {
  if (isValidationInactive) return children;
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

export const useCheckPermissionBlock = () => {
  // check permission
  const { checkPermission, permissions } = useContext(GeneralContext);
  const getIsShowByPermission = useCallback(
    ({
      featureCode,
      featureCodeGroup,
      op,
      isHidden,
      render,
      isValidationInactive = false, // for testing purpose. sometimes we need to show it anyway
    }) => {
      if (isValidationInactive) return true;
      if (isHidden) return false;

      // doesnt check permission. only use it like a filter
      if (!featureCode && !featureCodeGroup) return true;

      const isAllow = checkPermission({ featureCode, featureCodeGroup, op });

      if (render) {
        return render(isAllow);
      } else {
        return isAllow;
      }
    },
    [checkPermission, permissions],
  );

  return {
    getIsShowByPermission,
  };
};
