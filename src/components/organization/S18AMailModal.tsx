import React, { useState } from 'react'

interface Field {
  key: string;
  label: string;
  required: boolean;
}

interface S18ADocument {
  _id: string;
  userId: string;
  registered: boolean;
  reference: string;
  trustNumber: string;
  pbo: string;
  npo: string;
  signature: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface S18AMailModalProps {
  s18AData: S18ADocument;
  onClose: () => void;
  onSubmit: (issues: string) => void;
}

const S18AMailModal: React.FC<S18AMailModalProps> = ({ s18AData, onClose, onSubmit }) => {
  // List of S18A document fields to check for issues
  const fields: Field[] = [
    { key: 'registered', label: 'S18A Registration Status', required: true },
    { key: 'reference', label: 'Reference Number', required: false },
    { key: 'trustNumber', label: 'Trust Number', required: true },
    { key: 'pbo', label: 'PBO Number', required: false },
    { key: 'npo', label: 'NPO Number', required: false },
    { key: 'signature', label: 'Signature Upload', required: true },
  ];

  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleCheck = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    const fieldIssues = fields.filter(f => checked[f.key]).map(f => f.label);
    let issues = '';
    
    if (fieldIssues.length > 0) {
      issues = `Issues with fields: ${fieldIssues.join(', ')}`;
    }
    
    if (!issues) {
      issues = 'S18A document requires review';
    }
    
    await onSubmit(issues);
    setSubmitting(false);
  };

  const getFieldValue = (key: string) => {
    const value = s18AData[key as keyof S18ADocument];
    if (key === 'registered') {
      return value ? 'Yes' : 'No';
    }
    if (key === 'signature') {
      return value ? 'Uploaded' : 'Not uploaded';
    }
    return value || 'Not provided';
  };

  const hasValue = (key: string) => {
    const value = s18AData[key as keyof S18ADocument];
    if (key === 'registered') {
      return value !== undefined;
    }
    return value && value.toString().trim() !== '';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
        >
          ×
        </button>
        
        <h2 className="text-xl font-bold mb-2 text-gray-800">S18A Document Issues</h2>
        <p className="mb-4 text-gray-600">Select fields that have issues or need correction:</p>
        
        {/* S18A Document Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Current S18A Details:</h3>
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div><span className="font-medium">Registered:</span> {s18AData.registered ? 'Yes' : 'No'}</div>
            <div><span className="font-medium">Reference:</span> {s18AData.reference || 'Not provided'}</div>
            <div><span className="font-medium">Trust Number:</span> {s18AData.trustNumber || 'Not provided'}</div>
            <div><span className="font-medium">PBO:</span> {s18AData.pbo || 'Not provided'}</div>
            <div><span className="font-medium">NPO:</span> {s18AData.npo || 'Not provided'}</div>
            <div><span className="font-medium">Signature:</span> {s18AData.signature ? 'Uploaded' : 'Not uploaded'}</div>
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          {/* Field Issues */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Field Issues:</h4>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {fields.map(field => {
                const fieldHasValue = hasValue(field.key);
                
                return (
                  <label key={field.key} className="flex items-center gap-3 py-2 px-3 hover:bg-gray-50 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!checked[field.key]}
                      onChange={() => handleCheck(field.key)}
                      className="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                    />
                    <div className="flex-1">
                      <span className="font-medium text-gray-800">{field.label}</span>
                      <span className={`text-xs ml-2 px-2 py-1 rounded ${
                        field.required 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {field.required ? 'Required' : 'Optional'}
                      </span>
                    </div>
                    {fieldHasValue ? (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Present
                      </span>
                    ) : (
                      <span className={`text-xs px-2 py-1 rounded ${
                        field.required 
                          ? 'text-red-600 bg-red-100' 
                          : 'text-gray-500 bg-gray-100'
                      }`}>
                        {field.required ? 'Missing' : 'Not provided'}
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Issues & Reject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default S18AMailModal;