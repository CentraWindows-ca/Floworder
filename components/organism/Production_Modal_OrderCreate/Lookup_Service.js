import React, { useState, useEffect } from "react";
import _ from "lodash";

import TableSortable from "components/atom/TableSortable";

import External_ServiceApi from "lib/api/External_ServiceApi";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import Editable from "components/molecule/Editable";

const columns = [
  {
    title: "Service Id",
    key: "serviceId",
  },
  {
    title: "Original WO#",
    key: "originalWorkOrderNo",
  },
  {
    title: "Customer",
    key: "customerName",
  },
];

const INIT_PAGINATION = { page: 1, pageSize: 15 };

export default ({ onSelect }) => {
  const [filters, setFilters] = useState(null);

  const [searchText, setSearchText] = useState("");

  const [sort, setSort] = useState(null);
  const [list, setList] = useState(null);
  const [pagination, setPagination] = useState(INIT_PAGINATION);

  useEffect(() => {
    if (!_.isEmpty(searchText)) {
      doSearch(pagination, searchText, sort);
    } else {
      clear();
    }
  }, [pagination?.page, sort, searchText]);

  const clear = () => {
    setList(null);
    setSort(null);
    setFilters(null);
    setPagination(INIT_PAGINATION);
  };

  const handleSelect = (_order) => {
    onSelect(_order);
  };

  const handleNext = () => {
    let _nextPage = pagination?.page + 1;
    handlePageChange(_nextPage);
  };

  const handlePrevious = () => {
    let _nextPage = pagination?.page - 1;
    handlePageChange(_nextPage);
  };

  const handlePageChange = (_p) => {
    let _nextPage = _p;
    _nextPage = Math.min(_nextPage, pagination?.totalPages);
    _nextPage = Math.max(_nextPage, 1);

    setPagination((prev) => ({
      ...prev,
      page: _nextPage,
    }));
  };

  // ====== call api
  const doSearch = useLoadingBar(async (pagination, searchText, _sort) => {
    let filtersObj = {};
    let filtersString = "";
    // _.keys(_filters)?.map((k) => {
    //   filtersObj[k] = [_filters[k]?.value];
    // });

    const { sortBy, dir } = _sort || {};

    const _query = {
      // filters: encodeURIComponent(JSON.stringify(filtersObj)),
      pageNumber: pagination.page,
      pageSize: pagination.pageSize,
      isDescending: dir !== "asc" ? "true" : "false",
      sortBy: sortBy || "ServiceId",
      searchText,
    };

    // {"branchFilter":["ALL"],"typeOfWorkFilter":["ALL"]}
    // pageNumber=1&pageSize=15&filters=%7B%22branchFilter%22%3A%5B%22ALL%22%5D%2C%22typeOfWorkFilter%22%3A%5B%22ALL%22%5D%7D&isDescending=true

    const res = await External_ServiceApi.getServicesPaginated(_query);
    const { data, totalCount, pageSize } = res || {};

    const totalPages = _.round(totalCount / pageSize);
    setPagination((prev) => ({
      ...pagination,
      totalCount,
      totalPages,
    }));

    setList(data);
  });

  return (
    <div className="p-2">
      <TableSortable
        {...{
          data: list,
          columns,
          isLockFirstColumn: false,
          sort,
          setSort,
          // filters,
          // setFilters,
          keyField: "serviceId",
          trParams: (row) => {
            return {
              style: {
                cursor: "pointer",
              },
              onClick: () => {
                handleSelect(row);
              },
            };
          },
          renderInfoBefore: () => {
            return (
              <div className="p-2">
                <Editable.EF_InputDebounce
                  value={searchText}
                  onChange={setSearchText}
                  className="form-control-sm form-control"
                  placeholder={"Search ..."}
                />
              </div>
            );
          },
        }}
      />

      <div className="d-flex justify-content-between align-items-end flex-row gap-2 py-2">
        {/* <div>
          {!_.isEmpty(filters) && (
            <button
              className="d-flex align-items-center gap-1"
              onClick={() => setFilters(null)}
            >
              <i className="fa-solid fa-xmark"></i>
              Clear filters
            </button>
          )}
        </div> */}
        {!_.isEmpty(list) && (
          <div className="d-flex align-items-center flex-row gap-2">
            <div>
              <small>({pagination.totalCount || "--"} results)</small>
            </div>
            <button
              className="btn btn-sm btn-primary"
              style={{ width: 50 }}
              onClick={handlePrevious}
              disabled={pagination.page <= 1}
            >
              {"<"}
            </button>
            <div className="d-flex align-items-center gap-2">
              <Editable.EF_InputDebounce
                value={pagination.page}
                onChange={(v) => handlePageChange(v)}
                className="form-control-sm form-control"
                style={{ width: 40 }}
              />
              /{pagination.totalPages || "--"} Pages{" "}
            </div>
            <button
              className="btn btn-sm btn-primary"
              style={{ width: 50 }}
              onClick={handleNext}
              disabled={pagination.page >= pagination.totalPages}
            >
              {">"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
