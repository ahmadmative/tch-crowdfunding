import axios from 'axios'
import React, { useState } from 'react'
import { BASE_URL } from '../../config/url'

interface Field {
  key: string;
  label: string;
  required: boolean;
}

const MailModal = ({ receiverId, orgData, onClose, onSubmit }: {
  receiverId: string,
  orgData: any,
  onClose: () => void,
  onSubmit: (issues: string) => void
}) => {
  // List of fields to check for issues
  const fields: Field[] = [
    { key: 'name', label: 'Organization Name', required: true },
    { key: 'description', label: 'Description', required: true },
    { key: 'logo', label: 'Logo', required: true },
    { key: 'address', label: 'Address', required: true },
    { key: 'phone', label: 'Contact Number', required: true },
    { key: 'email', label: 'Email', required: true },
    { key: 'registrationNumber', label: 'Registration Number', required: false },
    { key: 'vatNumber', label: 'VAT Number', required: false },
    { key: 'emisNumber', label: 'EMIS Number', required: false },
    { key: 'organizationType', label: 'Organization Type', required: true },
    { key: 'socialMediaLinks', label: 'Social Media Links', required: false },
  ];

  const [checked, setChecked] = useState<{ [key: string]: boolean }>({});
  const [submitting, setSubmitting] = useState(false);

  const handleCheck = (key: string) => {
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const issues = fields.filter(f => checked[f.key]).map(f => f.label).join(', ');
    // Optionally, you can send the issue report here, or just call onSubmit
    await onSubmit(issues);
    setSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">&times;</button>
        <h2 className="text-xl font-bold mb-2">Mark Missing/Problematic Fields</h2>
        <p className="mb-4 text-gray-600">Select all fields that are missing or have issues:</p>
        
        {/* Summary */}
        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between text-sm">
            <span>Required fields missing: <span className="font-semibold text-red-600">
              {fields.filter(f => f.required && !orgData[f.key]).length}
            </span></span>
            <span>Optional fields not provided: <span className="font-semibold text-gray-600">
              {fields.filter(f => !f.required && !orgData[f.key]).length}
            </span></span>
          </div>
        </div>
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div className="max-h-64 overflow-y-auto mb-4">
            {fields.map(field => {
              const hasValue = field.key === 'socialMediaLinks' 
                ? (orgData[field.key] && orgData[field.key].length > 0)
                : orgData[field.key];
              
              return (
                <label key={field.key} className="flex items-center gap-2 py-1 hover:bg-gray-50 p-2 rounded">
                  <input
                    type="checkbox"
                    checked={!!checked[field.key]}
                    onChange={() => handleCheck(field.key)}
                  />
                  <div className="flex-1">
                    <span className="font-medium">{field.label}</span>
                    <span className={`text-xs ml-2 px-2 py-1 rounded ${
                      field.required 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {field.required ? 'Required' : 'Optional'}
                    </span>
                  </div>
                  {hasValue ? (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Present</span>
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
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Issues'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default MailModal
