import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import cn from "classnames";
import styles from "./styles.module.scss";
import { useRef } from "react";

const BASIC_LAYER = 1090

export default function ExampleMenu({
  disabled,
  options,
  className,
  classNamePopup,
  classNameItem,
  title,
  layer = 1
}) {

  const popupRef = useRef(null);
  return (
    <div ref={popupRef} className={cn(className)}>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger
          asChild
          disabled={disabled}
          style={{ opacity: disabled ? 0.6 : 1 }}
        >
          {title}
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal container={popupRef.current}>
          <DropdownMenu.Content
            sideOffset={2}
            // side="right"
            style={{
              zIndex: BASIC_LAYER * layer,
            }}
            className={classNamePopup}
          >
            {options?.map((a) => {
              const { className, title, key, onSelect, fieldCode, options, onClick } =
                a || {};
              return (
                <DropdownMenu.Sub key={key || title}>
                  {options?.length ? (
                    <>
                      <DropdownMenu.SubTrigger className={cn(styles.item, className)}>
                        {title}
                      </DropdownMenu.SubTrigger>
                      <DropdownMenu.Portal container={popupRef.current}>
                        <DropdownMenu.SubContent sideOffset={10} style={{ zIndex: BASIC_LAYER * layer, }} className={classNamePopup}>
                          {options?.map((b) => {
                            const { className,title, key, onSelect, fieldCode, options } =
                              b;
                            return (
                              <DropdownMenu.Item
                                key={key || title}
                                className={styles.classNameItem}
                                onSelect={onSelect}
                              >
                                {title}
                              </DropdownMenu.Item>
                            );
                          })}{" "}
                        </DropdownMenu.SubContent>
                      </DropdownMenu.Portal>
                    </>
                  ) : (
                    <DropdownMenu.Item
                      className={cn(styles.classNameItem, className)}
                      onSelect={onSelect}
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
