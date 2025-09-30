export const mockKpiData = {
  totalUsers: {
    value: "12,450",
    change: "+12.5%",
    changeType: "positive",
  },
  monthlyRevenue: {
    value: "$45,890",
    change: "+8.2%",
    changeType: "positive",
  },
  conversionRate: {
    value: "4.8%",
    change: "-0.5%",
    changeType: "negative",
  },
  churnRate: {
    value: "1.2%",
    change: "+0.1%",
    changeType: "negative",
  },
};
export const mockUserAcquisitionData = [
  { name: "Week 1", users: 400 },
  { name: "Week 2", users: 300 },
  { name: "Week 3", users: 500 },
  { name: "Week 4", users: 780 },
  { name: "Week 5", users: 650 },
  { name: "Week 6", users: 920 },
  { name: "Week 7", users: 850 },
  { name: "Week 8", users: 1100 },
];
export const mockSalesFunnelData = {
  stages: [
    { stage: "Prospects", value: 10000 },
    { stage: "Leads", value: 7500 },
    { stage: "Opportunities", value: 3200 },
    { stage: "Proposals", value: 1500 },
    { stage: "Closed Won", value: 800 },
  ],
};
export const mockCustomerSegmentationData = [
    { name: 'Enterprise', value: 400 },
    { name: 'Pro', value: 300 },
    { name: 'Startup', value: 300 },
    { name: 'Free Tier', value: 200 },
];