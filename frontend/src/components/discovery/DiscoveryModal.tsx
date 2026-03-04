import { useState, useEffect } from 'react';
import { X, Mail, Key, Smartphone, Upload, FileText, Search, CheckCircle2 } from 'lucide-react';
import { DiscoveryMethod } from '../pages/AssetDiscovery';
import { ScanningView } from './ScanningView';
import { ResultsView } from './ResultsView';
import { SetupView } from './SetupView';
import { useEmailScan } from '../../hooks/useEmailScan';

interface DiscoveryModalProps {
  method: DiscoveryMethod;
  onClose: () => void;
}

type DiscoveryState = 'setup' | 'uploading' | 'scanning' | 'results' | 'complete';

export function DiscoveryModal({ method, onClose }: DiscoveryModalProps) {
  const [state, setState] = useState<DiscoveryState>('setup');
  const [discoveredAssets, setDiscoveredAssets] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { loading, progress, error, uploadAndScan } = useEmailScan();

  const methodConfig = {
    email: {
      icon: Mail,
      title: 'Email Scan',
      description: 'Scan email accounts for service confirmations and registrations',
    },
    password: {
      icon: Key,
      title: 'Password Manager Import',
      description: 'Import saved credentials from password managers',
    },
    device: {
      icon: Smartphone,
      title: 'Device Analysis',
      description: 'Analyze device for installed apps and saved accounts',
    },
    document: {
      icon: Upload,
      title: 'Document Upload',
      description: 'Upload documents to identify accounts',
    },
    manual: {
      icon: FileText,
      title: 'Manual Entry',
      description: 'Manually add known accounts',
    },
    browser: {
      icon: Search,
      title: 'Browser History Analysis',
      description: 'Review browser history for services',
    },
  };

  const config = methodConfig[method];

  const handleStartScan = async () => {
    if (method === 'email' && selectedFile) {
      setState('uploading');
      try {
        const results = await uploadAndScan(selectedFile);
        // Results already include transformed data
        setDiscoveredAssets(results.accounts || []);
        setState('results');
      } catch (err) {
        console.error('Scan error:', err);
        setState('setup');
      }
    } else {
      setState('scanning');
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
  };

  const handleScanComplete = (assets: any[]) => {
    setDiscoveredAssets(assets);
    setState('results');
  };

  const handleAddAssets = () => {
    setState('complete');
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-300 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gray-100 rounded">
              <config.icon className="w-5 h-5 text-gray-700" />
            </div>
            <div>
              <h2 className="text-lg font-normal text-gray-900">{config.title}</h2>
              <p className="text-sm text-gray-600">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {state === 'setup' && (
            <SetupView 
              method={method} 
              onStart={handleStartScan}
              onFileSelected={handleFileSelected}
            />
          )}
          {(state === 'uploading' || state === 'scanning') && (
            <ScanningView 
              method={method} 
              progress={progress}
              isUploading={state === 'uploading'}
              onComplete={handleScanComplete} 
            />
          )}
          {state === 'results' && (
            <ResultsView 
              assets={discoveredAssets} 
              onAddAssets={handleAddAssets}
              onCancel={onClose}
            />
          )}
          {state === 'complete' && (
            <div className="p-12 text-center">
              <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Assets Added Successfully</h3>
              <p className="text-sm text-gray-600">The discovered assets have been added to your inventory</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}