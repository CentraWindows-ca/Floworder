import React from "react";
import Editable from "components/molecule/Editable";
import cn from "classnames";
import _ from "lodash";

// styles
import styles from "./styles.module.scss";

const FiltersManager = ({
  columns,
  filters,
  setFilters,
  applyFilter,
  onApplyFilter,
}) => {
  const handleFilterChange = (v, k) => {
    setFilters((prev) => {
      const _v = {
        ...prev,
        [k]: { value: v },
      };
      if (!v) {
        delete _v[k];
      }
      return _v;
    });
  };

  const handleFilterClear = () => {
    setFilters(null);
  };

  return (
    !_.isEmpty(filters) && (
      <div className={cn(styles.FiltersManager)}>
        <span
          className="cursor-pointer text-red-400 hover:text-amber-500"
          onClick={handleFilterClear}
        >
          <i className="fa-solid fa-xmark" />
          <span className="ms-2">Clear All Filters</span>
        </span>
        <span>
          <Editable.EF_Checkbox
            id="applyFilterCheckbox"
            value={applyFilter}
            onChange={onApplyFilter}
          />

          <label htmlFor="applyFilterCheckbox" className="ms-2 cursor-pointer">
            Enable Filters
          </label>
        </span>
        <span className="text-xs text-gray-300">|</span>
        {_.keys(filters)?.map((k) => {
          const title = columns?.find(
            ({ initKey, key }) => (initKey || key) === k,
          )?.title;
          return (
            <button
              key={`filter_manage_${k}`}
              className={cn(
                "badge fw-normal align-items-center flex gap-2",
                applyFilter ? "text-gray-800" : "text-gray-300",
                styles.filterBadge,
              )}
              onClick={() => handleFilterChange(null, k)}
              disabled={!applyFilter}
            >
              <span>
                <b>{title} :</b> {filters[k]?.value}
              </span>
              <span>
                <i className="fa-regular fa-square-minus" />
              </span>
            </button>
          );
        })}
      </div>
    )
  );
};

export default FiltersManager;
