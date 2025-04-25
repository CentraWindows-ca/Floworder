import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

import Prod2FFApi from "lib/api/Prod2FFApi";

import { TableHeader, TableWrapper } from "components/atom/TableSortable";

import constants from "lib/constants";

// components
import Pagination from "components/atom/Pagination";
import OrderList from "components/organism/OrderList";
import Editable from "components/molecule/Editable";
import PermissionBlock from "components/atom/PermissionBlock";

import { ORDER_STATUS } from "lib/constants";

// styles
import styles from "./styles.module.scss";
import useLoadingBar from "lib/hooks/useLoadingBar";

const Com = ({ data, dataProfile, onRefresh }) => {
  const router = useRouter();
  const { q } = router?.query || {};

  const [workOrderNo, setWorkOrderNo] = useState(q);
  const [treatedData, setTreatedData] = useState(null);
  const [sort, setSort] = useState(null);
  const [filters, setFilters] = useState(null);

  const columns = constants.applyField([
    {
      key: "m_WorkOrderNo",
      width: 125,
      isNotSortable: true,
    },
    {
      key: "m_ManufacturingFacility",
      width: 180,
      isNotSortable: true,
    },
    {
      key: "m_Branch",
      width: 125,
      isNotSortable: true,
    },
    {
      title: "Profiles",
      key: "profiles",
      isNotSortable: true,
    },
    {
      title: "Needed",
      key: "needed",
      isNotSortable: true,
    },
    {
      title: "Wasted",
      key: "wasted",
      isNotSortable: true,
    },
  ]);

  useEffect(() => {
    if (data && dataProfile) {
      setTreatedData(runTreatment(data, dataProfile));
    } else {
      setTreatedData(null);
    }
  }, [data, dataProfile]);

  const runTreatment = (data, dataProfile) => {
    const dataCWD = data?.data; // its paginated object

    const _data = dataCWD?.map((a) => {
      const { value } = a;
      const merged = {
        ...value?.m,
        //...value?.d,...value?.w
      };
      const profileList = dataProfile?.filter((b) => {
        return (
          b.parentRecordId === merged?.m_RecordId?.toString() &&
          b.workOrderNumber === merged?.m_WorkOrderNo
        );
      });

      return {
        ...merged,
        profileList,
        totalNeeded: _.round(
          profileList?.reduce((p, c) => {
            return p + c.neededofBars;
          }, 0),
        ),
        totalWasted: _.round(
          profileList?.reduce((p, c) => {
            return p + c.wastedofBars;
          }, 0),
        ),
      };
    });

    return _data;
  };

  const handleSearch = () => {
    onRefresh();
    const pathname = router?.asPath?.split("?")?.[0];
    const query = {
      ...router.query,
      q: workOrderNo,
    };
    if (!workOrderNo) {
      delete query.q;
    }
    router.replace(
      {
        pathname,
        query,
      },
      undefined,
      { shallow: true },
    );
  };

  const handleGetWindowMaker = useLoadingBar(async (ref) => {
    if (!confirm(`Are you going to get window maker for [${workOrderNo}]?`))
      return;
    await Prod2FFApi.sync_optimized_Bar_Async(ref);

    onRefresh();
  });

  const jsxTitle = (
    <label className="align-items-center me-3 flex">
      <div
        style={{
          height: 15,
          width: 15,
          fontSize: "13px",
          color: "#bd148a",
        }}
        className="align-items-center me-1 flex"
      >
        <i className="fa-solid fa-magnifying-glass" />
      </div>
      <div className="align-items-center flex gap-1 font-bold">
        {"Profile Lookup"}
      </div>
    </label>
  );

  // ====== consts
  return (
    <div className={cn("w-full", styles.root)}>
      <div className={cn(styles.topBar)} style={{ paddingLeft: "25px" }}>
        <div className="align-items-center justify-content-between flex gap-2">
          {jsxTitle}
        </div>
      </div>
      <div className={cn(styles.detail)}>
        <div className={cn(styles.searchPanelContainer)}>
          <div
            className={cn("align-items-center flex gap-4", styles.searchPanel)}
          >
            <label>Work Order Number</label>
            <div className="input-group" style={{ width: "400px" }}>
              <Editable.EF_Input
                value={workOrderNo}
                onChange={setWorkOrderNo}
                onPressEnter={handleSearch}
              />
              <button className="btn btn-primary" onClick={handleSearch}>
                Search
              </button>
            </div>
          </div>
        </div>
        <div>
          {treatedData && (
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
                  className: styles.thead,
                }}
              />
              <tbody>{treatedData?.length > 0 ? (
                  treatedData?.map((a, i) => {
                    const {
                      m_WorkOrderNo,
                      m_ManufacturingFacility,
                      m_MasterId,
                      m_Branch,
                      profileList,
                      totalNeeded,
                      totalWasted,
                    } = a;

                    return !_.isEmpty(profileList) ? (
                      <React.Fragment key={m_MasterId}>
                        <tr>
                          <td>{m_WorkOrderNo}</td>
                          <td>{m_ManufacturingFacility}</td>
                          <td>{m_Branch}</td>
                          <td className="text-right">
                            (profiles) <b>{profileList?.length}</b>
                          </td>
                          <td className="text-right">
                            (total) <b>{totalNeeded}</b>
                          </td>
                          <td className="text-right">
                            (total) <b>{totalWasted}</b>
                          </td>
                        </tr>
                        {profileList?.map((b, j) => {
                          const { barProfileName, neededofBars, wastedofBars } =
                            b;
                          return (
                            <tr
                              key={j}
                              className={cn(
                                styles.subRow,
                                j === profileList?.length - 1
                                  ? styles.subRowLast
                                  : "",
                              )}
                            >
                              <td></td>
                              <td></td>
                              <td></td>
                              <td>{barProfileName}</td>
                              <td className="text-right">{neededofBars}</td>
                              <td className="text-right">{wastedofBars}</td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ) : (
                      <tr className={cn(styles.subRowLast)}>
                        <td>{m_WorkOrderNo}</td>
                        <td>{m_ManufacturingFacility}</td>
                        <td>{m_Branch}</td>
                        <td
                          colSpan={3}
                          className="py-0 text-right"
                          style={{
                            verticalAlign: "middle",
                          }}
                        >
                          No Data{" "}
                          <button
                            className="btn btn-success btn-sm ms-2"
                            onClick={() =>
                              handleGetWindowMaker(a)
                            }
                            type="button"
                          >
                            Get From Windowmaker
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center">-- No Data --</td>
                  </tr>
                )}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Com;
