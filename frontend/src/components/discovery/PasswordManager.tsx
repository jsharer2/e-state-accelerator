import { useState, useMemo } from 'react';

type Category = 'streaming' | 'finance' | 'subscription' | 'other';
type Confidence = 'High' | 'Medium' | 'Low';

export interface Credential {
  id: number;
  name: string;
  username: string;
  password: string;
  category: Category;
  confidence: Confidence;
  url?: string;
}

interface PasswordManagerProps {
  initialCredentials?: Credential[];
  onSave?: (creds: Credential[]) => void;
}

const CATEGORY_STYLES: Record<Category, { bg: string; text: string; label: string }> = {
  streaming:    { bg: 'bg-gray-100',   text: 'text-gray-600',   label: 'ST' },
  finance:      { bg: 'bg-blue-50',    text: 'text-blue-700',   label: 'FI' },
  subscription: { bg: 'bg-emerald-50', text: 'text-emerald-700',label: 'SB' },
  other:        { bg: 'bg-amber-50',   text: 'text-amber-700',  label: 'OT' },
};

const CONFIDENCE_BADGE: Record<Confidence, string> = {
  High:   'bg-green-100 text-green-700',
  Medium: 'bg-amber-100 text-amber-700',
  Low:    'bg-gray-100 text-gray-500',
};

function maskPassword(p: string) {
  return '•'.repeat(Math.min(p.length, 10));
}

function getPasswordStrength(p: string) {
  let score = 0;
  if (p.length >= 8)           score++;
  if (/[A-Z]/.test(p))        score++;
  if (/[0-9]/.test(p))        score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', 'bg-red-400', 'bg-amber-400', 'bg-amber-400', 'bg-green-400'];
  return { score, label: labels[score], color: colors[score] };
}

const DEMO_CREDENTIALS: Credential[] = [
  { id: 1, name: 'Netflix',        username: 'jane@email.com', password: 'Netfl1x$ecure!', category: 'streaming',    confidence: 'High'   },
  { id: 2, name: 'Spotify',        username: 'jane@email.com', password: 'Sp0tify2024',    category: 'streaming',    confidence: 'High'   },
  { id: 3, name: 'Chase Bank',     username: 'jane.doe',       password: 'Ch@se#9821',     category: 'finance',      confidence: 'High'   },
  { id: 4, name: 'Adobe Creative', username: 'jane@email.com', password: 'adobe123',       category: 'subscription', confidence: 'Medium' },
  { id: 5, name: 'Dropbox',        username: 'jane@email.com', password: 'drop',           category: 'subscription', confidence: 'Low'    },
  { id: 6, name: 'Hulu',           username: 'jane@email.com', password: 'Hulu!Pass22',    category: 'streaming',    confidence: 'Medium' },
];

