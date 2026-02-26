import { useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react@0.344.0';

interface ResultsViewProps {
  assets: any[];
  onAddAssets: () => void;
  onCancel: () => void;
}

export function ResultsView({ assets, onAddAssets, onCancel }: ResultsViewProps) {
  const [selectedAssets, setSelectedAssets] = useState<number[]>(
    assets.map((_, idx) => idx)
  );
  const [expandedAsset, setExpandedAsset] = useState<number | null>(null);

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
        {assets.map((asset, idx) => {
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
                      {asset.lastUsed && (
                        <div>
                          <p className="text-xs text-gray-500">Last Used</p>
                          <p className="text-sm text-gray-900">{asset.lastUsed}</p>
                        </div>
                      )}
                      {asset.visits && (
                        <div>
                          <p className="text-xs text-gray-500">Visits</p>
                          <p className="text-sm text-gray-900">{asset.visits}</p>
                        </div>
                      )}
                      {asset.source && (
                        <div>
                          <p className="text-xs text-gray-500">Source</p>
                          <p className="text-sm text-gray-900">{asset.source}</p>
                        </div>
                      )}
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-gray-500 mb-2">Actions</p>
                      <div className="flex gap-2">
                        <button className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          Edit Details
                        </button>
                        <button className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                          Mark as Irrelevant
                        </button>
                      </div>
                    </div>
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