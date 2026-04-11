import { FileText, CheckCircle2, Download, Printer } from 'lucide-react';
import { OnboardingData } from './OnboardingFlow';

interface DocumentChecklistScreenProps {
  data: OnboardingData;
  onComplete: () => void;
  onBack: () => void;
}

export function DocumentChecklistScreen({ data, onComplete, onBack }: DocumentChecklistScreenProps) {
  const documents = [
    {
      title: 'Death Certificate',
      description: 'Certified copy from vital records office',
      required: true,
      quantity: 'Multiple copies recommended (10-15)',
    },
    {
      title: 'Letters of Office',
      description: 'Letters Testamentary or Letters of Administration from probate court',
      required: data.authorityLevel !== 'none',
      quantity: 'Original and 5-10 certified copies',
    },
    {
      title: 'Government-Issued ID',
      description: "Your driver's license or passport as executor",
      required: true,
      quantity: 'Original for verification',
    },
    {
      title: 'Small Estate Affidavit',
      description: 'For estates under the statutory threshold',
      required: data.estatePath === 'small-estate',
      quantity: 'Notarized original',
    },
    {
      title: 'Will (if applicable)',
      description: 'Original will and any codicils',
      required: false,
      quantity: 'Original court-certified copy',
    },
    {
      title: 'Account-Specific Forms',
      description: 'Each institution may require their own claim forms',
      required: true,
      quantity: 'Varies by institution',
    },
  ];

  const requiredDocs = documents.filter((doc) => doc.required);

  return (
    <div className="p-8 md:p-12">
      <div className="mb-10">
        <h2 className="text-2xl font-semibold text-gray-900 mb-3">
          Required Document Checklist
        </h2>
        <p className="text-base text-gray-600">
          Here's what you'll need to access digital assets and financial accounts. Keep multiple copies of these documents organized.
        </p>
      </div>

      <div className="mb-10 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-gray-900 mb-1">
              Your Customized Checklist
            </p>
            <p className="text-sm text-gray-700">
              Based on your {data.authorityLevel} authority and {data.estatePath} workflow, you'll need {requiredDocs.length} key documents.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {documents.map((doc, idx) => (
          <div
            key={idx}
            className={`p-5 border-2 rounded-lg ${
              doc.required
                ? 'border-blue-200 bg-blue-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <FileText className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                doc.required ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-base font-semibold text-gray-900">{doc.title}</p>
                  {doc.required && (
                    <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded font-medium">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-700 mb-2">{doc.description}</p>
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Quantity needed:</span> {doc.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-10 space-y-4">
        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Download Checklist (PDF)
        </button>
        <button className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Printer className="w-4 h-4" />
          Print Checklist
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={onComplete}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Complete Setup & Go to Dashboard
        </button>
      </div>
    </div>
  );
}
