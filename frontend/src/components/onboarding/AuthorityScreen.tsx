import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { OnboardingData, AuthorityLevel, DiscoveryMode } from './OnboardingFlow';

interface AuthorityScreenProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function AuthorityScreen({ data, onUpdate, onNext, onBack }: AuthorityScreenProps) {
  const handleLettersOfOfficeChange = (hasLetters: boolean) => {
    let authorityLevel: AuthorityLevel;
    let discoveryEnabled: boolean;
    let discoveryMode: DiscoveryMode;

    if (!hasLetters) {
      authorityLevel = 'none';
      discoveryEnabled = false;
      discoveryMode = 'disabled';
    } else {
      authorityLevel = data.authorityLevel || 'limited';
      discoveryEnabled = true;
      discoveryMode = data.discoveryMode || 'restricted';
    }

    onUpdate({
      hasLettersOfOffice: hasLetters,
      authorityLevel,
      discoveryEnabled,
      discoveryMode,
    });
  };

  const handleSmallEstateCertificateChange = (isSmallEstate: boolean) => {
    let authorityLevel: AuthorityLevel;
    let discoveryMode: DiscoveryMode;

    if (isSmallEstate) {
      authorityLevel = 'limited';
      discoveryMode = 'restricted';
    } else {
      authorityLevel = 'full';
      discoveryMode = 'full';
    }

    onUpdate({
      isSmallEstateCertificate: isSmallEstate,
      authorityLevel,
      discoveryEnabled: true,
      discoveryMode,
    });
  };

  const canProceed =
    data.hasLettersOfOffice !== null &&
    (data.hasLettersOfOffice === false || data.isSmallEstateCertificate !== null);

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Executor Authority Verification
        </h2>
        <p className="text-base text-gray-600">
          Your access to discovery tools depends on your legal authority as executor or administrator.
        </p>
      </div>

      <div className="space-y-8 mb-10">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Do you have Letters of Office (Letters Testamentary or Letters of Administration)?
          </label>
          <div className="flex gap-4">
            <button
              onClick={() => handleLettersOfOfficeChange(true)}
              className={`flex-1 p-5 border-2 rounded-lg transition-all ${
                data.hasLettersOfOffice === true
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <CheckCircle2
                className={`w-6 h-6 mx-auto mb-2 ${
                  data.hasLettersOfOffice === true ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <p className="text-sm font-medium text-gray-900">Yes, I have them</p>
            </button>
            <button
              onClick={() => handleLettersOfOfficeChange(false)}
              className={`flex-1 p-5 border-2 rounded-lg transition-all ${
                data.hasLettersOfOffice === false
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <XCircle
                className={`w-6 h-6 mx-auto mb-2 ${
                  data.hasLettersOfOffice === false ? 'text-blue-600' : 'text-gray-400'
                }`}
              />
              <p className="text-sm font-medium text-gray-900">Not yet</p>
            </button>
          </div>
        </div>

        {data.hasLettersOfOffice === true && (
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Is this a Small Estate Certificate/Affidavit?
            </label>
            <div className="flex gap-4">
              <button
                onClick={() => handleSmallEstateCertificateChange(true)}
                className={`flex-1 p-5 border-2 rounded-lg transition-all ${
                  data.isSmallEstateCertificate === true
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <CheckCircle2
                  className={`w-6 h-6 mx-auto mb-2 ${
                    data.isSmallEstateCertificate === true ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <p className="text-sm font-medium text-gray-900">Yes, Small Estate</p>
              </button>
              <button
                onClick={() => handleSmallEstateCertificateChange(false)}
                className={`flex-1 p-5 border-2 rounded-lg transition-all ${
                  data.isSmallEstateCertificate === false
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <XCircle
                  className={`w-6 h-6 mx-auto mb-2 ${
                    data.isSmallEstateCertificate === false ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <p className="text-sm font-medium text-gray-900">No, Full Letters</p>
              </button>
            </div>
          </div>
        )}
      </div>

      {data.authorityLevel === 'none' && (
        <div className="mb-8 p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-gray-900 mb-1">Limited Access</p>
              <p className="text-sm text-gray-700">
                Without legal authority, automated discovery methods will be disabled. You can manually track assets and prepare for when you receive your Letters of Office.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex-1 px-6 py-3 rounded-lg transition-colors ${
            canProceed
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
