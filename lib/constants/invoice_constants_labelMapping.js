import _ from "lodash";
export const labelMapping = {
  invoiceId: { title: "Invoice#" },
  workOrderNo: { title: "Work Order#" },
  invoiceStatus: { title: "Invoice Status" },
  customerName: { title: "Customer" },
  branch: { title: "Branch" },
  email: { title: "Email" },
  phoneNumber: { title: "Phone" },
  address: { title: "Address" },
  city: { title: "City" },
  completeDate: { title: "Actual Shipped Date" },
  invoiceAmount: { title: "Invoice Amount" },
  salesRep: { title: "Sales Rep" },
  createdAt: { title: "Created At" },
  lastModifiedBy: { title: "Modified By" },

  m_Status: { title: "Work Order Status" },

  source: { title: "Source" },
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
// NOTE: UI thing, original requirement is from VK wants to split save button for WO edit sections
export const uiWoFieldEditGroupMapping = {
  basic: {
    m_CustomerName: "m_CustomerName",
    m_ProjectName: "m_ProjectName",
    m_Address: "m_Address",
    m_City: "m_City",
    m_Email: "m_Email",
    m_PhoneNumber: "m_PhoneNumber",
    m_OtherContactNumber: "m_OtherContactNumber",
    m_ProjectManager: "m_ProjectManager",
    m_SiteContact: "m_SiteContact",
    m_SiteContactPhoneNumber: "m_SiteContactPhoneNumber",
    m_SiteContactEmail: "m_SiteContactEmail",
    m_Comment_1: "m_Comment_1",
    m_Community: "m_Community",
  },
  invoice: {
    m_DepositValue: "m_DepositValue",
    m_ListPrice: "m_ListPrice",
    m_Commission: "m_Lism_CommissiontPrice",
    m_PaymentType: "m_PaymentType",
    m_Discount: "m_Discount",
    m_Tax: "m_Tax", // dropdown of No Tax, GST, GST+ PST, PST Exempt
    m_PO: "m_PO",
    m_PSTExemptionNumber: "m_PSTExemptionNumber", // when input only show when its PST
  },
  status: {
    invoiceStatus: "invoiceStatus",
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
