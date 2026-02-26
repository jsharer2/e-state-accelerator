import { User, Bell, Lock, Shield, Download, Trash2 } from 'lucide-react@0.344.0';

export function Settings() {
  return (
    <div className="space-y-6">
      <div className="bg-white border-2 border-gray-300 rounded-lg">
        <div className="p-5 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-normal text-gray-900">Account Information</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                defaultValue="Executor Name"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                defaultValue="executor@email.com"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              defaultValue="+1 (555) 123-4567"
              className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
          </div>
          <div className="pt-2">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-300 rounded-lg">
        <div className="p-5 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-normal text-gray-900">Security</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Change Password</label>
            <div className="space-y-3">
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500"
              />
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500"
              />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded">
            <div>
              <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
              <p className="text-xs text-gray-600 mt-1">Add an extra layer of security</p>
            </div>
            <button className="px-4 py-2 border-2 border-gray-300 rounded text-sm text-gray-700 hover:bg-gray-50 transition-colors">
              Enable
            </button>
          </div>
          <div className="pt-2">
            <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
              Update Password
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-2 border-gray-300 rounded-lg">
        <div className="p-5 border-b border-gray-300">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-normal text-gray-900">Notifications</h2>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: 'New asset discovered', description: 'Get notified when new assets are identified' },
            { label: 'Action item reminders', description: 'Receive reminders for upcoming tasks' },
            { label: 'Document uploads', description: 'Notify when documents are added' },
            { label: 'Status changes', description: 'Get updates when asset status changes' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.label}</p>
                <p className="text-xs text-gray-600 mt-1">{item.description}</p>
              </div>
              <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer">
                <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
        <div className="p-5 border-b border-gray-200 bg-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Download className="w-5 h-5 text-gray-700" />
            <h2 className="text-lg font-semibold text-gray-900">Data & Privacy</h2>
          </div>
        </div>
        <div className="p-6 space-y-3 bg-white rounded-b-lg">
          <button className="w-full flex items-center justify-between p-4 border-2 border-gray-300 rounded hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-gray-700" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Export All Data</p>
                <p className="text-xs text-gray-600 mt-1">Download a complete copy of your data</p>
              </div>
            </div>
          </button>
          <button className="w-full flex items-center justify-between p-4 border-2 border-red-300 rounded hover:bg-red-50 transition-colors">
            <div className="flex items-center gap-3">
              <Trash2 className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-600">Delete Case</p>
                <p className="text-xs text-red-500 mt-1">Permanently delete this case and all data</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}