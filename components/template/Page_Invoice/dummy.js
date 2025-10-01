// generateDummy.js

const ITEM_STATUS = [
  { key: "Not Started" },
  { key: "In-Progress" },
  { key: "Ready To Ship" },
  { key: "Shipped" },
  { key: "On Hold" },
];

const INVOICE_STATUS = [
  { key: "Ready For Invoice" },
  { key: "Pending Payment" },
  { key: "On Hold" },
  { key: "Completed Payment" },
];

const NAMES = [
  "Alice Johnson",
  "Bob Smith",
  "Charlie Brown",
  "Diana Prince",
  "Ethan Clark",
  "Fiona Davis",
  "George Wilson",
  "Hannah Lee",
  "Ian Thompson",
  "Julia Adams",
];

// Pick a random element from an array
function randomPick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generate a random date within the last 30 days
function randomDate() {
  const now = new Date();
  const past = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);
  return past.toISOString().slice(0, 19);
}

// Generate dummy data
function generateDummy(count = 50) {
  const result = [];
  for (let i = 0; i < count; i++) {
    const num = (1000 + i).toString(); // invoice number as a 4-digit string
    const date = randomDate();
    result.push({
      invoiceNumber: num,
      m_Status: randomPick(ITEM_STATUS).key,
      invoiceStatus: randomPick(INVOICE_STATUS).key,
      createdAt: date,
      createdBy: randomPick(NAMES),
    });
  }
  return result;
}

const DUMMY = generateDummy(30);

export default DUMMY