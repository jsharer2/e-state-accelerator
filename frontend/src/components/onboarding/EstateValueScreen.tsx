import { DollarSign, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import { OnboardingData, LegalPathway } from './OnboardingFlow';

interface EstateValueScreenProps {
  data: OnboardingData;
  onUpdate: (updates: Partial<OnboardingData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function EstateValueScreen({ data, onUpdate, onNext, onBack }: EstateValueScreenProps) {
  const [valueInput, setValueInput] = useState(data.estateValue?.toString() || '');
  const [showHelp, setShowHelp] = useState(false);

  const handleValueChange = (value: string) => {
    setValueInput(value);
    const numValue = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (!isNaN(numValue)) {
      let estatePath: LegalPathway;
      if (numValue < 100000) {
        estatePath = 'small-estate';
      } else if (numValue >= 100000) {
        estatePath = 'probate';
      } else {
        estatePath = 'unknown';
      }
      onUpdate({ estateValue: numValue, estatePath });
    }
  };

  const formatCurrency = (value: string) => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) return '';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const canProceed = data.estateValue !== null && data.estateValue > 0;

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Estate Value Threshold
        </h2>
        <p className="text-base text-gray-600">
          The estimated value of the estate determines your legal pathway and requirements.
        </p>
      </div>

      <div className="space-y-6 mb-10">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            What is the estimated total value of the estate?
          </label>
          <div className="relative">
            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={valueInput}
              onChange={(e) => handleValueChange(e.target.value)}
              placeholder="100,000"
              className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
            />
          </div>
          {data.estateValue !== null && data.estateValue > 0 && (
            <p className="mt-2 text-sm text-gray-600">
              Estimated value: {formatCurrency(data.estateValue.toString())}
            </p>
          )}
        </div>

        <button
          onClick={() => setShowHelp(!showHelp)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
        >
          <HelpCircle className="w-4 h-4" />
          What should I include in this estimate?
        </button>

        {showHelp && (
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Include in your estimate:</h4>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Real estate and property</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Bank accounts and investments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Vehicles and valuable personal property</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Digital assets (cryptocurrency, online accounts with monetary value)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-1">•</span>
                <span>Business interests</span>
              </li>
            </ul>
            <p className="mt-3 text-xs text-gray-600">
              Note: This is an estimate. The exact threshold varies by state (typically $50k-$184k).
            </p>
          </div>
        )}

        {data.estatePath && (
          <div className={`p-5 border-2 rounded-lg ${
            data.estatePath === 'small-estate'
              ? 'bg-green-50 border-green-200'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <h4 className="text-base font-semibold text-gray-900 mb-2">
              {data.estatePath === 'small-estate' ? 'Small Estate Workflow' : 'Probate Workflow'}
            </h4>
            <p className="text-sm text-gray-700">
              {data.estatePath === 'small-estate'
                ? 'Your estate value is below the threshold for formal probate. You may be eligible for a simplified small estate process with reduced requirements.'
                : 'Your estate value requires formal probate proceedings. This process includes court supervision and additional documentation requirements.'}
            </p>
          </div>
        )}
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
