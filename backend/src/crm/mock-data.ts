export const dashboardMock = {
  stats: [
    { title: 'Total leads', value: '482', trend: '+8%', accent: 'purple' },
    { title: 'Open deals', value: '37', trend: '-2%', accent: 'coral' },
    { title: 'New customers', value: '50', trend: '+12%', accent: 'violet' },
    { title: 'Converted', value: '49', trend: '+10%', accent: 'purple' },
  ],
  applications: [
    { name: 'WhatsApp', value: 58, color: '#6f3ff5' },
    { name: 'Instagram', value: 26, color: '#ffae43' },
    { name: 'Landing Page', value: 16, color: '#ffe256' },
  ],
  leadsByMonth: [
    { month: 'Jan', value: 22 },
    { month: 'Feb', value: 28 },
    { month: 'Mar', value: 24 },
    { month: 'Apr', value: 38 },
    { month: 'May', value: 41 },
    { month: 'Jun', value: 39 },
    { month: 'Jul', value: 52 },
    { month: 'Aug', value: 66 },
    { month: 'Sep', value: 61 },
    { month: 'Oct', value: 74 },
    { month: 'Nov', value: 78 },
    { month: 'Dec', value: 71 },
  ],
  turnoverData: [
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: 62 },
    { label: 'May', value: 58 },
    { label: 'Jun', value: 41 },
    { label: 'Jul', value: 35 },
    { label: 'Aug', value: 76 },
  ],
  interviewList: [
    { name: 'Sharolta Pirs', department: 'Premium consultant', date: 'Dec 8, 2021' },
    { name: 'Jane Clifford', department: 'Lead specialist', date: 'Dec 8, 2021' },
    { name: 'Tom Smith', department: 'Sales support', date: 'Dec 7, 2021' },
  ],
  calendarItems: [
    { hour: '10 am', title: 'Store meeting', subtitle: 'North unit' },
    { hour: '11 am', title: 'Lead callback', subtitle: 'Premium line' },
    { hour: '2 pm', title: 'Docs review', subtitle: 'Vehicle finance' },
    { hour: '11 am', title: 'Final pitch', subtitle: 'General manager' },
    { hour: '3 pm', title: 'Client follow-up', subtitle: 'VIP pipeline' },
    { hour: '4 pm', title: 'Create task', subtitle: 'CRM squad' },
  ],
};

export const leadsMock = [
  { id: 'lead-1', name: 'Marina Costa', origin: 'WhatsApp', store: 'Jacarei', status: 'Negotiation', tone: 'violet', owner: 'Ana' },
  { id: 'lead-2', name: 'Carlos Mendes', origin: 'Instagram', store: 'Sao Jose', status: 'Qualified', tone: 'gold', owner: 'Bruno' },
  { id: 'lead-3', name: 'Leticia Souza', origin: 'Store visit', store: 'Taubate', status: 'Contacted', tone: 'violet', owner: 'Caio' },
  { id: 'lead-4', name: 'Rafael Lima', origin: 'Phone', store: 'Jacarei', status: 'New', tone: 'slate', owner: 'Duda' },
];

export const customersMock = [
  { id: 'customer-1', name: 'Marina Costa', city: 'Jacarei', stage: 'VIP', lastDeal: 'Corolla Cross', contact: '2 min ago' },
  { id: 'customer-2', name: 'Carlos Mendes', city: 'Sao Jose', stage: 'Returning', lastDeal: 'Compass Longitude', contact: '28 min ago' },
  { id: 'customer-3', name: 'Leticia Souza', city: 'Taubate', stage: 'First buy', lastDeal: 'Nivus Highline', contact: '1 h ago' },
  { id: 'customer-4', name: 'Rafael Lima', city: 'Jacarei', stage: 'Priority', lastDeal: 'Creta Platinum', contact: '3 h ago' },
];

export const negotiationsMock = [
  { id: 'deal-1', lead: 'Marina Costa', vehicle: 'Corolla Cross', stage: 'Proposal', amount: 'R$ 168.900', probability: 82 },
  { id: 'deal-2', lead: 'Carlos Mendes', vehicle: 'Compass Longitude', stage: 'Docs review', amount: 'R$ 152.500', probability: 67 },
  { id: 'deal-3', lead: 'Leticia Souza', vehicle: 'Nivus Highline', stage: 'Closing', amount: 'R$ 141.000', probability: 91 },
  { id: 'deal-4', lead: 'Rafael Lima', vehicle: 'Creta Platinum', stage: 'Qualification', amount: 'R$ 139.900', probability: 48 },
];
