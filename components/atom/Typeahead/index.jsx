import React, { useCallback } from "react";
import cn from "classnames";
import { Typeahead, Highlighter } from "react-bootstrap-typeahead";

// styles
import style from "./style";

const SIZES = {
  md: {
    width: "2rem",
  },
  sm: {
    width: "2rem",
    closeStyle: {
      height: "5px",
      width: "5px",
    },
    inputStyle: {
      padding: "0.25rem 0.5rem 0.25rem 0.875rem",
      paddingRight: "30px",
      fontSize: ".875rem",
      lineHeight: "unset",
    },
  },
  xs: {
    inputStyle: {
      paddingRight: "30px",
      fontSize: ".7rem",
      lineHeight: "unset",
      padding: "0.1rem 0.5rem",
      borderRadius: `var(--bs-border-radius-sm)`,
    },
    closeStyle: {
      height: "5px",
      width: "5px",
    },
    width: "1.5rem",
  },
};

/**
 * Typeahead wrapper
 */
export default React.memo(
  style(
    React.forwardRef(
      (
        {
          placeholder = "select...",
          clearButton = true,
          renderPrefix,
          renderSuffix,
          value,
          onChange,
          options = [],
          valueKey = "",
          labelKey = "",
          size = "md",
          inputProps = {},
          className,
          disabled,
          ...rest
        },
        ref,
      ) => {
        const filterBy = (option, state) => {
          if (state.selected.length) {
            return true;
          }
          return (
            option[labelKey].toLowerCase().indexOf(state.text.toLowerCase()) >
            -1
          );
        };

        const selectedValue = options.find((item, i) => {
          if (valueKey) {
            return item[valueKey] === value;
          } else {
            return item === value;
          }
        });

        const handleOnChange = (selected) => {
          const selectedKey = valueKey
            ? selected?.[0]?.[valueKey]
            : selected?.[0];
          onChange(selectedKey, selected);
        };

        const renderMenuItemChildren = (option, props, index) => {
          let label;
          if (!labelKey) {
            label = option;
          } else if (typeof labelKey === "function") {
            label = labelKey(option, index);
          } else {
            label = option[labelKey];
          }

          return (
            <div className="btn-toolbar justify-content-between">
              <div>
                {renderPrefix ? renderPrefix(option) : null}
                <Highlighter search={props.text}>{label}</Highlighter>
              </div>
              {renderSuffix ? renderSuffix(option) : null}
            </div>
          );
        };

        const input_style = {
          ...(SIZES[size]?.inputStyle || {}),
          ...(inputProps?.style || {}),
        };

        const close_style = {
          ...(SIZES[size]?.closeStyle || {}),
        };

        return (
          <Typeahead
            onFocus={(e) => {
              e.target.select();
            }}
            ref={ref}
            selected={selectedValue ? [selectedValue] : []}
            onChange={handleOnChange}
            options={options}
            labelKey={labelKey}
            //			filterBy={['name', 'title', ...]}
            placeholder={placeholder}
            renderMenuItemChildren={renderMenuItemChildren}
            inputProps={{ ...inputProps, style: input_style }}
            className={cn(className, size)}
            filterBy={filterBy}
            disabled={disabled}
            {...rest}
          >
            {({ onClear, selected }) => (
              <div
                className="rbt-aux"
                style={{ width: SIZES[size]?.width || 'auto' }}
              >
                {!!selected.length && (
                  <button
                    onClick={onClear}
                    aria-label="Clear"
                    className="close btn-close rbt-close"
                    type="button"
                    style={{ marginTop: "0px", ...close_style }}
                    disabled={disabled}
                  >
                    <span className="visually-hidden sr-only">Clear</span>
                  </button>
                )}
              </div>
            )}
          </Typeahead>
        );
      },
    ),
  ),
);
