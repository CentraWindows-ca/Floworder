import _ from "lodash";

// order -
export const labelMapping = {
  m_WorkOrderNo: { title: "Work Order#" },
  inv_createdAt: { title: "Created At" },
  inv_lastModifiedBy: { title: "Modified By" },
  inv_invoiceId: {title: "Invoice Id"},
  invh_invoiceStatus: { title: "Invoice Status" },
  invh_invoiceId: { title: "Invoice#" },
  invh_bcInvoiceNo: { title: "Business Central Invoice#" },
  invh_rejectReason: { title: "On Hold Reason" },
  invh_rejectNotes: { title: "On Hold Notes" },
  invh_invoiceHeaderId: { title: "Invoice Header Id" },
  invh_paidDate: { title: "Paid Date" },
  inv_invoiceAmount: { title: "Invoice Amount (CAD)" },

  // fields copied from OM to Invoice - order
  m_Status: { title: "Work Order Status" },
  m_Source: { title: "Source" },
  m_CustomerName: { title: "Customer Name" },
  m_CustomerNo: { title: "Customer#" },
  m_Branch: { title: "Branch" },
  m_Email: { title: "Email" },
  m_PhoneNumber: { title: "Phone" },
  m_Address: { title: "Address" },
  m_City: { title: "City" },
  m_CompleteDate: { title: "Actual Shipped Date" },
  m_SalesRep: { title: "Sales Rep" },
  m_JobType: { title: "Job Type" },

  // fields copied from OM to Invoice - invoice
  m_DepositValue: { title: "Deposit (CAD)" },
  m_ListPrice: { title: "Sold Price (CAD)" },
  m_Commission: { title: "Commission %" },
  m_PaymentType: { title: "Payment Type" },
  m_Discount: { title: "Discount %" },
  m_Tax: { title: "Tax" }, // dropdown of No Tax, GST, GST+ PST, PST Exempt
  m_PO: { title: "PO" },
  m_PSTExemptionNumber: { title: "PST Exemption Number" }, // when input only show when its PST
};

// NOTE: UI thing, original requirement is from VK wants to split save button for WO edit sections
export const uiWoFieldEditGroupMapping = {
  invoice: {
    inv_invoiceAmount: "inv_invoiceAmount",
    invh_bcInvoiceNo: "invh_bcInvoiceNo",
    invh_rejectReason: "invh_rejectReason",
    invh_rejectNotes: "invh_rejectNotes",
  },
  invoiceBilling: {
    m_DepositValue: "m_DepositValue",
    m_ListPrice: "m_ListPrice",
    m_Commission: "m_Commission",
    m_PaymentType: "m_PaymentType",
    m_Discount: "m_Discount",
    m_Tax: "m_Tax", // dropdown of No Tax, GST, GST+ PST, PST Exempt
    m_PO: "m_PO",
    m_PSTExemptionNumber: "m_PSTExemptionNumber", // when input only show when its PST
  },
  basic: {
    m_WorkOrderNo: "m_WorkOrderNo",
    m_Status: "m_Status",
    m_Source: "m_Source",
    m_CustomerName: "m_CustomerName",
    m_CustomerNo: "m_CustomerNo",
    m_Branch: "m_Branch",
    m_JobType: "m_JobType",
    m_Email: "m_Email",
    m_PhoneNumber: "m_PhoneNumber",
    m_Address: "m_Address",
    m_City: "m_City",
    m_CompleteDate: "m_CompleteDate",
    m_SalesRep: "m_SalesRep",
    inv_createdAt: "inv_createdAt",
    inv_lastModifiedBy: "inv_lastModifiedBy",
  },
  status: {
    invh_invoiceStatus: "invh_invoiceStatus",
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
