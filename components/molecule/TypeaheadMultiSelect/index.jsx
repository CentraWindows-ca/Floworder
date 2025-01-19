import React, { useCallback, useState, useRef } from "react";
import cn from "classnames";
import { Hint } from "react-bootstrap-typeahead";
import Typeahead from "components/atom/Typeahead";
import { FloatingLabel, Form } from "react-bootstrap";

// styles
import style from "./style";
import _ from "lodash";

/**
 * Typeahead wrapper
 */
export default React.memo(
  style(
    React.forwardRef(({ className, ...rest }, ref) => {
      const typeaheadRef = useRef(null);
      const { value = [], valueKey, labelKey, onChange, options } = rest;

      const renderMenuItemChildren = (option, props, index) => {
        let label = option[labelKey];
        const _selected = _.isEmpty(value)? null :value.findIndex((a) => a[valueKey] === option[valueKey]) > -1 ;
        const renderPrefix =  _selected ? <i className="pr-2 text-green-600 fa-solid fa-square-check" /> : <i className="pr-2 text-blue-500 fa-regular fa-square" />;
        return (
          <>
            {renderPrefix}
            {label}
          </>
        );
      };

      return (
        <Typeahead
          ref={typeaheadRef}
          className={cn(className, "root")}
          renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
            return (
              <Form.Control
                {...inputProps}
                value={value?.length > 0 ? `Selected [${value?.length}]`: inputProps.value}
                ref={(node) => {
                  inputRef(node);
                  referenceElementRef(node);
                }}
              />
            );
          }}
          {...rest}
          onChange={(v) => {
            let newArr = _.cloneDeep(value || []);
            if (newArr.findIndex((a) => a[valueKey] === v) > -1) {
              newArr = newArr.filter((a) => a[valueKey] !== v);
            } else {
              const newItem = options?.find((a) => a[valueKey] === v);
              newArr = [...value || [], newItem];
            }

            newArr = newArr.filter(a => a)

            if (_.isEmpty(newArr)) {
              newArr = ''
            }

            onChange(v, newArr);
            // Keep the menu open when making multiple selections.
            typeaheadRef.current.toggleMenu();
          }}

          renderMenuItemChildren={renderMenuItemChildren}

          selected={value || []}
          // multiple = {true} // it will break when select multiple....

        ></Typeahead>
      );
    })
  )
);
