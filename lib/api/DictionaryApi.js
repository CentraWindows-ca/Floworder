
/**
 * this will be called by hooks/useXxxxDictionary
 */
const flowfinity = {
  branch: ['GetBranch', '/Remake'],
  department: ['GetDepartment', '/Remake'],
  product: ['GetProduct', '/Remake'],
  remakeReason: ['GetRemakeReasons', '/Remake']
}

const crm = {
  branch: ['GetBranch', '/Sales']
}

export default {
  flowfinity,
  crm
};
