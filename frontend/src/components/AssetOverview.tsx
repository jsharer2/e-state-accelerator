import { Wallet, Users, Mail, Cloud } from 'lucide-react@0.344.0';

export function AssetOverview() {
  const stats = [
    { icon: Wallet, label: 'Financial Accounts', count: 12, status: '8 Secured' },
    { icon: Users, label: 'Social Media', count: 6, status: '3 Closed' },
    { icon: Mail, label: 'Email Accounts', count: 4, status: '2 Accessed' },
    { icon: Cloud, label: 'Cloud Storage', count: 5, status: '1 Pending' },
  ];

  // Calculate completion percentage
  const totalAssets = 27;
  const securedAssets = 8;
  const completionPercentage = Math.round((securedAssets / totalAssets) * 100);

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Estate Progress</h2>
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600">{securedAssets} of {totalAssets} assets secured</p>
          <p className="text-lg font-semibold text-blue-600">{completionPercentage}% Complete</p>
        </div>
        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600" style={{ width: `${completionPercentage}%` }}></div>
        </div>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Overview</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="p-2 bg-gray-100 rounded">
                <stat.icon className="w-6 h-6 text-gray-700" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-normal text-gray-900">{stat.count}</div>
              </div>
            </div>
            <p className="text-sm text-gray-700 font-medium">{stat.label}</p>
            <p className="text-xs text-gray-500 mt-1">{stat.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}