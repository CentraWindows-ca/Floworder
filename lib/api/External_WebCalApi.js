import utils from "lib/utils";
import { fetcher, CAL_API } from "lib/api/SERVER";

export async function createPTTimestamp(body) {
  // const newTimestamp = {
  //   WorkorderNo: parentWO.workorderNumber,
  //   Notes: "",
  //   StatusStart: oldStatus,
  //   StatusEnd: newStatus,
  //   SubQty: doorItems?.[itemIndex]?.SubQty1,
  //   ItemNo: doorItems?.[itemIndex]?.Item1,
  //   Date: currentDateTime,
  //   Type: "Transition",
  //   UserEmail: userData?.email
  // };

  const api = `/CreatePTTimestamp`;
  const data = await fetcher(
    api,
    "/Production",
    {
      method: "POST",
      body,
    },
    CAL_API,
  );
  return data;
}

export async function bulkUpdateItemTrackingList(
  updateList,
  initData,
  initDataItems,
) {
  const currentDateTime = new Date();
  const UserEmail = localStorage.getItem("user_email");
  const awaitList = updateList
    .map((a) => {
      const itemId = a?.keyValue;
      const { Status } = a?.fields;
      // only track it if status change
      if (!Status) {
        return null;
      }
      const initItem = initDataItems?.find((it) => it.Id === itemId);
      const body = {
        WorkorderNo: initData.m_WorkOrderNo,
        Notes: `Updated from order management`,
        Type: "Transition",
        StatusStart: initItem.Status,
        StatusEnd: Status,
        ItemNo: initItem.Item,
        SubQty: initItem.SubQty,
        Date: currentDateTime,
        UserEmail,
      };

      return createPTTimestamp(body);
    })
    ?.filter((a) => a);

  return await Promise.all(awaitList);
}

export default {
  createPTTimestamp,
  bulkUpdateItemTrackingList,
};
