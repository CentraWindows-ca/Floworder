import React, { useState } from "react";
import { useRouter } from "next/router";
import cn from "classnames";
import _ from "lodash";

// components
import PageContainer from "components/atom/PageContainer";

// hooks
import useLoadingBar from "lib/hooks/useLoadingBar";

// styles
import styles from "./styles.module.scss";

const Com = (props) => {
  const router = useRouter();
  const q = router?.query?.q || "";
  // ====== consts
  const [keyword, setKeyword] = useState(q);

  const handleChange = (e) => {
    setKeyword(e.target.value);
  };

  const handleKeydown = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleSearch = () => {
    const pathname = router?.asPath?.split("?")?.[0];
    router.replace(
      {
        pathname,
        query: { ...router.query, q: keyword },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleCancel = () => {
    setKeyword("");
    const pathname = router?.asPath?.split("?")?.[0];
    router.replace(
      {
        pathname,
        query: { ...router.query, q: "" },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <div className={cn("w-full", styles.root)}>
      <div className="input-group input-group-sm">
        <input
          className={cn("form-control", keyword ? "bg-notempty" : "")}
          placeholder="Work order..."
          value={keyword}
          onChange={handleChange}
          onKeyDown={handleKeydown}
        />
        {keyword ? (
          <button className="btn btn-warning" onClick={handleCancel}>
            Cancel
          </button>
        ) : null}

        <button className="btn btn-primary" onClick={handleSearch}>
          Search
        </button>
      </div>
    </div>
  );
};
export default Com;
