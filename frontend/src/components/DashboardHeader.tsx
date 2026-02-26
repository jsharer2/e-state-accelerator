import { Bell, User } from 'lucide-react@0.344.0';
import { Page } from '../App';

interface DashboardHeaderProps {
  currentPage: Page;
}

export function DashboardHeader({ currentPage }: DashboardHeaderProps) {
  const getPageTitle = () => {
    switch (currentPage) {
      case 'dashboard':
        return { 
          title: 'Dashboard', 
          subtitle: 'We\'re here to help you navigate this process step by step.',
          description: 'Track your progress and manage digital assets'
        };
      case 'discovery':
        return { 
          title: 'Asset Discovery', 
          subtitle: 'Take your time—we\'ll help you find what you\'re looking for.',
          description: 'Find and identify digital assets'
        };
      case 'assets':
        return { 
          title: 'All Assets', 
          subtitle: 'Every step forward is progress. You\'re doing great.',
          description: 'Complete inventory of digital assets'
        };
      case 'actions':
        return { 
          title: 'Action Items', 
          subtitle: 'We\'ve organized everything to make this easier for you.',
          description: 'Track and manage required tasks'
        };
      case 'documents':
        return { 
          title: 'Documents', 
          subtitle: 'Keep important files organized and accessible in one place.',
          description: 'Store and organize important files'
        };
      case 'settings':
        return { 
          title: 'Settings', 
          subtitle: 'Adjust your preferences to work at your own pace.',
          description: 'Configure your preferences'
        };
      default:
        return { 
          title: 'Dashboard', 
          subtitle: 'We\'re here to help you navigate this process step by step.',
          description: 'Track your progress and manage digital assets'
        };
    }
  };

  const { title, subtitle, description } = getPageTitle();

  return (
    <header className="bg-white border-b border-gray-300 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-normal text-gray-900">{title}</h1>
          <p className="text-base text-blue-600 mt-2">{subtitle}</p>
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-4 border-l border-gray-300">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Executor Name</p>
              <p className="text-xs text-gray-600">executor@email.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}