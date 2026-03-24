import { useEffect, useState } from 'react';
import { BrowserRouter, NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  Bell,
  CalendarDays,
  ChevronRight,
  CirclePlus,
  FileText,
  Filter,
  Handshake,
  LayoutGrid,
  MessageCircle,
  MoreHorizontal,
  Search,
  Shield,
  Users,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type LoginCard = {
  id: string;
  title: string;
  accent: 'violet' | 'yellow' | 'logo';
  symbol?: string;
};

const stats = [
  { title: 'Total leads', value: '482', trend: '+8%', accent: 'purple' },
  { title: 'Open deals', value: '37', trend: '-2%', accent: 'coral' },
  { title: 'New customers', value: '50', trend: '+12%', accent: 'violet' },
  { title: 'Converted', value: '49', trend: '+10%', accent: 'purple' },
] as const;

const applications = [
  { name: 'WhatsApp', value: 58, color: '#6f3ff5' },
  { name: 'Instagram', value: 26, color: '#ffae43' },
  { name: 'Landing Page', value: 16, color: '#ffe256' },
];

const leadsByMonth = [
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
];

const turnoverData = [
  { label: 'Mar', value: 38 },
  { label: 'Apr', value: 62 },
  { label: 'May', value: 58 },
  { label: 'Jun', value: 41 },
  { label: 'Jul', value: 35 },
  { label: 'Aug', value: 76 },
];

const interviewList = [
  { name: 'Sharolta Pirs', department: 'Premium consultant', date: 'Dec 8, 2021' },
  { name: 'Jane Clifford', department: 'Lead specialist', date: 'Dec 8, 2021' },
  { name: 'Tom Smith', department: 'Sales support', date: 'Dec 7, 2021' },
];

const calendarItems = [
  { hour: '10 am', title: 'Store meeting', subtitle: 'North unit' },
  { hour: '11 am', title: 'Lead callback', subtitle: 'Premium line' },
  { hour: '2 pm', title: 'Docs review', subtitle: 'Vehicle finance' },
  { hour: '11 am', title: 'Final pitch', subtitle: 'General manager' },
  { hour: '3 pm', title: 'Client follow-up', subtitle: 'VIP pipeline' },
  { hour: '4 pm', title: 'Create task', subtitle: 'CRM squad' },
];

const leadRows = [
  { name: 'Marina Costa', origin: 'WhatsApp', store: 'Jacarei', status: 'Negotiation', tone: 'violet', owner: 'Ana' },
  { name: 'Carlos Mendes', origin: 'Instagram', store: 'Sao Jose', status: 'Qualified', tone: 'gold', owner: 'Bruno' },
  { name: 'Leticia Souza', origin: 'Store visit', store: 'Taubate', status: 'Contacted', tone: 'violet', owner: 'Caio' },
  { name: 'Rafael Lima', origin: 'Phone', store: 'Jacarei', status: 'New', tone: 'slate', owner: 'Duda' },
] as const;

const customerRows = [
  { name: 'Marina Costa', city: 'Jacarei', stage: 'VIP', lastDeal: 'Corolla Cross', contact: '2 min ago' },
  { name: 'Carlos Mendes', city: 'Sao Jose', stage: 'Returning', lastDeal: 'Compass Longitude', contact: '28 min ago' },
  { name: 'Leticia Souza', city: 'Taubate', stage: 'First buy', lastDeal: 'Nivus Highline', contact: '1 h ago' },
  { name: 'Rafael Lima', city: 'Jacarei', stage: 'Priority', lastDeal: 'Creta Platinum', contact: '3 h ago' },
];

const dealRows = [
  { lead: 'Marina Costa', vehicle: 'Corolla Cross', stage: 'Proposal', amount: 'R$ 168.900', probability: 82 },
  { lead: 'Carlos Mendes', vehicle: 'Compass Longitude', stage: 'Docs review', amount: 'R$ 152.500', probability: 67 },
  { lead: 'Leticia Souza', vehicle: 'Nivus Highline', stage: 'Closing', amount: 'R$ 141.000', probability: 91 },
  { lead: 'Rafael Lima', vehicle: 'Creta Platinum', stage: 'Qualification', amount: 'R$ 139.900', probability: 48 },
];

const loginCards: LoginCard[] = [
  { id: 'care', title: 'Total care.\nTotal different.', accent: 'violet' },
  { id: 'trust', title: 'Building trust\nin blockchain\ntechnology', accent: 'yellow', symbol: '+' },
  { id: 'logo', title: '', accent: 'logo' },
  { id: 'power', title: 'Own\nyour power', accent: 'yellow', symbol: '+' },
];

const loginSequences = [
  [0, 2, 5, 4],
  [4, 3, 0, 1],
  [3, 2, 5, 0],
  [1, 3, 4, 5],
];

const slotMap = [
  { left: 28, top: 36 },
  { left: 160, top: 36 },
  { left: 160, top: 168 },
  { left: 160, top: 300 },
  { left: 28, top: 300 },
  { left: 28, top: 168 },
];

const menuPrimary = [
  { label: 'Dashboard', icon: LayoutGrid, to: '/dashboard' },
  { label: 'Leads', icon: Bell, to: '/leads' },
  { label: 'Customers', icon: Users, to: '/customers' },
  { label: 'Deals', icon: Handshake, to: '/negotiations' },
];

const menuSecondary = [
  { label: 'Documents', icon: FileText, to: '/dashboard' },
  { label: 'Support', icon: Shield, to: '/dashboard' },
  { label: 'Calendar', icon: CalendarDays, to: '/dashboard' },
  { label: 'Chat', icon: MessageCircle, to: '/dashboard' },
];

const apiBaseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:3000/api';
const authStorageKey = 'crm-auth-token';

function getAuthToken() {
  return window.localStorage.getItem(authStorageKey);
}

function setAuthToken(token: string) {
  window.localStorage.setItem(authStorageKey, token);
}

function clearAuthToken() {
  window.localStorage.removeItem(authStorageKey);
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/leads" element={<ProtectedRoute><LeadsPage /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
        <Route path="/negotiations" element={<ProtectedRoute><NegotiationsPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

function LoginPage() {
  const navigate = useNavigate();
  const [sequenceIndex, setSequenceIndex] = useState(0);
  const [email, setEmail] = useState('admin@crm.local');
  const [password, setPassword] = useState('123456');
  const [name, setName] = useState('Admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSequenceIndex((current) => (current + 1) % loginSequences.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="login-shell">
      <motion.div className="login-browser" initial={{ opacity: 0, y: 28, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.65, ease: 'easeOut' }}>
        <div className="browser-topbar">
          <div className="browser-dots"><span className="dot red" /><span className="dot yellow" /><span className="dot green" /></div>
          <div className="browser-nav"><span className="browser-arrow">{'<'}</span><span className="browser-arrow">{'>'}</span></div>
          <div className="browser-tab">fundex.revolution</div>
          <div className="browser-actions"><span /><span /><span /></div>
        </div>
        <div className="login-stage">
          <section className="login-visual">
            <div className="login-pattern" />
            <div className="login-grid">
              {Array.from({ length: 6 }).map((_, index) => <div key={index} className="login-slot" />)}
              {loginCards.map((card, index) => {
                const position = slotMap[loginSequences[sequenceIndex][index]];
                return (
                  <motion.article
                    key={card.id}
                    className={`floating-card ${card.accent}`}
                    animate={{ top: position.top, left: position.left }}
                    initial={false}
                    transition={{ type: 'spring', damping: 18, stiffness: 120 }}
                  >
                    {card.symbol ? <span className="floating-symbol">{card.symbol}</span> : null}
                    {card.accent === 'logo' ? <div className="floating-logo"><span /><span /></div> : <p>{card.title}</p>}
                  </motion.article>
                );
              })}
            </div>
          </section>
          <section className="login-form-panel">
            <motion.div className="login-form-wrap" initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.55 }}>
              <h1>Sign Up</h1>
              <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</p>
              <form
                className="login-form"
                onSubmit={async (event) => {
                  event.preventDefault();
                  setIsSubmitting(true);
                  setError('');

                  try {
                    const response = await fetch(`${apiBaseUrl}/auth/login`, {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        email,
                        password,
                      }),
                    });

                    if (!response.ok) {
                      throw new Error('Unable to sign in');
                    }

                    const payload = (await response.json()) as { accessToken: string };
                    setAuthToken(payload.accessToken);
                    navigate('/dashboard');
                  } catch {
                    setError('Use the seeded credentials or start the backend before signing in.');
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                <label><span>First Name</span><input value={name} onChange={(event) => setName(event.target.value)} /></label>
                <label><span>Password</span><input type="password" value={password} onChange={(event) => setPassword(event.target.value)} /></label>
                <label><span>Email</span><input value={email} onChange={(event) => setEmail(event.target.value)} /></label>
                <motion.button whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }} className="login-submit" disabled={isSubmitting}>{isSubmitting ? 'Signing in...' : 'Log In'}</motion.button>
              </form>
              {error ? <p className="login-error">{error}</p> : null}
              <div className="login-divider"><span /><small>Or</small><span /></div>
              <div className="social-actions"><button type="button">Google</button><button type="button">Facebook</button></div>
            </motion.div>
          </section>
        </div>
      </motion.div>
    </div>
  );
}

