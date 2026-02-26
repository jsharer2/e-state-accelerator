import { Square, CheckSquare, Plus, Calendar, User } from 'lucide-react@0.344.0';

export function ActionItems() {
  const actionGroups = [
    {
      title: 'Immediate Actions',
      items: [
        { text: 'Request death certificates', completed: true, priority: 'High', assignee: 'You', dueDate: 'Jan 10', overdue: false },
        { text: 'Contact major financial institutions', completed: true, priority: 'High', assignee: 'You', dueDate: 'Jan 15', overdue: false },
        { text: 'Secure email accounts', completed: false, priority: 'High', assignee: 'You', dueDate: 'Feb 5', overdue: true },
      ],
    },
    {
      title: 'Asset Management',
      items: [
        { text: 'Inventory cloud storage', completed: false, priority: 'Medium', assignee: 'You', dueDate: 'Feb 10', overdue: false },
        { text: 'Download photos and videos', completed: false, priority: 'Medium', assignee: 'Assistant', dueDate: 'Feb 15', overdue: false },
        { text: 'Review cryptocurrency accounts', completed: false, priority: 'High', assignee: 'You', dueDate: 'Feb 8', overdue: true },
      ],
    },
    {
      title: 'Account Closure',
      items: [
        { text: 'Review subscription services', completed: false, priority: 'Low', assignee: 'You', dueDate: 'Feb 20', overdue: false },
        { text: 'Close social media accounts', completed: false, priority: 'Low', assignee: 'Assistant', dueDate: 'Feb 25', overdue: false },
        { text: 'Cancel recurring payments', completed: false, priority: 'Medium', assignee: 'You', dueDate: 'Feb 12', overdue: false },
      ],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'text-red-700 bg-red-100';
      case 'Medium':
        return 'text-yellow-700 bg-yellow-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  // Calculate overdue count
  const overdueCount = actionGroups.reduce((total, group) => {
    return total + group.items.filter(item => item.overdue && !item.completed).length;
  }, 0);

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-normal text-gray-900">Overall Progress</h2>
            <p className="text-sm text-gray-600 mt-1">2 of 11 tasks completed</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-gray-800" style={{ width: '18%' }}></div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <div className="text-2xl font-normal text-gray-900">11</div>
            <div className="text-xs text-gray-600 mt-1">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-normal text-gray-900">2</div>
            <div className="text-xs text-gray-600 mt-1">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-normal text-gray-900">4</div>
            <div className="text-xs text-gray-600 mt-1">High Priority</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-normal text-gray-900">{overdueCount}</div>
            <div className="text-xs text-gray-600 mt-1">Overdue</div>
          </div>
        </div>
      </div>

      {actionGroups.map((group) => (
        <div key={group.title} className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
          <div className="p-5 border-b border-gray-200 bg-white rounded-t-lg">
            <h3 className="text-base font-semibold text-gray-900">{group.title}</h3>
          </div>
          <div className="p-5 bg-white rounded-b-lg">
            <div className="space-y-4">
              {group.items.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-4 p-4 border rounded transition-all ${
                    item.overdue && !item.completed
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 bg-gray-50 hover:border-blue-300'
                  }`}
                >
                  <button className="mt-0.5 text-gray-400 hover:text-gray-700 transition-colors">
                    {item.completed ? (
                      <CheckSquare className="w-5 h-5 text-green-600" />
                    ) : (
                      <Square className="w-5 h-5" />
                    )}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <p
                        className={`text-sm flex-1 ${
                          item.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {item.text}
                      </p>
                      {item.overdue && !item.completed && (
                        <span className="text-xs px-2 py-1 bg-red-600 text-white rounded font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <User className="w-3 h-3" />
                        {item.assignee}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Calendar className="w-3 h-3" />
                        {item.dueDate}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}