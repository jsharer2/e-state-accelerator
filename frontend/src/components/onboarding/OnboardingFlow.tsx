import { useState } from 'react';
import { WelcomeScreen } from './WelcomeScreen';
import { AuthorityScreen } from './AuthorityScreen';
import { EstateValueScreen } from './EstateValueScreen';
import { LegalPathwayScreen } from './LegalPathwayScreen';
import { DiscoveryMethodsScreen } from './DiscoveryMethodsScreen';
import { DocumentChecklistScreen } from './DocumentChecklistScreen';

export type AuthorityLevel = 'none' | 'limited' | 'full';
export type EstateSize = 'small' | 'large';
export type LegalPathway = 'small-estate' | 'probate' | 'unknown';
export type DiscoveryMode = 'disabled' | 'restricted' | 'full';

export interface OnboardingData {
  hasLettersOfOffice: boolean | null;
  isSmallEstateCertificate: boolean | null;
  authorityLevel: AuthorityLevel | null;
  discoveryEnabled: boolean;
  discoveryMode: DiscoveryMode | null;
  estateValue: number | null;
  estatePath: LegalPathway | null;
  selectedDiscoveryMethods: string[];
  hasRUFADAA: boolean;
}

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    hasLettersOfOffice: null,
    isSmallEstateCertificate: null,
    authorityLevel: null,
    discoveryEnabled: false,
    discoveryMode: null,
    estateValue: null,
    estatePath: null,
    selectedDiscoveryMethods: [],
    hasRUFADAA: false,
  });

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleComplete = () => {
    onComplete(data);
  };

  const steps = [
    <WelcomeScreen key="welcome" onNext={nextStep} />,
    <AuthorityScreen
      key="authority"
      data={data}
      onUpdate={updateData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <EstateValueScreen
      key="estate-value"
      data={data}
      onUpdate={updateData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <LegalPathwayScreen
      key="legal-pathway"
      data={data}
      onUpdate={updateData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <DiscoveryMethodsScreen
      key="discovery-methods"
      data={data}
      onUpdate={updateData}
      onNext={nextStep}
      onBack={prevStep}
    />,
    <DocumentChecklistScreen
      key="document-checklist"
      data={data}
      onComplete={handleComplete}
      onBack={prevStep}
    />,
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep + 1} of {steps.length}</span>
            <span className="text-sm text-blue-600 font-medium">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Current step */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          {steps[currentStep]}
        </div>
      </div>
    </div>
  );
}
