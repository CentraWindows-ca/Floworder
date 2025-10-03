import _ from "lodash";
export const labelMapping = {
  tmp_invoiceNumber: { title: "Invoice#" },
  m_Status: { title: "Work Order Status" },
  tmp_invoiceStatus: { title: "Invoice Status" },
  createdAt: { title: "Created At" },
  createdBy: { title: "Created By" },
  tmp_rejectReason: { title: "Reject Reason" },
  tmp_rejectNotes: { title: "Reject Notes" },
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
