import _ from "lodash";
export const labelMapping = {
  invoiceNumber: { title: "Invoice#" },
  m_Status: { title: "Work Order Status" },
  invoiceStatus: { title: "Invoice Status" },
  createdAt: { title: "Created At" },
  createdBy: { title: "Created By" },
  rejectReason: { title: "Reject Reason" },
  rejectNotes: { title: "Reject Notes" },
};

// NOTE: UI thing, original requirement is from VK wants to split save button for WO edit sections
export const uiWoFieldEditGroupMapping = {
  invoice: {
    m_CustomerName: "m_CustomerName",
  },
};

export const applyField = (arr) => {
  return arr
    ?.filter((a) => a)
    ?.map((a) => {
      const _v = _.cloneDeep(a);
      if (!_v.title) {
        _v.title =
          labelMapping[a.id]?.title ||
          a.id ||
          labelMapping[a.key]?.title ||
          a.key;
      }
      return _v;
    });
};

export default labelMapping;