function DashboardPage() { return <DashboardShell title="Dashboard"><DashboardOverview /></DashboardShell>; }
function LeadsPage() { return <DashboardShell title="Leads"><LeadsContent /></DashboardShell>; }
function CustomersPage() { return <DashboardShell title="Customers"><CustomersContent /></DashboardShell>; }
function NegotiationsPage() { return <DashboardShell title="Deals"><NegotiationsContent /></DashboardShell>; }

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!getAuthToken()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function useRemoteData<T>(path: string, fallback: T) {
  const [data, setData] = useState<T>(fallback);

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const token = getAuthToken();
        const response = await fetch(`${apiBaseUrl}${path}`, {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : undefined,
        });

        if (!response.ok) {
          return;
        }

        const payload = (await response.json()) as T;
        if (!ignore) {
          setData(payload);
        }
      } catch {
        // Keep the visual fallback when the API is offline during UI work.
      }
    }

    void load();

    return () => {
      ignore = true;
    };
  }, [path]);

  return data;
}

function DashboardShell({ title, children }: { title: string; children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="app-shell">
      <div className="ambient ambient-left" />
      <div className="ambient ambient-right" />
      <aside className="design-rail">
        <section><p className="rail-title">Tools</p><div className="tool-list"><div className="figma-mark"><span className="figma-dot figma-red" /><span className="figma-dot figma-blue" /><span className="figma-dot figma-purple" /><span className="figma-dot figma-green" /></div><span className="rail-caption">Figma</span></div></section>
        <section><p className="rail-title">Colors</p><div className="palette">{['#6F3FF5', '#FFAE43', '#FFE256'].map((color) => <div key={color} className="palette-pill" style={{ backgroundColor: color }}><span>{color}</span></div>)}</div></section>
        <section><p className="rail-title">Typography</p><div className="type-sample"><strong>TT Norms</strong><span>Aa Bb Cc Dd Ee Ff ..</span><span>123456789</span></div></section>
      </aside>
      <motion.main className="dashboard-frame" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: 'easeOut' }}>
        <aside className="sidebar">
          <div>
            <div className="brand"><h1>HR</h1><span>Automation Tool</span></div>
            <div className="menu-group"><p>Tools</p>{menuPrimary.map(({ label, icon: Icon, to }) => <NavLink key={label} to={to} className={({ isActive }) => `menu-item ${isActive ? 'active' : ''}`}><Icon size={16} /><span>{label}</span></NavLink>)}</div>
            <div className="menu-group"><p>Other</p>{menuSecondary.map(({ label, icon: Icon, to }) => <NavLink key={label} to={to} className="menu-item"><Icon size={16} /><span>{label}</span></NavLink>)}</div>
          </div>
          <div className="profile-card"><div className="profile-avatar">M</div><div><strong>Mr. Afflek</strong><span>Head of HR</span></div></div>
        </aside>
        <section className="dashboard-content">
          <header className="topbar">
            <h2>{title}</h2>
            <div className="topbar-actions">
              <label className="searchbox"><Search size={16} /><input placeholder="Search" /></label>
              {title !== 'Dashboard' ? <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} className="primary-action"><CirclePlus size={16} /><span>New item</span></motion.button> : null}
              <button
                className="ghost-filter"
                onClick={() => {
                  clearAuthToken();
                  navigate('/login');
                }}
              >
                Sign out
              </button>
            </div>
          </header>
          {children}
        </section>
      </motion.main>
      <div className="brand-mark"><span /><span /></div>
    </div>
  );
}

