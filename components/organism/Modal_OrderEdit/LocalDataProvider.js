import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import _ from "lodash";
import { GeneralContext } from "lib/provider/GeneralProvider"


export const LocalDataContext = createContext(null);

export const LocalDataProvider = ({ children, orderId, ...props }) => {
  const generalContext = useContext(GeneralContext)
  const [data, setData] = useState(null);

  const [isEditable, setIsEditable] = useState(false);

  // not messing up with existing files
  const [newAttachments, setNewAttachments] = useState(null);

  // UI purpose
  const [expands, setExpands] = useState({});

  useEffect(() => {
    init(orderId);
  }, [orderId]);

  const handleFetchFromWindowMaker = () => {
    // TODO: fetch from window maker
  };

  const handleChange = (v, k) => {
    setData((prev) => {
      const _newV = JSON.parse(JSON.stringify(prev || {}));

      _newV[k] = v;
      return _newV;
    });
  };

  const handleAnchor = (id, closeOthers) => {
    if (closeOthers) {
      setExpands(() => ({
        [id]: true,
      }));
    } else {
      setExpands((prev) => ({
        ...prev,
        [id]: true,
      }));
    }

    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  const init = async (orderId) => {
    console.log(orderId)
    // get data by orderId
    if (orderId === 0) {
      setIsEditable(false);
    } else if (orderId) {
      setIsEditable(true);
    }
  };

  const context = {
    ...generalContext,
    ...props,
    orderId,
    data,
    setData,
    newAttachments,
    setNewAttachments,
    onChange: handleChange,
    onAnchor: handleAnchor,
    onFetchFromWindowMaker: handleFetchFromWindowMaker,
    expands,
    setExpands,
    isEditable,
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
