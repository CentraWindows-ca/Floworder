import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import utils from "lib/utils";
import constants from "lib/constants";
import _ from "lodash";

/* places needs it: 
  page/search - to get params (its extracted from url)
  pagination - to generate "next page", etc...
  api - to send hashed query to server 
  
  standard query params:
  {
    keyword,
    rowsPerPage,
    sortBy,
    order,
    // if send to server: page
  } 

  "page" starts from 0

  用法：
    页面需要：atom/Pagination > 传入count。这个只能从api拿到，所以无法在Pagination里面做
    页面需要：跳到目标页，一般是 jumpWithParams({keyword: encoded})
    页面需要：读取API，一般是getBySearch(generateAPIQuery())
      generateAPIQuery(参数) 负责插入默认的perPage, order, page, 有时候有keyword
      参数是额外附加的。不一定有。需要复合条件时候用。比如：{is_listed: true}

    API端需要解析：
      const { ...whereConditions } = unhashQuery(query);
      const { pagination, keyword } = whereConditions
      一般function name是getBySearch，
      默认传入到getBySearch的只有pagination。需要keyword的时候，需要手动传入。因为我们不知道keyword对应的字段是什么

*/
const Q = ["keyword", "perPage", "order"];
const Q_HOME = ["perPage", "order", "search"];

export const generateQuery = (_params) => {
  // btoa 放到 encode 里面的话，会报错。btoa("你好")会报错，因为中文, 所以要先encodeURIComponent
  return btoa(encodeURIComponent(JSON.stringify(_params)))

};

export const generateAPIQueryForSsr = (ctx, options) => {
  const { search, p } = ctx.query || {};
  const newOptions = { ...constants.PAGINATION, ...options };
  const perPage = newOptions.perPage,
    order = newOptions.DEFAULT_ORDER;

  const pagination = { order };

  if (perPage > 0) {
    const page = parseInt(p) || 0;
    pagination.limit = perPage;
    pagination.offset = page * perPage;
  }

  // this is for API call. so we need to encode
  return generateQuery({
    search, // for current page
    perPage, // redundant data
    pagination,
    params: ctx.query,
  });
};

const useQuery = () => {
  const router = useRouter();
  let { p } = router.query || {};

  /*
    how to add default order?
    generateAPIQuery({}, DEFAULT_ORDER: [['createdAt', 'DESC']])
  */
  const generateAPIQuery = (_params, options) => {
    const obj = {};
    Q.map((key) => {
      obj[key] = new URLSearchParams(router.asPath.split("?")[1]).get(key) || undefined;
    });

    // order = [['createdAt', 'DESC'], ...]
    const newOptions = { ...constants.PAGINATION, ...options };
    const { perPage = newOptions.perPage, order = newOptions.DEFAULT_ORDER, keyword, search } = obj;

    const pagination = { order };

    if (perPage > 0) {
      const page = parseInt(p) || 0;
      pagination.limit = perPage;
      pagination.offset = page * perPage;
    }

    // this is for API call. so we need to encode
    return generateQuery({
      keyword, // for current page
      search, // search is for home page, global search bar
      perPage, // redundant data
      pagination,
      params: _params,
    });
  };

  const generateAPIQueryForHome = (_params, options) => {
    // only for home page (search from header, or other filters)
    const obj = {};
    Q_HOME.map((key) => {
      obj[key] = new URLSearchParams(router.asPath.split("?")[1]).get(key) || undefined;
    });

    const newOptions = { ...constants.PAGINATION, ...options };
    const { perPage = newOptions.perPage, order = newOptions.DEFAULT_ORDER, search } = obj;

    const pagination = { order };

    if (perPage > 0) {
      const page = parseInt(p) || 0;
      pagination.limit = perPage;
      pagination.offset = page * perPage;
    }

    // this is for API call. so we need to encode
    return generateQuery({
      search, // search is for home page, global search bar
      perPage, // redundant data
      pagination,
      params: _params,
    });
  };

  const jumpWithParams = (obj = {}) => {
    // attach to question mark
    const search = router.asPath.split("?")[1] || "";
    const newSearch = utils.paramToString({ ...utils.parse(search), ...obj });
    const newPath = `${window.location.pathname}${newSearch}`;
    router.push(newPath);
  };

  const [params, setparams] = useState({});

  useEffect(() => {
    const obj = {};
    Q.map((key) => {
      obj[key] = new URLSearchParams(router.asPath.split("?")[1]).get(key);
    });
    setparams((prev) => {
      const _val = _.cloneDeep(prev);
      _val.v = (_val.v || 0) + 1;
      return _val;
    });
  }, [router]);

  const query = {
    page: parseInt(p) || 0,
    params,
    jumpWithParams,
    generateQuery,
    generateAPIQueryForHome,
    generateAPIQuery,
  };

  return query;
};

export default useQuery;
