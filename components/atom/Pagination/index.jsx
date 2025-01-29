import React, { useEffect, useState, useContext } from "react";
// import { useLocation, useRouteMatch, Link } from "react-router-dom";
import { useRouter } from "next/router";
import utils from "lib/utils";
import _ from "lodash";
import cn from "classnames";
import Link from "next/link";

import constants from "lib/constants";

// + UI components
import useQuery from "lib/hooks/useQuery";
import styles from "./styles.module.scss";

// to tell pagination which param is the p, need to set basepath = basepath + /:p
const ExportedComponent = ({
  basepath,
  size = "sm",
  className,
  count = 0,
  perPage = constants.PAGINATION.perPage,
  ...props
}) => {
  // ====== "localize" component from other project start
  const router = useRouter();
  const search = router.asPath.split("?")[1]
  ? `?${router.asPath.split("?")[1]}`
  : "";
  const TOTAL_LINKS = 5;
  // ====== "localize" component from other project end

  const generatePath = (base, search, params) => {
    const newSearch = utils.paramToString({
      ...utils.parse(search),
      ...params,
    });
    console.log(base, search, params, newSearch)
    return `${base}?${newSearch}`;
  };

  const { page, count: queryCount } = useQuery();
  const [pageList, setPageList] = useState([]);
  const [lastPageIdx, setLastPageIdx] = useState(0);
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");

  const MIDDLE_LINK_IDX = Math.floor(TOTAL_LINKS / 2);

  useEffect(() => {
    const totalPages = perPage ? Math.floor(count / perPage) : 0;
    let firstPage = 0;
    let lastPage = totalPages;
    const _basepath = window.location.pathname;

    // if page > totalPages, redirect to last page
    // if (page > totalPages) {
    //   router.push(generatePath(basepath || _basepath, search, { p: totalPages }));
    //   return;
    // }

    if (page >= 0 && page <= MIDDLE_LINK_IDX) {
      firstPage = 0;
      lastPage = Math.min(totalPages, TOTAL_LINKS - 1);
    } else if (page >= totalPages - MIDDLE_LINK_IDX && page <= totalPages) {
      firstPage = Math.max(totalPages - (TOTAL_LINKS - 1), 0);
      lastPage = totalPages;
    } else {
      firstPage = page - MIDDLE_LINK_IDX;
      lastPage = page + MIDDLE_LINK_IDX;
    }

    const pageList = [];
    for (let i = firstPage; i <= lastPage; i++) {
      const url = generatePath(basepath || _basepath, search, { p: i });
      pageList.push({
        url,
        i,
        isCurrent: i === page,
      });
    }

    setFirst(generatePath(basepath || _basepath, search, { p: 0 }));
    setLast(generatePath(basepath || _basepath, search, { p: totalPages }));
    setPageList(pageList);
    setLastPageIdx(totalPages);
  }, [page, count, perPage, search]);

  // show 5 pages, keep in middle

  const fromRow = page * perPage + 1;
  const toRow = Math.min((page + 1) * perPage, count);

  // ------------------------- render -------------------------
  return (
    <div className={cn(styles.root, className)}>
      <div>
        {fromRow}-{toRow} of {count}{" "}
      </div>
      <nav aria-label="...">
        <ul className={cn("pagination", `pagination-${size}`)} style={{margin: 0}}>
          {pageList?.[0]?.i > 0 && (
            <>
              <li className="page-item">
                <Link href={first} aria-label="Previous">
                  <a className="page-link">{1}</a>
                </Link>
              </li>
              {pageList?.[0]?.i > 1 && <li className="page-link">...</li>}
            </>
          )}

          {pageList.map((a) => {
            return (
              <li
                key={a.url + a.i}
                className={cn("page-item", a.isCurrent ? "active" : "")}
              >
                {a.isCurrent ? (
                  <span className="page-link">{a.i + 1}</span>
                ) : (
                  <Link href={a.url} className="page-link">
                    <a className="page-link">{a.i + 1}</a>
                  </Link>
                )}
              </li>
            );
          })}
          {pageList?.[pageList.length - 1]?.i < lastPageIdx && (
            <>
              {pageList?.[pageList.length - 1]?.i < lastPageIdx - 1 && (
                <li className="page-link">...</li>
              )}
              <li className="page-item">
                <Link href={last} aria-label="Next">
                  <a className="page-link">{lastPageIdx + 1}</a>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default ExportedComponent;
