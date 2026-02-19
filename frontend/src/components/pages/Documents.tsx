import { Upload, FileText, Folder, Search, Download, MoreVertical } from 'lucide-react@0.344.0';

export function Documents() {
  const folders = [
    { name: 'Death Certificates', count: 5, size: '2.4 MB' },
    { name: 'Financial Documents', count: 23, size: '15.8 MB' },
    { name: 'Legal Papers', count: 12, size: '8.2 MB' },
    { name: 'Account Statements', count: 18, size: '12.5 MB' },
  ];

  const recentDocs = [
    { name: 'Chase_Account_Statement.pdf', type: 'PDF', size: '245 KB', date: 'Feb 1, 2026', folder: 'Financial Documents' },
    { name: 'Death_Certificate_Certified.pdf', type: 'PDF', size: '512 KB', date: 'Jan 30, 2026', folder: 'Death Certificates' },
    { name: 'Probate_Court_Filing.pdf', type: 'PDF', size: '1.2 MB', date: 'Jan 28, 2026', folder: 'Legal Papers' },
    { name: 'PayPal_Transaction_History.csv', type: 'CSV', size: '89 KB', date: 'Jan 27, 2026', folder: 'Financial Documents' },
    { name: 'Social_Security_Notice.pdf', type: 'PDF', size: '156 KB', date: 'Jan 25, 2026', folder: 'Legal Papers' },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-gray-400 transition-colors cursor-pointer">
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base font-medium text-gray-900 mb-2">Upload Documents</h3>
          <p className="text-sm text-gray-600 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors">
            Choose Files
          </button>
          <p className="text-xs text-gray-500 mt-4">Supports PDF, DOC, DOCX, XLS, XLSX, CSV, JPG, PNG</p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-normal text-gray-900 mb-4">Document Folders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.name}
              className="bg-white border-2 border-gray-300 rounded-lg p-5 hover:border-gray-400 transition-colors cursor-pointer"
            >
              <Folder className="w-10 h-10 text-gray-600 mb-3" />
              <h3 className="text-sm font-medium text-gray-900 mb-1">{folder.name}</h3>
              <p className="text-xs text-gray-600">{folder.count} files • {folder.size}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Storage Usage</h3>
        <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div className="h-full bg-blue-600" style={{ width: '39%' }}></div>
        </div>
        <p className="text-sm text-gray-600">38.9 MB of 100 MB used</p>
      </div>
    </div>
  );
}