export function PasswordManager({ initialCredentials = DEMO_CREDENTIALS, onSave }: PasswordManagerProps) {
  const [credentials, setCredentials] = useState<Credential[]>(initialCredentials);
  const [expandedId, setExpandedId]   = useState<number | null>(null);
  const [shownIds, setShownIds]        = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab]      = useState<Category | 'all'>('all');
  const [search, setSearch]            = useState('');
  const [toast, setToast]              = useState('');
  const [showModal, setShowModal]      = useState(false);
  const [nextId, setNextId]            = useState(DEMO_CREDENTIALS.length + 1);
  const [form, setForm] = useState({ name: '', username: '', password: '', category: 'streaming' as Category, confidence: 'High' as Confidence });

  const filtered = useMemo(() => credentials.filter((c) => {
    if (activeTab !== 'all' && c.category !== activeTab) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) &&
        !c.username.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }), [credentials, activeTab, search]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 1800); };
  const copyToClipboard = (text: string) => { navigator.clipboard.writeText(text).catch(() => {}); showToast('Copied to clipboard'); };

  const toggleShow = (id: number) => setShownIds((prev) => {
    const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next;
  });

  const deleteCredential = (id: number) => {
    const updated = credentials.filter((c) => c.id !== id);
    setCredentials(updated); setExpandedId(null); onSave?.(updated); showToast('Credential removed');
  };

  const addCredential = () => {
    if (!form.name || !form.username || !form.password) { showToast('Fill in all fields'); return; }
    const updated = [...credentials, { id: nextId, ...form }];
    setCredentials(updated); setNextId((n) => n + 1);
    setForm({ name: '', username: '', password: '', category: 'streaming', confidence: 'High' });
    setShowModal(false); onSave?.(updated); showToast('Credential saved');
  };

  const strength = getPasswordStrength(form.password);
  const TABS: Array<{ key: Category | 'all'; label: string }> = [
    { key: 'all', label: 'All' }, { key: 'streaming', label: 'Streaming' },
    { key: 'finance', label: 'Finance' }, { key: 'subscription', label: 'Subscription' },
  ];

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-start justify-between mb-5">
        <div>
          <h3 className="text-base font-medium text-gray-900">Credential Vault</h3>
          <p className="text-sm text-gray-600 mt-1">{credentials.length} assets stored</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
          + Add credential
        </button>
      </div>
      <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or username..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md mb-3 focus:outline-none focus:border-gray-400" />
      <div className="flex gap-2 mb-4">
        {TABS.map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)} className={`px-3 py-1 text-xs rounded-md border ${activeTab === key ? 'bg-gray-100 border-gray-300 text-gray-800' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>{label}</button>
        ))}
      </div>
      <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto">
        {filtered.length === 0 && <p className="text-center text-sm text-gray-500 py-8">No credentials found</p>}
        {filtered.map((cred) => {
          const isExpanded = expandedId === cred.id;
          const isShown    = shownIds.has(cred.id);
          const catStyle   = CATEGORY_STYLES[cred.category];
          return (
            <div key={cred.id} className={`border rounded-xl transition-colors ${isExpanded ? 'border-gray-300' : 'border-gray-200 hover:border-gray-300'} bg-white`}>
              <button className="w-full flex items-center gap-3 p-3 text-left" onClick={() => setExpandedId(isExpanded ? null : cred.id)}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-medium flex-shrink-0 ${catStyle.bg} ${catStyle.text}`}>{catStyle.label}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">{cred.name}</div>
                  <div className="text-xs text-gray-500 truncate">{cred.username}</div>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-md ${CONFIDENCE_BADGE[cred.confidence]}`}>{cred.confidence}</span>
              </button>
              {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-100 pt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-20 flex-shrink-0">Username</span>
                    <code className="flex-1 text-xs bg-gray-50 px-2 py-1.5 rounded-md truncate">{cred.username}</code>
                    <button onClick={() => copyToClipboard(cred.username)} className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500" title="Copy username">Copy</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-20 flex-shrink-0">Password</span>
                    <code className="flex-1 text-xs bg-gray-50 px-2 py-1.5 rounded-md truncate">{isShown ? cred.password : maskPassword(cred.password)}</code>
                    <button onClick={() => toggleShow(cred.id)} className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500" title={isShown ? 'Hide' : 'Show'}>{isShown ? 'Hide' : 'Show'}</button>
                    <button onClick={() => copyToClipboard(cred.password)} className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-500" title="Copy password">Copy</button>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => deleteCredential(cred.id)} className="text-xs text-red-500 hover:text-red-700 border border-red-200 hover:border-red-300 px-2.5 py-1 rounded-md">Remove</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="border-t border-gray-300 pt-4">
        <p className="text-sm text-gray-600">{filtered.length} of {credentials.length} shown</p>
      </div>
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="bg-white rounded-xl border border-gray-200 p-5 w-80 shadow-lg">
            <h3 className="text-base font-medium text-gray-900 mb-4">Add credential</h3>
            <label className="block text-xs text-gray-500 mb-1">Service name</label>
            <input className="w-full mb-3 px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Netflix" />
            <label className="block text-xs text-gray-500 mb-1">Username / email</label>
            <input className="w-full mb-3 px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="user@email.com" />
            <label className="block text-xs text-gray-500 mb-1">Password</label>
            <input className="w-full mb-1 px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-gray-400" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" />
            {form.password && (
              <div className="mb-3">
                <div className="flex gap-1 mt-1 mb-0.5">{[1,2,3,4].map((i) => (<div key={i} className={`h-0.5 flex-1 rounded-full ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />))}</div>
                <p className="text-xs text-gray-400">{strength.label}</p>
              </div>
            )}
            <label className="block text-xs text-gray-500 mb-1">Category</label>
            <select className="w-full mb-3 px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })}>
              <option value="streaming">Streaming</option>
              <option value="finance">Finance</option>
              <option value="subscription">Subscription</option>
              <option value="other">Other</option>
            </select>
            <label className="block text-xs text-gray-500 mb-1">Confidence</label>
            <select className="w-full mb-4 px-2.5 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none" value={form.confidence} onChange={(e) => setForm({ ...form, confidence: e.target.value as Confidence })}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1.5 text-sm border border-gray-200 rounded-md text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={addCredential} className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">Save</button>
            </div>
          </div>
        </div>
      )}
      {toast && <div className="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm shadow-md z-50">{toast}</div>}
    </div>
  );
}
