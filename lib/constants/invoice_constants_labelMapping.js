import _ from "lodash";
export const labelMapping = {
  tmp_invoiceNumber: { title: "Invoice#" },
  m_Status: { title: "Work Order Status" },
  tmp_invoiceStatus: { title: "Invoice Status" },
  createdAt: { title: "Created At" },
  createdBy: { title: "Created By" },
  tmp_rejectReason: { title: "Reject Reason" },
  tmp_rejectNotes: { title: "Reject Notes" },
  m_DepositValue: { title: "Deposit" },
  m_ListPrice: { title: "Sold Price" },
  m_Commission: { title: "Commission" },
  m_PaymentType: { title: "Payment Type" },
  m_Discount: { title: "Discount" },
  m_Tax: { title: "Tax" }, // dropdown of No Tax, GST, GST+ PST, PST Exempt
  m_PO: { title: "PO" },
  m_PSTExemptionNumber: { title: "PST Exemption Number" }, // when input only show when its PST
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
