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
  {
    title: "comm_code",
    key: "comm_code",
  },
  {
    title: "name",
    key: "name",
  },
  {
    title: "sector",
    key: "sector",
  },
  {
    title: "class",
    key: "class",
  },
  {
    title: "srg",
    key: "srg",
  },
  {
    title: "comm_structure",
    key: "comm_structure",
  },
  {
    title: "ward_num",
    key: "ward_num",
  },
];
const Com = (props) => {
  const { onHide, show, value, onSelect } = props;
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({});
  useEffect(() => {
    doInit();
  }, []);

  const doInit = async () => {
    const res = await External_FromApi.getAllCWBPCommunityAsync();
    setData(res);
  };

  const handleSelect = (row) => {
    onSelect(row.name)
  };

  const filteredData = data?.filter(a => {    
    const checkList = _.keys(filters)?.map(k => {
      if (!filters[k]) return true
      const lowerValue = a?.[k]?.toLowerCase()
      const lowerFilter = filters[k]?.toLowerCase()
      return lowerValue?.includes(lowerFilter)
    })

    return _.every(checkList)
  })

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
            data: _.orderBy(filteredData, ["comm_code"], ["asc"]),
            columns,
            isLockFirstColumn: false,
            filters,
            setFilters,
            className: styles.community,
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
