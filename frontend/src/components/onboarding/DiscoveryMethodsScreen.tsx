import { Mail, Key, Smartphone, Upload, FileText, Search, Lock, CheckCircle2 } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface DiscoveryMethodsScreenProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

interface DiscoveryMethod {
  id: string;
  icon: React.ElementType;
  title: string;
  description: string;
  requiredAuthority: 'none' | 'limited' | 'full';
  requiresRUFADAA: boolean;
}

export function DiscoveryMethodsScreen({ data, onUpdate, onNext, onBack }: DiscoveryMethodsScreenProps) {
  const methods: DiscoveryMethod[] = [
    {
      id: 'email',
      icon: Mail,
      title: 'Email Scanning',
      description: 'Scan email accounts for service confirmations and account registrations',
      requiredAuthority: 'none',
      requiresRUFADAA: false,
    },
    {
      id: 'browser',
      icon: Search,
      title: 'Browser History',
      description: 'Review browser history for frequently accessed services',
      requiredAuthority: 'none',
      requiresRUFADAA: false,
    },
    {
      id: 'password',
      icon: Key,
      title: 'Password Manager',
      description: 'Import credentials from password management tools',
      requiredAuthority: 'full',
      requiresRUFADAA: false,
    },
    {
      id: 'device',
      icon: Smartphone,
      title: 'Device Analysis',
      description: 'Analyze devices for installed applications and saved accounts',
      requiredAuthority: 'full',
      requiresRUFADAA: false,
    },
    {
      id: 'document',
      icon: Upload,
      title: 'Document Upload',
      description: 'Upload bank statements, bills, and other documents',
      requiredAuthority: 'none',
      requiresRUFADAA: false,
    },
    {
      id: 'manual',
      icon: FileText,
      title: 'Manual Entry',
      description: 'Manually add known accounts and services',
      requiredAuthority: 'none',
      requiresRUFADAA: false,
    },
  ];

  const isMethodAvailable = (method: DiscoveryMethod): boolean => {
    if (!data.discoveryEnabled) {
      return false;
    }

    if (method.id === 'email' || method.id === 'browser') {
      return data.authorityLevel !== 'none';
    }

    if (method.id === 'password' || method.id === 'device') {
      return data.authorityLevel === 'full';
    }

    if (method.id === 'document' || method.id === 'manual') {
      return true;
    }

    return false;
  };

  const toggleMethod = (methodId: string) => {
    const current = data.selectedDiscoveryMethods || [];
    const updated = current.includes(methodId)
      ? current.filter((id) => id !== methodId)
      : [...current, methodId];
    onUpdate({ selectedDiscoveryMethods: updated });
  };

  const authorityLevelText = {
    none: 'No Authority - Discovery Disabled',
    limited: 'Limited Authority - Restricted Discovery',
    full: 'Full Authority - All Methods Available',
  }[data.authorityLevel || 'none'];

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Discovery Method Selection
        </h2>
        <p className="text-base text-gray-600">
          Choose which methods you'd like to use for discovering digital assets. Your selections are based on your authority level.
        </p>
      </div>

      <div className="mb-8 p-5 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900">Your Authority Level</p>
            <p className="text-sm text-gray-700 mt-1">{authorityLevelText}</p>
          </div>
          <div className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded">
            {authorityLevelText}
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {methods.map((method) => {
          const isAvailable = isMethodAvailable(method);
          const isSelected = data.selectedDiscoveryMethods?.includes(method.id);
          const Icon = method.icon;

          return (
            <button
              key={method.id}
              onClick={() => isAvailable && toggleMethod(method.id)}
              disabled={!isAvailable}
              className={`w-full p-5 border-2 rounded-lg text-left transition-all ${
                !isAvailable
                  ? 'border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed'
                  : isSelected
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  !isAvailable
                    ? 'bg-gray-200'
                    : isSelected
                    ? 'bg-blue-600'
                    : 'bg-gray-100'
                }`}>
                  <Icon className={`w-5 h-5 ${
                    !isAvailable
                      ? 'text-gray-400'
                      : isSelected
                      ? 'text-white'
                      : 'text-gray-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-base font-semibold text-gray-900">{method.title}</p>
                    {method.requiresRUFADAA && (
                      <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                        RUFADAA
                      </span>
                    )}
                    {!isAvailable && (
                      <Lock className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-sm text-gray-700">{method.description}</p>
                  {!isAvailable && (
                    <p className="text-xs text-red-600 mt-2">
                      Requires {method.requiredAuthority === 'full' ? 'Full' : 'Limited or Full'} Authority
                    </p>
                  )}
                </div>
                {isAvailable && (
                  <div className="flex-shrink-0">
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-blue-600" />
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="mb-8 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          About RUFADAA (Revised Uniform Fiduciary Access to Digital Assets Act)
        </h4>
        <p className="text-sm text-gray-700">
          RUFADAA is a law adopted by most states that governs fiduciary access to digital assets. It provides a legal framework for executors to access email accounts and other digital assets, but access is typically limited to metadata unless explicitly authorized by the deceased or a court order.
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
