import DictionaryApi from "lib/api/DictionaryApi"
import useDataInit from "./useDataInit"

const useData = () => {
  const { data: branches } = useDataInit([DictionaryApi.flowfinity.branch]);
  const { data: departments } = useDataInit([DictionaryApi.flowfinity.department]);
  const { data: products } = useDataInit([DictionaryApi.flowfinity.product]);


  return {
    branches,
    departments,
    products
  };
};

export default useData;
