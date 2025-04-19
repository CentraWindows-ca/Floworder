import _ from "lodash";
import OrdersApi from "./OrdersApi";
import ProdHistoryApi from "./ProdHistoryApi";
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

  getDoorItems: async (masterId) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "ProdDoorItems",
      filters: [
        {
          field: "MasterId",
          operator: "Equals",
          value: masterId,
        },
      ],
    });
  },
  
  getWindowItems: async (masterId) => {
    return OrdersApi.queryAnyTableAsync(null, {
      table: "ProdWindowItems",
      filters: [
        {
          field: "MasterId",
          operator: "Equals",
          value: masterId,
        },
      ],
    });
  },

  getWorkOrder: async (initMasterId, isActive) => {
    return (
      OrdersApi.queryWorkOrderHeaderWithPrefixAsync(null, {
        pageSize: 1,
        page: 1,
        filters: [
          {
            field: "m_MasterId",
            operator: constants.FILTER_OPERATOR.Equals,
            value: initMasterId,
          },
        ],
        kind: "m",
        isActive
      }) || {}
    );
  },

  getWorkOrderHistory: async (m_MasterId) => {
    return (
      ProdHistoryApi.queryWorkOrderHistoryAsync({
        masterId: m_MasterId,
      }) || {}
    );
  },

  updateItemList:  async (m_MasterId, updates, kind, ref, refItems) => {
    if (_.isEmpty(updates)) {
      return {};
    }

    updates = updates?.filter(a => !_.isEmpty(a.fields))

    return (
      OrdersApi.batchUpdateTableAsync(null, {
        table: kind === 'w' ? "ProdWindowItems": "ProdDoorItems",
        keyColumn: "Id",
        updates,
        masterId: m_MasterId,
      }, ref, refItems) || {}
    );
  },

  updateWorkOrder: async ({ m_MasterId }, fields, ref) => {
    if (_.isEmpty(fields)) {
      return {};
    }

    return (
      OrdersApi.updateWorkOrderHeaderWithPrefixAsync(null, {
        keyValue: m_MasterId,
        masterId: m_MasterId,
        fields,
      }, ref) || {}
    );
  },
};
