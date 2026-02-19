import { Square, CheckSquare } from 'lucide-react@0.344.0';

export function ActionChecklist() {
  const actions = [
    { id: 1, text: 'Request death certificates', completed: true },
    { id: 2, text: 'Contact major financial institutions', completed: true },
    { id: 3, text: 'Secure email accounts', completed: false },
    { id: 4, text: 'Inventory cloud storage', completed: false },
    { id: 5, text: 'Download photos and videos', completed: false },
    { id: 6, text: 'Review subscription services', completed: false },
    { id: 7, text: 'Close social media accounts', completed: false },
  ];

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <div className="p-5 border-b border-gray-200 bg-white rounded-t-lg">
        <h2 className="text-lg font-semibold text-gray-900">Action Items</h2>
        <p className="text-xs text-gray-600 mt-1">2 of 7 completed</p>
      </div>
      
      <div className="p-5 bg-white rounded-b-lg">
        <div className="mb-4">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600" style={{ width: '28.5%' }}></div>
          </div>
        </div>
        
        <ul className="space-y-3">
          {actions.map((action) => (
            <li key={action.id} className="flex items-start gap-3 group">
              <button className="mt-0.5 text-gray-400 hover:text-gray-700 transition-colors">
                {action.completed ? (
                  <CheckSquare className="w-5 h-5 text-green-600" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
              </button>
              <span
                className={`text-sm flex-1 ${
                  action.completed ? 'text-gray-500 line-through' : 'text-gray-700'
                }`}
              >
                {action.text}
              </span>
            </li>
          ))}
        </ul>
        
        <button className="w-full mt-5 px-4 py-2 border-2 border-dashed border-gray-300 text-sm text-gray-600 rounded hover:border-gray-400 hover:text-gray-700 transition-colors">
          + Add Action Item
        </button>
      </div>
    </div>
  );
}