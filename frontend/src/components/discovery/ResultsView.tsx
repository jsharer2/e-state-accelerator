import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface ResultsViewProps {
  assets: any[];
  onAddAssets: () => void;
  onCancel: () => void;
}

function normalizeAsset(asset: any) {
  // Handle MBOX AccountLead format
  if (asset.base_domain && asset.brand !== undefined) {
    const score = asset.total_score || 0;
    const confidence = score > 75 ? 'High' : score > 50 ? 'Medium' : 'Low';
    
    const categories = [];
    if (asset.any_auth) categories.push('Authentication');
    if (asset.any_billing) categories.push('Billing/Payment');
    if (asset.any_subscription) categories.push('Subscription');
    if (asset.any_rewards) categories.push('Rewards');
    if (asset.any_cloud_domain) categories.push('Cloud');
    
    return {
      name: asset.brand || asset.base_domain,
      category: categories.length > 0 ? categories.join(', ') : 'Service',
      confidence,
      domain: asset.base_domain,
      messages: asset.messages,
      score: asset.total_score,
      signals: {
        auth: asset.any_auth,
        billing: asset.any_billing,
        subscription: asset.any_subscription,
        rewards: asset.any_rewards,
        cloud: asset.any_cloud_domain,
      },
      subjects: asset.example_subjects || [],
      firstSeen: asset.first_seen,
      lastSeen: asset.last_seen,
    };
  }
  
  // Handle regular asset format
  return {
    name: asset.name,
    category: asset.category,
    confidence: asset.confidence,
    email: asset.email,
    username: asset.username,
  };
}

export function ResultsView({ assets, onAddAssets, onCancel }: ResultsViewProps) {
  const [selectedAssets, setSelectedAssets] = useState<number[]>(
    assets.map((_, idx) => idx)
  );
  const [expandedAsset, setExpandedAsset] = useState<number | null>(null);

  const normalizedAssets = assets.map(normalizeAsset);

  const toggleAsset = (idx: number) => {
    setSelectedAssets((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const toggleExpand = (idx: number) => {
    setExpandedAsset(expandedAsset === idx ? null : idx);
  };

  const selectAll = () => {
    setSelectedAssets(assets.map((_, idx) => idx));
  };

  const deselectAll = () => {
    setSelectedAssets([]);
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-medium text-gray-900">Scan Complete</h3>
            <p className="text-sm text-gray-600 mt-1">
              Found {assets.length} potential asset{assets.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={selectAll}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Select All
            </button>
            <span className="text-gray-300">|</span>
            <button
              onClick={deselectAll}
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mb-4">
          <p className="text-sm text-gray-700">
            Review the assets found below. Select the ones you want to add to your inventory.
            You can expand each item to see more details.
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-6 max-h-[400px] overflow-y-auto">
        {normalizedAssets.map((asset, idx) => {
          const isSelected = selectedAssets.includes(idx);
          const isExpanded = expandedAsset === idx;

          return (
            <div
              key={idx}
              className={`border-2 rounded-lg transition-colors ${
                isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
              }`}
            >
              <div className="p-4 flex items-center gap-3">
                <button
                  onClick={() => toggleAsset(idx)}
                  className="flex-shrink-0"
                >
                  {isSelected ? (
                    <CheckCircle2 className="w-5 h-5 text-blue-600" />
                  ) : (
                    <div className="w-5 h-5 border-2 border-gray-300 rounded-full"></div>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {asset.name}
                      </p>
                      <p className="text-xs text-gray-500">{asset.category}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      asset.confidence === 'High'
                        ? 'bg-green-600 text-white'
                        : 'bg-yellow-500 text-gray-900'
                    }`}
                  >
                    {asset.confidence}
                  </span>
                  <button
                    onClick={() => toggleExpand(idx)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-600" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="px-4 pb-4 border-t border-gray-200">
                  <div className="pt-4 space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Category</p>
                        <p className="text-sm text-gray-900">{asset.category}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Confidence</p>
                        <p className="text-sm text-gray-900">{asset.confidence}</p>
                      </div>
                      {asset.domain && (
                        <div>
                          <p className="text-xs text-gray-500">Domain</p>
                          <p className="text-sm text-gray-900 font-mono">{asset.domain}</p>
                        </div>
                      )}
                      {asset.messages && (
                        <div>
                          <p className="text-xs text-gray-500">Messages Found</p>
                          <p className="text-sm text-gray-900">{asset.messages}</p>
                        </div>
                      )}
                      {asset.score && (
                        <div>
                          <p className="text-xs text-gray-500">Confidence Score</p>
                          <p className="text-sm text-gray-900">{asset.score}</p>
                        </div>
                      )}
                      {asset.email && (
                        <div>
                          <p className="text-xs text-gray-500">Email</p>
                          <p className="text-sm text-gray-900">{asset.email}</p>
                        </div>
                      )}
                      {asset.username && (
                        <div>
                          <p className="text-xs text-gray-500">Username</p>
                          <p className="text-sm text-gray-900">{asset.username}</p>
                        </div>
                      )}
                    </div>
                    {asset.signals && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Detection Signals</p>
                        <div className="flex flex-wrap gap-1">
                          {asset.signals.auth && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              Authentication
                            </span>
                          )}
                          {asset.signals.billing && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Billing
                            </span>
                          )}
                          {asset.signals.subscription && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              Subscription
                            </span>
                          )}
                          {asset.signals.rewards && (
                            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                              Rewards
                            </span>
                          )}
                          {asset.signals.cloud && (
                            <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">
                              Cloud
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                    {asset.subjects && asset.subjects.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">Example Subjects</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {asset.subjects.slice(0, 3).map((subject: string, i: number) => (
                            <li key={i} className="truncate">• {subject}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-300 pt-6 flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {selectedAssets.length} of {assets.length} selected
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 border-2 border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onAddAssets}
            disabled={selectedAssets.length === 0}
            className={`px-4 py-2 text-sm rounded transition-colors ${
              selectedAssets.length > 0
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Add {selectedAssets.length} Asset{selectedAssets.length !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </div>
  );
}