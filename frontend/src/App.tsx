import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DashboardHeader } from './components/DashboardHeader';
import { Dashboard } from './components/pages/Dashboard';
import { AssetDiscovery } from './components/pages/AssetDiscovery';
import { AllAssets } from './components/pages/AllAssets';
import { ActionItems } from './components/pages/ActionItems';
import { Documents } from './components/pages/Documents';
import { Settings } from './components/pages/Settings';

export type Page = 'dashboard' | 'discovery' | 'assets' | 'actions' | 'documents' | 'settings';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  const renderPage = () => {
    try {
      switch (currentPage) {
        case 'dashboard':
          return <Dashboard />;
        case 'discovery':
          return <AssetDiscovery />;
        case 'assets':
          return <AllAssets />;
        case 'actions':
          return <ActionItems />;
        case 'documents':
          return <Documents />;
        case 'settings':
          return <Settings />;
        default:
          return <Dashboard />;
      }
    } catch (error) {
      console.error('Error rendering page:', error);
      return <div className="p-6 text-red-600">Error loading page. Check console.</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader currentPage={currentPage} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>
    </div>
  );
}
