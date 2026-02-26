import { DiscoveryMethod } from '../pages/AssetDiscovery';
import { Mail, Key, Smartphone, Upload, FileText, Search } from 'lucide-react@0.344.0';

interface SetupViewProps {
  method: DiscoveryMethod;
  onStart: () => void;
}

export function SetupView({ method, onStart }: SetupViewProps) {
  const setupContent = {
    email: {
      fields: [
        { label: 'Email Address', type: 'email', placeholder: 'example@email.com' },
      ],
      instructions: [
        'Connect your email account securely via OAuth, or',
        'Download and upload email data export (MBOX, PST, or CSV format)',
        'We\'ll scan for account confirmations and receipts',
        'This process typically takes 3-5 minutes',
        'All data is processed securely and not stored',
      ],
      hasFileUpload: true,
    },
    password: {
      fields: [
        { label: 'Password Manager', type: 'select', options: ['1Password', 'LastPass', 'Bitwarden', 'Chrome', 'Other'] },
      ],
      instructions: [
        'Export your password manager data',
        'Upload the exported file (CSV or JSON format)',
        'We\'ll identify all saved accounts',
        'Your passwords remain encrypted',
      ],
    },
    device: {
      fields: [
        { label: 'Device Type', type: 'select', options: ['iPhone', 'Android', 'Windows PC', 'Mac'] },
      ],
      instructions: [
        'Connect the device via USB or network',
        'We\'ll scan for installed applications',
        'Identify logged-in accounts and services',
        'No personal data is extracted',
      ],
    },
    document: {
      fields: [],
      instructions: [
        'Upload bank statements, bills, or account documents',
        'Supported formats: PDF, DOC, DOCX, JPG, PNG',
        'We\'ll extract account information automatically',
        'Documents are analyzed securely',
      ],
    },
    manual: {
      fields: [
        { label: 'Account Name', type: 'text', placeholder: 'e.g., Chase Checking' },
        { label: 'Account Type', type: 'select', options: ['Financial', 'Social Media', 'Email', 'Subscription', 'Other'] },
        { label: 'Website/Service', type: 'text', placeholder: 'e.g., chase.com' },
      ],
      instructions: [
        'Enter known account information manually',
        'Add as much detail as you have available',
        'You can add more details later',
      ],
    },
    browser: {
      fields: [
        { label: 'Browser', type: 'select', options: ['Chrome', 'Firefox', 'Safari', 'Edge', 'Other'] },
      ],
      instructions: [
        'Export browser history data',
        'We\'ll analyze frequently visited sites',
        'Identify potential accounts and services',
        'History data is processed securely',
      ],
    },
  };

  const content = setupContent[method];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h3 className="text-base font-medium text-gray-900 mb-4">Setup Information</h3>
        <div className="space-y-4">
          {content.fields.map((field, idx) => (
            <div key={idx}>
              <label className="block text-sm text-gray-700 mb-2">{field.label}</label>
              {field.type === 'select' ? (
                <select className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500">
                  <option value="">Select...</option>
                  {field.options?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded focus:outline-none focus:border-gray-500"
                />
              )}
            </div>
          ))}

          {method === 'document' && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-700 mb-1">Drop files here or click to browse</p>
              <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG (max 10MB)</p>
            </div>
          )}

          {method === 'email' && (
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white px-2 text-gray-500">OR</span>
                </div>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 mb-1">Upload email data export</p>
                <p className="text-xs text-gray-500">MBOX, PST, CSV formats supported (max 100MB)</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="text-sm font-medium text-gray-900 mb-2">How it works:</h4>
        <ul className="space-y-2">
          {content.instructions.map((instruction, idx) => (
            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>{instruction}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onStart}
          className="flex-1 px-4 py-3 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
        >
          {method === 'manual' ? 'Add Account' : method === 'email' ? 'Connect Email' : 'Start Scan'}
        </button>
      </div>
    </div>
  );
}