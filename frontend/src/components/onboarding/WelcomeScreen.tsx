import { Heart, Shield, Lock } from 'lucide-react';

interface WelcomeScreenProps {
  onNext: () => void;
}

export function WelcomeScreen({ onNext }: WelcomeScreenProps) {
  return (
    <div className="p-8 md:p-12">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">
          Welcome to Digital Estate Management
        </h1>
        <p className="text-lg text-gray-600">
          We're here to help you navigate this difficult process with care and compassion.
        </p>
      </div>

      <div className="space-y-5 mb-10">
        <div className="flex gap-5 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Secure & Confidential
            </h3>
            <p className="text-sm text-gray-700">
              Your information is protected with bank-level encryption. We understand the sensitivity of this process.
            </p>
          </div>
        </div>

        <div className="flex gap-5 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Legally Compliant
            </h3>
            <p className="text-sm text-gray-700">
              Our process follows state and federal regulations, including RUFADAA, to ensure you have proper access to digital assets.
            </p>
          </div>
        </div>

        <div className="flex gap-5 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <Heart className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              At Your Own Pace
            </h3>
            <p className="text-sm text-gray-700">
              Take breaks whenever you need. Your progress is automatically saved, and you can return anytime.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-10">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">What to expect:</h3>
        <ul className="space-y-3 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Verify your authority as executor or administrator</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Provide estate size information to determine your legal pathway</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Choose discovery methods based on your authority level</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Review required documents for accessing accounts</span>
          </li>
        </ul>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onNext}
          className="px-12 py-4 bg-blue-600 text-white text-base font-semibold rounded-lg hover:bg-blue-700 transition-colors min-w-[160px]"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
