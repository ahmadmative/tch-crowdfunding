import React, { useState } from 'react';
import { X } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  required: boolean;
}

interface VerificationDocument {
  _id: string;
  userId: string;
  registeration?: string;
  VATRegisteration?: string;
  bankVerification?: string;
  SARSSection18A?: string;
  NPOCertification?: string;
  PBOCertification?: string;
  principalID?: string;
  AuthorisationLetter?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface VerificationModalProps {
  verificationData: VerificationDocument;
  onClose: () => void;
  onSubmit: (issues: string) => void;
}

const VerificationModal: React.FC<VerificationModalProps> = ({ verificationData, onClose, onSubmit }) => {
  // List of verification document fields to check for issues
  const fields: Field[] = [
    { key: 'registeration', label: 'Registration Certificate', required: true },
    { key: 'VATRegisteration', label: 'VAT Registration', required: false },
    { key: 'bankVerification', label: 'Bank Verification', required: true },
    { key: 'SARSSection18A', label: 'SARS Section 18A', required: false },
    { key: 'NPOCertification', label: 'NPO Certification', required: false },
    { key: 'PBOCertification', label: 'PBO Certification', required: false },
    { key: 'principalID', label: 'Principal ID', required: true },
    { key: 'AuthorisationLetter', label: 'Authorisation Letter', required: false },
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
      issues += `Issues with verification documents: ${fieldIssues.join(', ')}`;
    }
    
    if (!issues) {
      issues = 'Verification documents require review';
    }
    
    await onSubmit(issues);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold w-8 h-8 flex items-center justify-center"
        >
          <X className="w-6 h-6" />
        </button>
        
        <h2 className="text-xl font-bold mb-2 text-gray-800">Verification Documents Issues</h2>
        <p className="mb-4 text-gray-600">Select fields that have issues or need correction:</p>
        
        {/* Verification Documents Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-semibold text-sm text-gray-700 mb-2">Current Verification Documents:</h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="font-medium">Registration:</span> {verificationData.registeration ? 'Uploaded' : 'Not provided'}</div>
            <div><span className="font-medium">VAT Registration:</span> {verificationData.VATRegisteration ? 'Uploaded' : 'Not provided'}</div>
            <div><span className="font-medium">Bank Verification:</span> {verificationData.bankVerification ? 'Uploaded' : 'Not provided'}</div>
            <div><span className="font-medium">SARS Section 18A:</span> {verificationData.SARSSection18A ? 'Uploaded' : 'Not provided'}</div>
            <div><span className="font-medium">NPO Certification:</span> {verificationData.NPOCertification ? 'Uploaded' : 'Not provided'}</div>
            <div><span className="font-medium">PBO Certification:</span> {verificationData.PBOCertification ? 'Uploaded' : 'Not provided'}</div>
            <div><span className="font-medium">Principal ID:</span> {verificationData.principalID ? 'Uploaded' : 'Not provided'}</div>
            <div><span className="font-medium">Authorisation Letter:</span> {verificationData.AuthorisationLetter ? 'Uploaded' : 'Not provided'}</div>
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          {/* Field Issues */}
          <div className="mb-4">
            <h4 className="font-semibold text-sm text-gray-700 mb-2">Document Issues:</h4>
            <div className="max-h-48 overflow-y-auto space-y-1">
              {fields.map(field => {
                const hasValue = verificationData[field.key as keyof VerificationDocument];
                
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
                      {field.required && (
                        <span className="text-xs ml-2 px-2 py-1 rounded bg-red-100 text-red-700">
                          Required
                        </span>
                      )}
                    </div>
                    {hasValue ? (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Present
                      </span>
                    ) : (
                      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                        Missing
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

export default VerificationModal;