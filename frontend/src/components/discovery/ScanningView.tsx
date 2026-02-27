import { useState, useEffect } from 'react';
import { Loader2, Search } from 'lucide-react';
import { DiscoveryMethod } from '../pages/AssetDiscovery';

interface ScanningViewProps {
  method: DiscoveryMethod;
  progress?: number;
  isUploading?: boolean;
  onComplete: (assets: any[]) => void;
}

export function ScanningView({ method, progress: externalProgress = 0, isUploading = false, onComplete }: ScanningViewProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [foundAssets, setFoundAssets] = useState<any[]>([]);

  const mockAssets = {
    email: [
      { name: 'Netflix Subscription', category: 'Subscription', confidence: 'High', email: 'john.doe@email.com' },
      { name: 'Amazon Prime', category: 'Subscription', confidence: 'High', email: 'john.doe@email.com' },
      { name: 'Spotify Premium', category: 'Subscription', confidence: 'High', email: 'john.doe@email.com' },
      { name: 'Chase Bank Alerts', category: 'Financial', confidence: 'High', email: 'alerts@chase.com' },
      { name: 'PayPal Account', category: 'Financial', confidence: 'Medium', email: 'service@paypal.com' },
      { name: 'LinkedIn Profile', category: 'Social Media', confidence: 'High', email: 'john.doe@email.com' },
      { name: 'Dropbox Storage', category: 'Cloud', confidence: 'Medium', email: 'john.doe@email.com' },
    ],
    password: [
      { name: 'Facebook', category: 'Social Media', confidence: 'High', username: 'john.doe' },
      { name: 'Twitter/X', category: 'Social Media', confidence: 'High', username: 'johndoe' },
      { name: 'Bank of America', category: 'Financial', confidence: 'High', username: 'john.doe@email.com' },
      { name: 'Coinbase', category: 'Cryptocurrency', confidence: 'High', username: 'john.doe@email.com' },
      { name: 'GitHub', category: 'Professional', confidence: 'Medium', username: 'johndoe' },
    ],
    device: [
      { name: 'Instagram', category: 'Social Media', confidence: 'High', lastUsed: '2 days ago' },
      { name: 'Venmo', category: 'Financial', confidence: 'High', lastUsed: '1 week ago' },
      { name: 'WhatsApp', category: 'Communication', confidence: 'High', lastUsed: '1 day ago' },
      { name: 'Robinhood', category: 'Financial', confidence: 'Medium', lastUsed: '3 days ago' },
    ],
    browser: [
      { name: 'Wells Fargo', category: 'Financial', confidence: 'High', visits: 127 },
      { name: 'Gmail', category: 'Email', confidence: 'High', visits: 342 },
      { name: 'YouTube Premium', category: 'Subscription', confidence: 'Medium', visits: 89 },
    ],
    document: [
      { name: 'Vanguard 401(k)', category: 'Financial', confidence: 'High', source: 'Statement.pdf' },
      { name: 'AT&T Wireless', category: 'Subscription', confidence: 'High', source: 'Bill_Jan2026.pdf' },
    ],
    manual: [],
  };

  const scanningSteps = {
    email: [
      'Connecting to email server...',
      'Scanning inbox for confirmations...',
      'Analyzing receipts and billing emails...',
      'Identifying account registrations...',
      'Processing results...',
    ],
    password: [
      'Reading password vault...',
      'Extracting credentials...',
      'Categorizing accounts...',
      'Verifying account types...',
      'Compiling results...',
    ],
    device: [
      'Connecting to device...',
      'Scanning installed applications...',
      'Checking for logged-in accounts...',
      'Analyzing app usage patterns...',
      'Generating report...',
    ],
    browser: [
      'Loading browser history...',
      'Analyzing visited domains...',
      'Identifying service patterns...',
      'Detecting account activity...',
      'Finalizing results...',
    ],
    document: [
      'Processing uploaded documents...',
      'Extracting text content...',
      'Identifying account numbers...',
      'Matching service providers...',
      'Creating asset entries...',
    ],
    manual: ['Adding account...'],
  };

  const steps = scanningSteps[method];
  const assets = mockAssets[method];

  useEffect(() => {
    if (isUploading) {
      // For upload, track external progress
      setProgress(externalProgress);
      // When upload completes (100%), don't call onComplete here - let parent handle it
      return;
    }

    const stepDuration = 1000;
    const totalDuration = steps.length * stepDuration;
    let progressInterval: NodeJS.Timeout;
    let stepInterval: NodeJS.Timeout;
    let assetInterval: NodeJS.Timeout;
    let assetIndex = 0;

    // Progress bar animation
    progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (totalDuration / 50));
      });
    }, 50);

    // Step progression
    stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, stepDuration);

    // Asset discovery animation
    if (assets.length > 0) {
      assetInterval = setInterval(() => {
        if (assetIndex < assets.length) {
          const currentAsset = assets[assetIndex];
          setFoundAssets((prev) => [...prev, currentAsset]);
          assetIndex++;
        } else {
          clearInterval(assetInterval);
        }
      }, Math.max(300, totalDuration / assets.length));
    }

    // Complete after all steps
    const completeTimer = setTimeout(() => {
      onComplete(assets);
    }, totalDuration + 500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearInterval(assetInterval);
      clearTimeout(completeTimer);
    };
  }, [method, isUploading, externalProgress]);

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-medium text-gray-900">Scanning in progress...</h3>
          <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-3 text-sm text-gray-700">
          <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
          <span>{steps[currentStep]}</span>
        </div>
      </div>

      {foundAssets.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-medium text-gray-900">Assets Found</h4>
            <span className="text-sm text-gray-600">{foundAssets.length} discovered</span>
          </div>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {foundAssets.map((asset, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 border border-gray-200 rounded bg-white animate-slideIn"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center">
                    <Search className="w-4 h-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                    <p className="text-xs text-gray-500">{asset.category}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded ${
                    asset.confidence === 'High' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-yellow-500 text-gray-900'
                  }`}>
                    {asset.confidence}
                  </span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}