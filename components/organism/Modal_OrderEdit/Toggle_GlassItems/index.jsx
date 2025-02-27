import React, { useState, useContext } from "react";

import _ from "lodash";

import { TableHeader } from "components/atom/TableSortable";

// styles
import styles from "../styles.module.scss";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock } from "../Com";

const Com = ({  }) => {
  const {  glassTotal, glassItems, } =
    useContext(LocalDataContext);

  const [sort, setSort] = useState(null);
  const [filters, setFilters] = useState(null);

  const jsxTitle = (
    <div className="flex gap-2">
      Glass Items
      <div className="text-primary font-normal">
        ({glassTotal?.qty || 0} / {glassTotal?.glassQty || 0})
      </div>
    </div>
  );

  const columns = [
    {
      title: "Rcev. / Expt.",
      key: "receivedExpected",
      width: 125,
    },
    {
      title: "Rack ID",
      key: "rackID",
    },
    {
      title: "Rack Type",
      key: "rackType",
    },
    {
      title: "Qty On Rack",
      key: "qty",
    },
    {
      title: "Item",
      key: "item",
    },
    {
      title: "Description",
      key: "description",
    },
    {
      title: "Order Date",
      key: "orderDate",
    },
    {
      title: "Shipping Date",
      key: "shipDate",
    },
    {
      title: "Size",
      key: "size",
    },
    {
      title: "Position",
      key: "position",
    },
    {
      title: "Status",
      key: "status",
    },
  ];

  let sortedList = JSON.parse(JSON.stringify(glassItems || []));

  // apply filter
  sortedList = _.orderBy(sortedList, [sort?.sortBy], [sort?.dir])?.filter(
    (a) => {
      return _.every(
        _.keys(filters)?.map((filterBy) => {
          const filterValue = filters[filterBy];
          if (!filterValue) return true;

          switch (filterBy) {
            case "rackID":
            case "rackType":
            case "qty":
              const filteredRack = a?.rackInfo?.filter((ri) => {
                return ri[filterBy]
                  ?.toString()
                  ?.toLowerCase()
                  ?.includes(filterValue?.toLowerCase());
              });
              a.rackInfo = filteredRack;

              console.log("rackinfo", filteredRack);

              return !_.isEmpty(filteredRack);
            default:
              return a[filterBy]
                ?.toLowerCase()
                ?.includes(filterValue?.toLowerCase());
          }
        }),
      );
    },
  );

  return (
    <ToggleBlock title={jsxTitle} id={"glassItems"}>
      {!_.isEmpty(glassItems) ? (
        <div className={styles.togglePadding}>
          <div className={styles.itemSubTitle}>
            <label>Windows</label>
          </div>
          <table className="table-xs table-bordered table-hover mb-0 table border" style={{borderTop: 'none'}}>
            <TableHeader
              {...{
                columns,
                sort,
                setSort,
                filters,
                setFilters,
              }}
            />

            <tbody>
              {sortedList?.map((a, i) => {
                const { workOrderNumber, item, rackInfo } = a;

                if (_.isEmpty(rackInfo))
                  return (
                    <SingleRow
                      data={a}
                      key={`glass_${workOrderNumber}_${item}_${i}`}
                    />
                  );

                return (
                  <MultiRow
                    data={a}
                    key={`glass_${workOrderNumber}_${item}_${i}`}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div>No Data</div>
      )}
    </ToggleBlock>
  );
};

const SingleRow = ({ data }) => {
  const {
    workOrderNumber,
    item,
    shipDate,
    qty,
    glassQty,
    description,
    positionOption,
    size,
    position,
    supplierNo,
    orderDate,
    rackInfo,
    status,
    receivedExpected,
  } = data;

  return (
    <tr>
      <td><div>{receivedExpected}</div></td>
      <td>--</td>
      <td>--</td>
      <td className="text-right">0</td>
      <td>{item}</td>
      <td>{description}</td>
      <td>{orderDate}</td>
      <td>{shipDate}</td>
      <td>{size}</td>
      <td>{position}</td>
      <td>{status}</td>
    </tr>
  );
};

const MultiRow = ({ data }) => {
  const {
    workOrderNumber,
    item,
    shipDate,
    qty,
    glassQty,
    description,
    positionOption,
    size,
    position,
    supplierNo,
    orderDate,
    rackInfo,
    status,
    receivedExpected,
  } = data;

  let rowSpan = rackInfo?.length;
  return rackInfo?.map((ri, j) => {
    const { rackID, rackType, qty: rackQty } = ri;

    return (
      <tr key={`glass_${workOrderNumber}_${item}_${rackID}`}>
        {j === 0 && <td rowSpan={rowSpan}>{receivedExpected}</td>}

        <td>{rackID}</td>
        <td>{rackType}</td>
        <td className="text-right">{rackQty}</td>
        {j === 0 && (
          <>
            <td rowSpan={rowSpan}>{item}</td>
            <td rowSpan={rowSpan}>{description}</td>
            <td rowSpan={rowSpan}>{orderDate}</td>
            <td rowSpan={rowSpan}>{shipDate}</td>
            <td rowSpan={rowSpan}>{size}</td>
            <td rowSpan={rowSpan}>{position}</td>
            <td rowSpan={rowSpan}>{status}</td>
          </>
        )}
      </tr>
    );
  });
};

export default Com;
