import { Home, Search, FolderOpen, CheckSquare, FileText, Settings } from 'lucide-react@0.344.0';
import { Page } from '../App';

interface SidebarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems = [
    { icon: Home, label: 'Dashboard', page: 'dashboard' as Page },
    { icon: Search, label: 'Asset Discovery', page: 'discovery' as Page },
    { icon: FolderOpen, label: 'All Assets', page: 'assets' as Page },
    { icon: CheckSquare, label: 'Action Items', page: 'actions' as Page },
    { icon: FileText, label: 'Documents', page: 'documents' as Page },
    { icon: Settings, label: 'Settings', page: 'settings' as Page },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-300 flex flex-col">
      <div className="p-6 border-b border-gray-300">
        <div className="w-full h-8 bg-blue-600 rounded flex items-center justify-center">
          <span className="text-white text-sm font-medium">Digital Estate</span>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.label}>
              <button
                onClick={() => onNavigate(item.page)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                  currentPage === item.page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-300">
        <div className="p-4 border-2 border-dashed border-gray-300 rounded">
          <p className="text-xs text-gray-600">Case ID: EST-2024-001</p>
          <p className="text-xs text-gray-600 mt-1">Decedent: John Doe</p>
        </div>
      </div>
    </aside>
  );
}