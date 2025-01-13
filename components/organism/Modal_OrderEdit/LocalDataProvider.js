import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import _ from "lodash";
export const LocalDataContext = createContext(null);

export const LocalDataProvider = ({ children, ...props }) => {
  const [data, setData] = useState(null);

  // not messing up with existing files
  const [newAttachments, setNewAttachments] = useState(null);

  // UI purpose
  const [expands, setExpands] = useState({});

  const handleChange = (k, v) => {
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

  const context = {
    ...props,
    data,
    setData,
    newAttachments,
    setNewAttachments,
    onChange: handleChange,
    onAnchor: handleAnchor,
    expands,
    setExpands,
  };
  return (
    <LocalDataContext.Provider value={context}>
      {children}
    </LocalDataContext.Provider>
  );
};

export default LocalDataProvider;
