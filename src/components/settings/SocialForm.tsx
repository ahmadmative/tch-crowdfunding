import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SocialLink {
  _id?: string;
  name: string;
  icon: string;
  link: string;
}

interface SocialFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: SocialLink | null;
  isLoading: boolean;
}

const SocialForm: React.FC<SocialFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}) => {
  const [formData, setFormData] = React.useState<SocialLink>({
    name: '',
    icon: '',
    link: '',
  });

  React.useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({ name: '', icon: '', link: '' });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {initialData ? 'Edit Social Link' : 'Add Social Link'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Platform Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. Facebook"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Icon Class/URL *</label>
            <input
              type="text"
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              required
              placeholder="e.g. fab fa-facebook or image URL"
              className="w-full border border-gray-300 rounded-md p-2"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use Font Awesome classes or paste icon URL
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Link URL *</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              required
              placeholder="https://example.com/yourprofile"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading
                ? 'Saving...'
                : initialData
                ? 'Update Link'
                : 'Add Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialForm;
