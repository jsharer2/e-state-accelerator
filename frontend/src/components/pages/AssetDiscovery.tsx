import { useState } from 'react';
import { Mail, Key, Upload, Search, Smartphone, FileText } from 'lucide-react@0.344.0';
import { DiscoveryModal } from '../discovery/DiscoveryModal';

export type DiscoveryMethod = 'email' | 'password' | 'device' | 'document' | 'manual' | 'browser';

export function AssetDiscovery() {
  const [selectedMethod, setSelectedMethod] = useState<DiscoveryMethod | null>(null);

  const discoveryMethods = [
    {
      icon: Mail,
      title: 'Email Scan',
      description: 'Scan email accounts for service confirmations and account registrations',
      action: 'Start Email Scan',
      method: 'email' as DiscoveryMethod,
    },
    {
      icon: Key,
      title: 'Password Manager',
      description: 'Import credentials from password management tools',
      action: 'Import Passwords',
      method: 'password' as DiscoveryMethod,
    },
    {
      icon: Smartphone,
      title: 'Device Analysis',
      description: 'Analyze devices for installed applications and saved accounts',
      action: 'Scan Device',
      method: 'device' as DiscoveryMethod,
    },
    {
      icon: Upload,
      title: 'Document Upload',
      description: 'Upload bank statements, bills, and other documents to identify accounts',
      action: 'Upload Documents',
      method: 'document' as DiscoveryMethod,
    },
    {
      icon: FileText,
      title: 'Manual Entry',
      description: 'Manually add known accounts and services',
      action: 'Add Manually',
      method: 'manual' as DiscoveryMethod,
    },
    {
      icon: Search,
      title: 'Browser History',
      description: 'Review browser history for frequently accessed services',
      action: 'Analyze History',
      method: 'browser' as DiscoveryMethod,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-gray-300 rounded-lg p-6">
        <h2 className="text-lg font-normal text-gray-900 mb-2">Discovery Progress</h2>
        <p className="text-sm text-gray-600 mb-4">27 potential assets identified</p>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600" style={{ width: '64%' }}></div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-normal text-gray-900">27</div>
            <div className="text-xs text-gray-600 mt-1">Identified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-normal text-gray-900">12</div>
            <div className="text-xs text-gray-600 mt-1">Verified</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-normal text-gray-900">8</div>
            <div className="text-xs text-gray-600 mt-1">Secured</div>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-3">What happens after securing an asset?</h3>
        <div className="space-y-2 text-sm text-gray-700">
          <p className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span><strong>Secured status:</strong> The account is accessed and under your control</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span><strong>Download data:</strong> We'll help you backup important information and files</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span><strong>Account closure:</strong> You can choose to close, memorialize, or transfer the account</span>
          </p>
          <p className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span><strong>Documentation:</strong> All actions are logged for legal and estate records</span>
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Discovery Methods</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {discoveryMethods.map((method) => (
            <div
              key={method.title}
              className="bg-gray-50 border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="p-3 bg-gray-100 rounded inline-block mb-4">
                <method.icon className="w-6 h-6 text-gray-700" />
              </div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">{method.title}</h3>
              <p className="text-xs text-gray-600 mb-4 min-h-[2.5rem]">{method.description}</p>
              <button 
                onClick={() => setSelectedMethod(method.method)}
                className="w-full px-4 py-2 border-2 border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-50 transition-colors"
              >
                {method.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Discoveries</h2>
        <div className="space-y-3">
          {[
            { name: 'Netflix Subscription', source: 'Email Scan', date: '2 hours ago' },
            { name: 'Amazon Prime Account', source: 'Email Scan', date: '3 hours ago' },
            { name: 'Coinbase Wallet', source: 'Password Manager', date: '5 hours ago' },
            { name: 'Spotify Premium', source: 'Email Scan', date: '1 day ago' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">Source: {item.source}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{item.date}</span>
                <button className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors">
                  Review
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedMethod && (
        <DiscoveryModal 
          method={selectedMethod} 
          onClose={() => setSelectedMethod(null)} 
        />
      )}
    </div>
  );
}