import { DiscoveryMethod } from '../pages/AssetDiscovery';
import { Upload } from 'lucide-react';
import { useRef, useState } from 'react';

interface SetupField {
  label: string;
  type: 'select' | 'text' | 'email';
  options?: string[];
  placeholder?: string;
}

interface SetupConfig {
  fields: SetupField[];
  instructions: string[];
  hasFileUpload?: boolean;
}

interface SetupViewProps {
  method: DiscoveryMethod;
  onStart: () => void;
  onFileSelected?: (file: File) => void;
}

export function SetupView({ method, onStart, onFileSelected }: SetupViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const setupContent: Record<DiscoveryMethod, SetupConfig> = {
    email: {
      fields: [],
      instructions: [
        'Download your email data export (MBOX format)',
        'Upload the file to scan for account confirmations',
        'We scan for authentication, billing, and subscription emails',
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
      fields: [],
      instructions: [
        'Your browser history will be analyzed',
        'We identify frequently visited services',
        'Pattern analysis reveals potential accounts',
        'No history data is permanently stored',
      ],
    },
  };

  const content = setupContent[method];

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    onFileSelected?.(file);
    console.log('File selected:', file.name);
  };

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
                  placeholder={field.placeholder ?? ''}
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
              <input
                ref={fileInputRef}
                type="file"
                accept=".mbox,.txt,.eml"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={handleFileClick}
                className="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer hover:border-gray-400"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-700 mb-1">
                  {selectedFile ? selectedFile.name : 'Upload email data export'}
                </p>
                <p className="text-xs text-gray-500">MBOX, EML, TXT formats (max 5GB)</p>
              </div>
              {selectedFile && (
                <div className="p-3 bg-green-50 border border-green-200 rounded text-sm text-green-700">
                  ✓ {selectedFile.name} selected
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">How it works:</h3>
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
          disabled={!selectedFile && method === 'email'}
          className={`flex-1 px-4 py-3 text-white text-sm rounded transition-colors ${
            method === 'email' && !selectedFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {method === 'email' ? 'Analyze Email File' : 'Start Scan'}
        </button>
      </div>
    </div>
  );
}