function DashboardOverview() {
  const dashboard = useRemoteData('/crm/dashboard', {
    stats,
    applications,
    leadsByMonth,
    turnoverData,
    interviewList,
    calendarItems,
  });

  return (
    <>
      <section className="stats-grid">
        {dashboard.stats.map((stat, index) => <motion.article key={stat.title} className="stat-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.45 }} whileHover={{ y: -4 }}><div><p>{stat.title}</p><strong>{stat.value}</strong></div><div className={`spark ${stat.accent}`}><span>{stat.trend}</span><svg viewBox="0 0 80 30" preserveAspectRatio="none"><path d="M2 20 C 12 8, 18 4, 28 10 S 42 26, 54 14 S 68 2, 78 10" /></svg></div></motion.article>)}
      </section>
      <section className="content-grid">
        <article className="panel panel-pie"><div className="panel-head"><h3>Applications</h3></div><div className="pie-layout"><div className="chart-wrap compact"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={dashboard.applications} dataKey="value" innerRadius={36} outerRadius={58} paddingAngle={4} stroke="none">{dashboard.applications.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie></PieChart></ResponsiveContainer></div><div className="legend-list">{dashboard.applications.map((item) => <div key={item.name} className="legend-item"><span className="legend-dot" style={{ backgroundColor: item.color }} /><span>{item.name}</span><strong>{item.value}%</strong></div>)}</div></div></article>
        <article className="panel panel-list"><div className="panel-head"><h3>Interviews</h3><button>View all</button></div><div className="table-head"><span>Name</span><span>Department</span><span>Time</span></div><div className="interview-list">{dashboard.interviewList.map((item, index) => <div key={item.name} className="interview-row"><div className="person-cell"><div className={`avatar avatar-${index + 1}`}>{item.name.charAt(0)}</div><span>{item.name}</span></div><span className="muted">{item.department}</span><span className="muted">{item.date}</span></div>)}</div></article>
        <article className="panel panel-bars"><div className="panel-head"><h3>Staff Turnover</h3><MoreHorizontal size={18} /></div><div className="chart-wrap bars"><ResponsiveContainer width="100%" height="100%"><BarChart data={dashboard.turnoverData} barCategoryGap={18}><CartesianGrid vertical={false} stroke="#f1edf9" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#a29bb7', fontSize: 12 }} /><YAxis hide /><Tooltip cursor={{ fill: 'rgba(111, 63, 245, 0.08)' }} /><Bar dataKey="value" radius={[10, 10, 10, 10]}>{dashboard.turnoverData.map((entry, index) => <Cell key={entry.label} fill={index === 1 || index === 5 ? '#6f3ff5' : '#ece4ff'} />)}</Bar></BarChart></ResponsiveContainer></div></article>
        <article className="panel panel-line"><div className="panel-head"><div><h3>Applicants Received Time</h3><span>Jan - Dec 2021</span></div><button className="panel-link"><span>Jan - Dec 2021</span><ChevronRight size={16} /></button></div><div className="chart-wrap line"><ResponsiveContainer width="100%" height="100%"><LineChart data={dashboard.leadsByMonth}><CartesianGrid vertical={false} stroke="#f3eefc" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a29bb7', fontSize: 12 }} /><YAxis hide /><Tooltip /><Line type="monotone" dataKey="value" stroke="#6f3ff5" strokeWidth={3} dot={false} activeDot={{ r: 7, stroke: '#ffffff', strokeWidth: 3, fill: '#6f3ff5' }} /></LineChart></ResponsiveContainer></div><div className="line-badge">78</div></article>
        <article className="panel panel-calendar"><div className="panel-head"><h3>Calendar</h3><button>View all</button></div><div className="calendar-date">Dec 09, 2021</div><div className="calendar-grid">{dashboard.calendarItems.map((item) => <div key={`${item.hour}-${item.title}`} className="calendar-item"><strong>{item.hour}</strong><div><span>{item.title}</span><small>{item.subtitle}</small></div></div>)}</div></article>
      </section>
    </>
  );
}

function LeadsContent() {
  const leadsData = useRemoteData('/crm/leads', {
    overview: {
      active: 189,
      responseRate: '62%',
      firstReply: '14m',
    },
    chart: leadsByMonth,
    rows: leadRows,
  });

  return (
    <section className="entity-grid">
      <article className="panel soft-panel"><div className="panel-head"><div><h3>Pipeline overview</h3><span>Last 30 days</span></div><button className="ghost-filter"><Filter size={16} /><span>Filters</span></button></div><div className="mini-stats"><div><strong>{leadsData.overview.active}</strong><span>Active leads</span></div><div><strong>{leadsData.overview.responseRate}</strong><span>Response rate</span></div><div><strong>{leadsData.overview.firstReply}</strong><span>Avg. first reply</span></div></div><div className="chart-wrap chart-tall"><ResponsiveContainer width="100%" height="100%"><LineChart data={leadsData.chart}><CartesianGrid vertical={false} stroke="#f3eefc" /><XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#a29bb7', fontSize: 12 }} /><YAxis hide /><Tooltip /><Line type="monotone" dataKey="value" stroke="#6f3ff5" strokeWidth={3} dot={false} /></LineChart></ResponsiveContainer></div></article>
      <article className="panel table-panel"><div className="panel-head"><h3>Recent leads</h3><button>View all</button></div><div className="entity-table"><div className="entity-head"><span>Lead</span><span>Origin</span><span>Store</span><span>Status</span><span>Owner</span></div>{leadsData.rows.map((row) => <div key={row.name} className="entity-row"><span>{row.name}</span><span>{row.origin}</span><span>{row.store}</span><span><Badge tone={row.tone}>{row.status}</Badge></span><span>{row.owner}</span></div>)}</div></article>
    </section>
  );
}

function CustomersContent() {
  const customersData = useRemoteData('/crm/customers', {
    segments: [
      { value: 74, label: 'VIP customers', tone: 'default' },
      { value: 46, label: 'Returning buyers', tone: 'warm' },
      { value: 31, label: 'Ready for upgrade', tone: 'yellow' },
    ],
    rows: customerRows,
  });

  return (
    <section className="entity-grid customers-grid">
      <article className="panel table-panel"><div className="panel-head"><h3>Top relationships</h3><button>Export</button></div><div className="entity-table"><div className="entity-head entity-head-customers"><span>Name</span><span>City</span><span>Stage</span><span>Last vehicle</span><span>Last contact</span></div>{customersData.rows.map((row, index) => <div key={row.name} className="entity-row entity-row-customers"><span className="customer-cell"><span className={`avatar avatar-${(index % 3) + 1}`}>{row.name.charAt(0)}</span><span>{row.name}</span></span><span>{row.city}</span><span><Badge tone="violet">{row.stage}</Badge></span><span>{row.lastDeal}</span><span>{row.contact}</span></div>)}</div></article>
      <article className="panel side-metrics"><div className="panel-head"><h3>Segments</h3><MoreHorizontal size={18} /></div>{customersData.segments.map((segment) => <div key={segment.label} className={`segment-card ${segment.tone === 'default' ? '' : segment.tone}`}><strong>{segment.value}</strong><span>{segment.label}</span></div>)}</article>
    </section>
  );
}

function NegotiationsContent() {
  const negotiationsData = useRemoteData('/crm/negotiations', {
    chart: turnoverData,
    pipelineValue: 'R$ 602k',
    rows: dealRows,
  });

  return (
    <section className="entity-grid deals-grid">
      <article className="panel table-panel"><div className="panel-head"><div><h3>Negotiation board</h3><span>Current active deals</span></div><button>Board view</button></div><div className="deal-stack">{negotiationsData.rows.map((row) => <motion.div key={row.lead} className="deal-card" whileHover={{ y: -3 }}><div className="deal-top"><div><strong>{row.lead}</strong><span>{row.vehicle}</span></div><Badge tone={row.probability > 80 ? 'violet' : row.probability > 60 ? 'gold' : 'slate'}>{row.stage}</Badge></div><div className="deal-bottom"><span>{row.amount}</span><div className="probability-track"><div className="probability-fill" style={{ width: `${row.probability}%` }} /></div><small>{row.probability}% close probability</small></div></motion.div>)}</div></article>
      <article className="panel side-metrics"><div className="panel-head"><h3>Closing status</h3><MoreHorizontal size={18} /></div><div className="chart-wrap chart-tall-small"><ResponsiveContainer width="100%" height="100%"><BarChart data={negotiationsData.chart}><CartesianGrid vertical={false} stroke="#f1edf9" /><XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: '#a29bb7', fontSize: 12 }} /><YAxis hide /><Tooltip /><Bar dataKey="value" radius={[12, 12, 12, 12]}>{negotiationsData.chart.map((entry, index) => <Cell key={entry.label} fill={index % 2 === 0 ? '#6f3ff5' : '#ffe256'} />)}</Bar></BarChart></ResponsiveContainer></div><div className="segment-card"><strong>{negotiationsData.pipelineValue}</strong><span>Pipeline value</span></div></article>
    </section>
  );
}

function Badge({ children, tone }: { children: string; tone: 'violet' | 'gold' | 'slate' }) {
  return <span className={`badge ${tone}`}>{children}</span>;
}

export default App;
