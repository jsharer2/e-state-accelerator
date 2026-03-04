import { AssetOverview } from '../AssetOverview';
import { AssetList } from '../AssetList';
import { ActionChecklist } from '../ActionChecklist';

export function Dashboard() {
  return (
    <div className="space-y-8">
      <AssetOverview />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <AssetList />
        </div>
        <div>
          <ActionChecklist />
        </div>
      </div>
    </div>
  );
}