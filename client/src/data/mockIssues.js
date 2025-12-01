export const mockIssue = {
  id: 1,
  title: "Leaky Faucet",
  description: "Kitchen faucet has been dripping for 2 days",
  category: "Plumbing",
  priority: "urgent",
  status: "open",
  createdAt: new Date(),
  updatedAt: new Date(),
  messageCount: 3,
  photoCount: 2,
  tenantName: "John Doe",
  propertyAddress: "123 Main St, Apt 4B",
};

export const mockIssues = [
  {
    id: 2,
    title: "Leaky Faucet",
    description: "Kitchen faucet has been dripping for 2 days",
    category: "Plumbing",
    priority: "high",
    status: "in_progress",
    acknowledged_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(),
    messageCount: 5,
    photoCount: 3,
    tenantName: "Jane Smith",
    propertyAddress: "456 Oak Ave, Unit 2A",
  },
  {
    id: 3,
    title: "AC Not Working",
    description: "Air conditioning stopped cooling yesterday",
    category: "HVAC",
    priority: "medium",
    status: "resolved",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    messageCount: 8,
    photoCount: 1,
    tenantName: "Bob Johnson",
    propertyAddress: "789 Pine St, Apt 5C",
  },
  {
    id: 4,
    title: "Noise Complaint",
    description: "Neighbors playing loud music late at night",
    category: "Complaint",
    priority: "low",
    status: "closed",
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    updatedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    messageCount: 2,
    photoCount: 0,
    tenantName: "Alice Brown",
    propertyAddress: "321 Elm Dr, Unit 1B",
  }
];
