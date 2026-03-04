import { MoreVertical, Search } from 'lucide-react';

export function AssetList() {
  const assets = [
    {
      id: 1,
      name: 'Chase Bank - Checking',
      category: 'Financial',
      status: 'Secured',
      lastUpdated: '2 days ago',
    },
    {
      id: 2,
      name: 'Gmail Account',
      category: 'Email',
      status: 'Accessed',
      lastUpdated: '1 week ago',
    },
    {
      id: 3,
      name: 'Facebook Profile',
      category: 'Social Media',
      status: 'Pending',
      lastUpdated: '3 days ago',
    },
    {
      id: 4,
      name: 'Dropbox Storage',
      category: 'Cloud',
      status: 'Identified',
      lastUpdated: '5 days ago',
    },
    {
      id: 5,
      name: 'PayPal Account',
      category: 'Financial',
      status: 'In Progress',
      lastUpdated: '1 day ago',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Secured':
        return 'bg-green-600 text-white';
      case 'Accessed':
        return 'bg-blue-600 text-white';
      case 'In Progress':
        return 'bg-yellow-500 text-gray-900';
      case 'Pending':
        return 'bg-gray-200 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="bg-white border-2 border-gray-300 rounded-lg">
      <div className="p-5 border-b border-gray-300">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-normal text-gray-900">Recent Assets</h2>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
            + Add Asset
          </button>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search assets..."
            className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500"
          />
        </div>
      </div>
      
      <div className="divide-y divide-gray-200 bg-white">
        {assets.map((asset, idx) => (
          <div
            key={asset.id}
            className={`p-5 hover:bg-blue-50 transition-colors flex items-center justify-between ${
              idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
            }`}
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded"></div>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{asset.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{asset.category}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded text-xs ${getStatusColor(asset.status)}`}>
                {asset.status}
              </span>
              <span className="text-xs text-gray-500 w-20 text-right">{asset.lastUpdated}</span>
              <button className="p-1 hover:bg-gray-200 rounded">
                <MoreVertical className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}