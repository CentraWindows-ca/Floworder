import OrdersApi from "./OrdersApi";
import constants from "lib/constants";

export default {
  getFiles: async (masterId) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "Prod_UploadingFiles",
      filters: [
        {
          field: "MasterId",
          operator: "Equals",
          value: masterId,
        },
        {
          field: "ProdTypeId",
          operator: "Equals",
          value: constants.PROD_TYPES.m.toString(),
        },
      ],
    });
  },
  getImages: async (masterId) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "Prod_UploadingImages",
      filters: [
        {
          field: "MasterId",
          operator: "Equals",
          value: masterId,
        },
        {
          field: "ProdTypeId",
          operator: "Equals",
          value: constants.PROD_TYPES.m.toString(),
        },
      ],
    });
  },

  getDoorItems: async (WorkOrderNo) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "ProdDoorItems",
      filters: [
        {
          field: "WorkOrderNo",
          operator: "Equals",
          value: WorkOrderNo,
        },
      ],
    });
  },

  getWindowItems: async (WorkOrderNo) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "ProdWindowItems",
      filters: [
        {
          field: "WorkOrderNo",
          operator: "Equals",
          value: WorkOrderNo,
        },
      ],
    });
  },

  getWorkOrder: async (initWorkOrderNo) => {
    return (
      OrdersApi.queryWorkOrderHeaderWithPrefixAsync(null, {
        pageSize: 1,
        page: 1,
        filters: [
          {
            field: "m_WorkOrderNo",
            operator: constants.FILTER_OPERATOR.Equals,
            value: initWorkOrderNo,
          },
        ],
        kind: "m",
      }) || {}
    );
  },

  updateWindowItem: async(m_MasterId, Id, fields) => {
    return (
      OrdersApi.updateAnyTableAsync(null, {
        table: "ProdWindowItems",
        keyColumn: "Id",
        keyValue: Id,
        masterId: m_MasterId,
        fields,
      }) || {}
    );
  },

  updateDoorItem: async(m_MasterId, Id, fields) => {
    return (
      OrdersApi.updateAnyTableAsync(null, {
        table: "ProdDoorItems",
        keyColumn: "Id",
        keyValue: Id,
        masterId: m_MasterId,
        fields,
      }) || {}
    );
  }, 

  updateWorkOrder: async (m_MasterId, fields) => {
    return (
      OrdersApi.updateWorkOrderHeaderWithPrefixAsync(null, {
        keyValue: m_MasterId,
        masterId: m_MasterId,
        fields,
      }) || {}
    );
  },
};
