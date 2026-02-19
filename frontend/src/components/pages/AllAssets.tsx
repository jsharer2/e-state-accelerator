import { Filter, Search, Download, MoreVertical } from 'lucide-react@0.344.0';

export function AllAssets() {
  const categories = [
    'All Categories',
    'Financial',
    'Social Media',
    'Email',
    'Cloud Storage',
    'Subscriptions',
    'Cryptocurrency',
  ];

  const statuses = ['All Status', 'Secured', 'Accessed', 'In Progress', 'Pending', 'Identified'];

  const assets = [
    { name: 'Chase Bank - Checking', category: 'Financial', status: 'Secured', value: '$12,450', date: 'Jan 15, 2026' },
    { name: 'Wells Fargo - Savings', category: 'Financial', status: 'Secured', value: '$45,230', date: 'Jan 15, 2026' },
    { name: 'Gmail Account', category: 'Email', status: 'Accessed', value: '-', date: 'Jan 28, 2026' },
    { name: 'Facebook Profile', category: 'Social Media', status: 'Pending', value: '-', date: 'Jan 30, 2026' },
    { name: 'Dropbox Storage', category: 'Cloud', status: 'Identified', value: '2TB', date: 'Jan 28, 2026' },
    { name: 'PayPal Account', category: 'Financial', status: 'In Progress', value: '$1,230', date: 'Feb 1, 2026' },
    { name: 'LinkedIn Profile', category: 'Social Media', status: 'Pending', value: '-', date: 'Jan 29, 2026' },
    { name: 'iCloud Storage', category: 'Cloud', status: 'Accessed', value: '200GB', date: 'Jan 27, 2026' },
    { name: 'Coinbase', category: 'Cryptocurrency', status: 'In Progress', value: '$8,450', date: 'Feb 1, 2026' },
    { name: 'Netflix', category: 'Subscriptions', status: 'Secured', value: '-', date: 'Jan 25, 2026' },
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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 border-2 border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-500">
            {categories.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <select className="px-4 py-2 border-2 border-gray-300 rounded text-sm text-gray-700 focus:outline-none focus:border-gray-500">
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button className="px-4 py-2 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors">
            + Add Asset
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search all assets..."
              className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-300">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Asset Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {assets.map((asset, idx) => (
                <tr key={idx} className={`hover:bg-blue-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                }`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded"></div>
                      <span className="text-sm text-gray-900">{asset.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{asset.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(asset.status)}`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900">{asset.value}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{asset.date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-200 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-300 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 10 of 27 assets</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border-2 border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
            <button className="px-3 py-1 border-2 border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              2
            </button>
            <button className="px-3 py-1 border-2 border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              3
            </button>
            <button className="px-3 py-1 border-2 border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}