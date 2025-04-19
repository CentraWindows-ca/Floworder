import React, { useState, useContext } from "react";
import cn from "classnames";
import constants from "lib/constants";

import _ from "lodash";

import { TableHeader, TableWrapper } from "components/atom/TableSortable";

import { LocalDataContext } from "../LocalDataProvider";
import { ToggleBlock, NoData } from "../Com";
// styles
import stylesRoot from "../styles.module.scss";
import stylesCurrent from "./styles.module.scss";

const styles = { ...stylesRoot, ...stylesCurrent };


const STATUS_DISPLAY = (status, woRef) => {
  // NOTE: 20250419 hardcode requirement from Meng
  if (woRef.w_GlassSupplier === 'GlassFab') {
    return "N/A"
  }

  return status  
}


const Com = ({}) => {
  const { glassTotal, glassItems, data: woRef } = useContext(LocalDataContext);

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

  const columns = constants.applyField([
    {
      key: "receivedExpected",
      width: 125,
    },
    {
      key: "rackID",
    },
    {
      key: "rackType",
    },
    {
      key: "qty",
      width: 120,
    },
    {
      // title: "Item",
      key: "item",
    },
    {
      key: "description",
    },
    {
      key: "orderDate",
    },
    {
      key: "shipDate",
    },
    {
      key: "size",
    },
    {
      key: "position",
    },
    {
      key: "status",
    },
  ]);

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
          <div className={cn(styles.itemSubTitle, styles.subTitle)}>
            <label>Windows</label>
          </div>
          <table
            className={cn("table-xs table-hover mb-0 table border table-clean", styles.itemTableBorder)}
          >
            <TableHeader
              {...{
                columns,
                sort,
                setSort,
                filters,
                setFilters,
                className: styles.thead,
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
                      woRef = {woRef}
                    />
                  );

                return (
                  <MultiRow
                    data={a}
                    key={`glass_${workOrderNumber}_${item}_${i}`}
                    woRef = {woRef}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <NoData/>
      )}
    </ToggleBlock>
  );
};

const SingleRow = ({ data, woRef }) => {
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
      <td>
        <div>{receivedExpected}</div>
      </td>
      <td>--</td>
      <td>--</td>
      <td className="text-right">0</td>
      <td>{item}</td>
      <td>{description}</td>
      <td>{orderDate}</td>
      <td>{shipDate}</td>
      <td>{size}</td>
      <td>{position}</td>
      <td>{STATUS_DISPLAY(status, woRef)}</td>
    </tr>
  );
};

const MultiRow = ({ data, woRef }) => {
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
            <td rowSpan={rowSpan}>{STATUS_DISPLAY(status, woRef)}</td>
          </>
        )}
      </tr>
    );
  });
};

export default Com;
