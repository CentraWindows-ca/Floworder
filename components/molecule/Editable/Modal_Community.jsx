import React, { useEffect, useState } from "react";
import constants from "lib/constants";
import cn from "classnames";
import Modal from "components/molecule/Modal";
import External_FromApi from "lib/api/External_FromApi";
import TableSortable from "components/atom/TableSortable";

import Editable from "components/molecule/Editable";
import { ITEM_STATUS, ITEM_LITES, ITEM_DOOR_TYPES } from "lib/constants";
import utils from "lib/utils";
import useDataInit from "lib/hooks/useDataInit";

// styles
import styles from "./styles.module.scss";

const columns = [
  // {
  //   title: "comm_code",
  //   key: "comm_code",
  // },
  {
    title: "Community Name",
    key: "name",
  },
  {
    title: "Quadrents",
    key: "sector",
  },
  // {
  //   title: "class",
  //   key: "class",
  // },
  {
    title: "Status",
    key: "srg",
  },
  {
    title: "Structure",
    key: "comm_structure",
  },
  {
    title: "Ward Number",
    key: "ward_num",
  },
];
const Com = (props) => {
  const { onHide, show, value, onSelect } = props;
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});

  const [sort, setSort] = useState({});

  useEffect(() => {
    if (show) {
      doInit();
    }
  }, [show]);

  useEffect(() => {
    // setFilters({
    //   name: value
    // })
  }, [value]);

  const doInit = async () => {
    const res = await External_FromApi.getAllCWBPCommunityAsync();
    // data will be only SO + AB. set from Modal_OrderEdit/Com
    setData(res);
  };

  const handleSelect = (row) => {
    onSelect(row.name);
  };

  const filteredData = data?.filter((a) => {
    const checkList = _.keys(filters)?.map((k) => {
      if (!filters[k]?.value) return true;
      const lowerValue = a?.[k]?.toLowerCase();
      const lowerFilter = filters[k]?.value?.toLowerCase();
      return lowerValue?.includes(lowerFilter);
    });

    return _.every(checkList);
  });

  const { sortBy = "name", dir = "asc" } = sort || {};

  return (
    <Modal
      show={show}
      size="xl"
      onHide={onHide}
      fullscreen={false}
      title={`Communities`}
      layer={1}
    >
      <div className="p-2">
        <TableSortable
          {...{
            data: _.orderBy(filteredData, [sortBy], [dir]),
            columns,
            isLockFirstColumn: false,
            sort,
            setSort,
            filters,
            setFilters,
            className: styles.community,
            keyField: "comm_code",
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
          }}
        />
      </div>
    </Modal>
  );
};

export default Com;
