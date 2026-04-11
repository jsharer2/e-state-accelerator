import { Scale, FileText, CheckCircle2 } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface LegalPathwayScreenProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function LegalPathwayScreen({ data, onUpdate, onNext, onBack }: LegalPathwayScreenProps) {
  const isSmallEstate = data.estatePath === 'small-estate';

  const handlePathwayConfirm = () => {
    const pathway = isSmallEstate ? 'small-estate' : 'probate';
    onUpdate({ estatePath: pathway });
    onNext();
  };

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Your Legal Pathway
        </h2>
        <p className="text-base text-gray-600">
          Based on the estate value, here's what to expect in your process.
        </p>
      </div>

      <div className="mb-8">
        <div className={`p-6 border-2 rounded-lg ${
          isSmallEstate
            ? 'bg-green-50 border-green-200'
            : 'bg-blue-50 border-blue-200'
        }`}>
          <div className="flex items-start gap-4 mb-6">
            {isSmallEstate ? (
              <FileText className="w-8 h-8 text-green-600 flex-shrink-0" />
            ) : (
              <Scale className="w-8 h-8 text-blue-600 flex-shrink-0" />
            )}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {isSmallEstate ? 'Small Estate Affidavit Process' : 'Formal Probate Process'}
              </h3>
              <p className="text-sm text-gray-700">
                {isSmallEstate
                  ? 'A streamlined process for estates under the statutory threshold, typically requiring less court involvement.'
                  : 'A comprehensive court-supervised process for estates exceeding the statutory threshold.'}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Key requirements:</h4>
              <div className="space-y-3">
                {isSmallEstate ? (
                  <>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Small Estate Affidavit signed and notarized</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Death certificate (certified copy)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Waiting period (typically 30-45 days after death)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <span>Heir identification and notification</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Court petition and appointment as executor/administrator</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Letters of Office (Letters Testamentary or Administration)</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Inventory and appraisal of assets</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Creditor notification and claims period</span>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle2 className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span>Final accounting and distribution</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Timeline:</h4>
              <p className="text-sm text-gray-700">
                {isSmallEstate
                  ? 'Small estate affidavits typically take 2-4 months to complete, depending on state requirements and asset complexity.'
                  : 'Formal probate typically takes 9-18 months, though complex estates may take longer.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 p-5 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          What this means for digital asset discovery:
        </h4>
        <p className="text-sm text-gray-700">
          {isSmallEstate
            ? 'With a small estate process, you may have slightly more flexibility in accessing certain digital assets. However, some financial institutions may still require Letters of Office. RUFADAA laws in your state will determine your access rights.'
            : 'Formal probate provides you with clear legal authority through your Letters of Office. These documents will be required by most financial institutions and digital service providers to grant you access to accounts.'}
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
          onClick={handlePathwayConfirm}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
