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

const STATUS_DISPLAY = (data, woRef) => {
  // NOTE: 20250419 hardcode requirement from Meng
  if (woRef.w_GlassSupplier === "GlassFab") {
    return "N/A";
  }

  if (data.statusObj) {
    return (
      <div className="align-items-center flex gap-2">
        <div
          style={{
            border: "1px solid rgb(160, 160, 160)",
            height: "15px",
            width: "15px",
            backgroundColor: data.statusObj.color,
            display: "block",
          }}
        />
        {data.statusObj.label}
      </div>
    );
  }

  return data.status;
};

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
      <div className={styles.togglePadding}>
        {!_.isEmpty(glassItems) ? (
          <>
            <div className={cn(styles.itemSubTitle, styles.subTitle)}>
              <label>Glass</label>
            </div>
            <table
              className={cn(
                "table-xs table-hover table-clean mb-0 table border",
                styles.itemTableBorder,
              )}
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
                        woRef={woRef}
                      />
                    );

                  return (
                    <MultiRow
                      data={a}
                      key={`glass_${workOrderNumber}_${item}_${i}`}
                      woRef={woRef}
                    />
                  );
                })}
              </tbody>
            </table>
          </>
        ) : (
          <NoData />
        )}
      </div>
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
      <td>{STATUS_DISPLAY(data, woRef)}</td>
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
        <td className={cn("text-right", styles.multileRowBorderFix)}>
          {rackQty}
        </td>
        {j === 0 && (
          <>
            <td rowSpan={rowSpan}>{item}</td>
            <td rowSpan={rowSpan}>{description}</td>
            <td rowSpan={rowSpan}>{orderDate}</td>
            <td rowSpan={rowSpan}>{shipDate}</td>
            <td rowSpan={rowSpan}>{size}</td>
            <td rowSpan={rowSpan}>{position}</td>
            <td rowSpan={rowSpan}>{STATUS_DISPLAY(data, woRef)}</td>
          </>
        )}
      </tr>
    );
  });
};

export default Com;
