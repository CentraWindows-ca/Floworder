
/**
 * this will be called by hooks/useXxxxDictionary
 */
const flowfinity = {
  branch: ['GetBranch', '/Remake'],
  department: ['GetDepartment', '/Remake'],
  product: ['GetProduct', '/Remake'],
  remakeReason: ['GetRemakeReasons', '/Remake'],
  rack: ['RackManagement/AllRacks']
}

const portal = {
  salesReps: ['https://centraportalapi.centra.ca/estimator/coversheet/GetSales?groupName=Sales%20Reps']
}

/*
  GetProjectManagers
  GetSales("Sales Reps")

  https://calendarapi.centra.ca/Production/GetSalesRepsByRange?startDay=2025-1-1T00:00:00&endDay=2025-1-31T23:59:59&branch=null
  https://calendarapi.centra.ca/Common/GetProjectManagers
  https://centraportalapi.centra.ca/estimator/coversheet/GetSales?groupName=Sales%20Reps
*/


export default {
  flowfinity,
  portal
};
