import axios from 'axios'
import React, { useState } from 'react'
import { BASE_URL } from '../../config/url'

const MailModal = ({ receiverId, orgData, onClose, onSubmit }: {
  receiverId: string,
  orgData: any,
  onClose: () => void,
  onSubmit: (issues: string) => void
}) => {
  // List of fields to check for issues
  const fields = [
    { key: 'name', label: 'Organization Name' },
    { key: 'organizationType', label: 'Organization Type' },
    { key: 'tags', label: 'Tags' },
    { key: 'description', label: 'Description' },
    { key: 'logo', label: 'Logo' },
    { key: 'supportingDoc', label: 'Supporting Document' },
    { key: 'address1', label: 'Address 1' },
    { key: 'address2', label: 'Address 2' },
    { key: 'postalCode', label: 'Postal Code' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
    { key: 'country', label: 'Country' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'web', label: 'Website' },
    { key: 'socialMediaLinks', label: 'Social Media Links' },
    { key: 'firstName', label: 'Contact First Name' },
    { key: 'lastName', label: 'Contact Last Name' },
    { key: 'personPhone', label: 'Contact Phone' },
    { key: 'role', label: 'Contact Role' },
    { key: 'founderId', label: 'Founder ID' },
    { key: 'founderDocument', label: 'Founder Document' },
    { key: 'accountHolderName', label: 'Account Holder Name' },
    { key: 'identificationType', label: 'Identification Type' },
    { key: 'identification', label: 'Identification' },
    { key: 'reference', label: 'Reference' },
    { key: 'accountNo', label: 'Account No' },
    { key: 'accountType', label: 'Account Type' },
    { key: 'bankName', label: 'Bank Name' },
    { key: 'bankDocument', label: 'Bank Document' },
    { key: 'donorsRange', label: 'Donors Range' },
    { key: 'staff', label: 'Staff' },
    { key: 'crowdfund', label: 'Crowdfund' },
    { key: 'eventCrowdfund', label: 'Event Crowdfund' },
    { key: 'suppoters', label: 'Supporters' },
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
        <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
          <div className="max-h-64 overflow-y-auto mb-4">
            {fields.map(field => (
              <label key={field.key} className="flex items-center gap-2 py-1">
                <input
                  type="checkbox"
                  checked={!!checked[field.key]}
                  onChange={() => handleCheck(field.key)}
                />
                <span>{field.label}</span>
                {orgData[field.key] ? (
                  <span className="text-xs text-green-600">(Present)</span>
                ) : (
                  <span className="text-xs text-red-600">(Missing)</span>
                )}
              </label>
            ))}
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
