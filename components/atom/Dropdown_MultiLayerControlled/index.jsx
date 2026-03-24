import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import cn from "classnames";
import styles from "./styles.module.scss";
import { useRef, useState, useCallback } from "react";

const BASIC_LAYER = 1090;

export default function ExampleMenu({
  disabled,
  options,
  className,
  classNamePopup,
  classNameItem,
  title,
  layer = 1,
  hasContainer = true,
}) {
  const internalRef = useRef(null);
  const popupRef = hasContainer ? internalRef : undefined;
  const popupRefTarget = hasContainer ? internalRef?.current : undefined;

  const [rootOpen, setRootOpen] = useState(false);

  // level 1 submenu under root
  const [activeSubmenuKey, setActiveSubmenuKey] = useState(null);

  // level 2 submenu under level 1 submenu
  const [activeSubmenuPath, setActiveSubmenuPath] = useState({});

  const handleRootOpenChange = useCallback((nextOpen) => {
    setRootOpen(nextOpen);

    if (!nextOpen) {
      setActiveSubmenuKey(null);
      setActiveSubmenuPath({});
    }
  }, []);

  const closeAllMenus = useCallback(() => {
    setActiveSubmenuKey(null);
    setActiveSubmenuPath({});
    setRootOpen(false);
  }, []);

  const handleLeafSelect = useCallback(
    (handler) => {
      return (event) => {
        handler?.(event);
        closeAllMenus();
      };
    },
    [closeAllMenus],
  );

  const setLevel2ActiveKey = useCallback((parentKey, childKey) => {
    setActiveSubmenuPath((prev) => {
      if (prev[parentKey] === childKey) return prev;
      return {
        ...prev,
        [parentKey]: childKey,
      };
    });
  }, []);

  const renderLevel3Items = useCallback(
    (items = []) => {
      return items?.map((c, k) => {
        const { className, title, key, onSelect, disabled } = c || {};

        return (
          <DropdownMenu.Item
            key={`${key || title}_${k}`}
            className={cn(styles.classNameItem, classNameItem, className)}
            onSelect={handleLeafSelect(onSelect)}
            disabled={disabled}
          >
            {title}
          </DropdownMenu.Item>
        );
      });
    },
    [classNameItem, handleLeafSelect],
  );

  const renderLevel2Items = useCallback(
    (items = [], parentKey) => {
      return items?.map((b, j) => {
        const { className, title, key, onSelect, options, disabled } = b || {};

        const submenuKey = key || title;
        const hasChildren = !!options?.length;
        const currentLevel2ActiveKey = activeSubmenuPath[parentKey];
        // if its a dropdown with no children, hide it
        if (options && !hasChildren) {
          return null;
        }
        return (
          <DropdownMenu.Sub
            key={`${submenuKey}_${j}`}
            open={currentLevel2ActiveKey === submenuKey}
            onOpenChange={(nextOpen) => {
              if (nextOpen) {
                setLevel2ActiveKey(parentKey, submenuKey);
              }
              // Keep Google-style locked submenu
            }}
          >
            {hasChildren ? (
              <>
                <DropdownMenu.SubTrigger
                  className={cn(styles.item, classNameItem, className)}
                  onPointerMove={() => {
                    if (currentLevel2ActiveKey !== submenuKey) {
                      setLevel2ActiveKey(parentKey, submenuKey);
                    }
                  }}
                  onFocus={() => {
                    if (currentLevel2ActiveKey !== submenuKey) {
                      setLevel2ActiveKey(parentKey, submenuKey);
                    }
                  }}
                  onClick={() => {
                    if (currentLevel2ActiveKey !== submenuKey) {
                      setLevel2ActiveKey(parentKey, submenuKey);
                    }
                  }}
                >
                  {title}
                </DropdownMenu.SubTrigger>

                <DropdownMenu.Portal container={popupRefTarget}>
                  <DropdownMenu.SubContent
                    sideOffset={8}
                    style={{ zIndex: BASIC_LAYER * layer }}
                    className={cn(styles.popupContainer, classNamePopup)}
                  >
                    {renderLevel3Items(options)}
                  </DropdownMenu.SubContent>
                </DropdownMenu.Portal>
              </>
            ) : (
              <DropdownMenu.Item
                className={cn(styles.classNameItem, classNameItem, className)}
                onSelect={handleLeafSelect(onSelect)}
                disabled={disabled}
              >
                {title}
              </DropdownMenu.Item>
            )}
          </DropdownMenu.Sub>
        );
      });
    },
    [
      activeSubmenuPath,
      classNameItem,
      classNamePopup,
      handleLeafSelect,
      layer,
      popupRefTarget,
      renderLevel3Items,
      setLevel2ActiveKey,
    ],
  );

  return (
    <div ref={popupRef} disabled={disabled} className={cn(className)}>
      <DropdownMenu.Root
        open={rootOpen}
        onOpenChange={handleRootOpenChange}
        modal={false}
      >
        <DropdownMenu.Trigger
          asChild
          disabled={disabled}
          style={{ opacity: disabled ? 0.6 : 1 }}
        >
          {title}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal container={popupRefTarget}>
          <DropdownMenu.Content
            sideOffset={2}
            style={{
              zIndex: BASIC_LAYER * layer,
            }}
            className={cn(styles.popupContainer, classNamePopup)}
            align="start"
          >
            {options?.map((a, i) => {
              const { className, title, key, onSelect, options, disabled } =
                a || {};

              const submenuKey = key || title;
              const hasChildren = !!options?.length;

              // if its a dropdown with no children, hide it
              if (options && !hasChildren) {
                return null;
              }

              return (
                <DropdownMenu.Sub
                  key={`${submenuKey}_${i}`}
                  open={activeSubmenuKey === submenuKey}
                  onOpenChange={(nextOpen) => {
                    if (nextOpen) {
                      setActiveSubmenuKey(submenuKey);
                    }
                    // Keep Google-style locked submenu
                  }}
                >
                  {hasChildren ? (
                    <>
                      <DropdownMenu.SubTrigger
                        className={cn(styles.item, classNameItem, className)}
                        onPointerMove={() => {
                          if (activeSubmenuKey !== submenuKey) {
                            setActiveSubmenuKey(submenuKey);
                          }
                        }}
                        onFocus={() => {
                          if (activeSubmenuKey !== submenuKey) {
                            setActiveSubmenuKey(submenuKey);
                          }
                        }}
                        onClick={() => {
                          if (activeSubmenuKey !== submenuKey) {
                            setActiveSubmenuKey(submenuKey);
                          }
                        }}
                      >
                        {title}
                      </DropdownMenu.SubTrigger>

                      <DropdownMenu.Portal container={popupRefTarget}>
                        <DropdownMenu.SubContent
                          sideOffset={8}
                          style={{ zIndex: BASIC_LAYER * layer }}
                          className={cn(styles.popupContainer, classNamePopup)}
                        >
                          {renderLevel2Items(options, submenuKey)}
                        </DropdownMenu.SubContent>
                      </DropdownMenu.Portal>
                    </>
                  ) : (
                    <DropdownMenu.Item
                      className={cn(
                        styles.classNameItem,
                        classNameItem,
                        className,
                      )}
                      onSelect={handleLeafSelect(onSelect)}
                      disabled={disabled}
                    >
                      {title}
                    </DropdownMenu.Item>
                  )}
                </DropdownMenu.Sub>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </div>
  );
}
