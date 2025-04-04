import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import { useState } from 'react';
import { XMarkIcon, LinkIcon, PhotoIcon, VariableIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import { Editor as TipTapEditor } from '@tiptap/core';

interface EmailTemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  refreshTemplates?: () => void;
}

const EmailTemplateEditorModal = ({ isOpen, onClose, refreshTemplates }: EmailTemplateEditorModalProps) => {
  const [template, setTemplate] = useState({
    name: '',
    subject: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeVariable, setActiveVariable] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: 'Write your email content here...',
      }),
    ],
    content: '<p>Hello {donor_name}!</p>',
    onUpdate: ({ editor }: { editor: TipTapEditor }) => {
      setError('');
    },
  });

  const handleAddVariable = () => {
    if (!activeVariable) return;
    const variable = `{${activeVariable}}`;
    editor?.commands.insertContent(variable);
    setActiveVariable('');
  };

  const handleAddLink = () => {
    const url = window.prompt('Enter the URL');
    if (url) {
      editor?.commands.toggleLink({ href: url });
    }
  };

  const handleSave = async () => {
    if (!template.name || !template.subject || !editor?.getText()) {
      setError('Please fill all fields');
      return;
    }

    try {
      setIsLoading(true);
      await axios.post(`${BASE_URL}/template/create`, {
        name: template.name,
        subject: template.subject,
        body: editor.getHTML(),
        variables: extractVariables(editor.getHTML())
      });
      
      if (refreshTemplates) refreshTemplates();
      onClose();
      // Reset form
      setTemplate({ name: '', subject: '' });
      editor.commands.clearContent();
    } catch (err) {
      setError('Failed to save template. Please try again.');
      console.error('Error saving template:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const extractVariables = (html: string) => {
    const variableRegex = /\{([^}]+)\}/g;
    const matches = html.match(variableRegex) || [];
    return Array.from(new Set(matches));; // Remove duplicates
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-xl p-6 mx-4">
        {/* Modal Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold leading-6 text-gray-900">
            Create New Email Template
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={isLoading}
          >
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Modal Content */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name
              </label>
              <input
                type="text"
                placeholder="e.g. Donation Receipt"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                placeholder="e.g. Thank you for your donation!"
                value={template.subject}
                onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Editor Toolbar */}
          <div className="border border-gray-300 rounded-t-md p-2 bg-gray-50 flex flex-wrap gap-2">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-2 rounded ${editor?.isActive('bold') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              disabled={isLoading}
            >
              <span className="font-bold">B</span>
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-2 rounded ${editor?.isActive('italic') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              disabled={isLoading}
            >
              <span className="italic">I</span>
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded ${editor?.isActive('underline') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              disabled={isLoading}
            >
              <span className="underline">U</span>
            </button>
            <button
              onClick={handleAddLink}
              className={`p-2 rounded ${editor?.isActive('link') ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
              disabled={isLoading}
            >
              <LinkIcon className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 ml-2">
              <VariableIcon className="h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="variable_name"
                value={activeVariable}
                onChange={(e) => setActiveVariable(e.target.value.replace(/\s/g, '_'))}
                className="px-2 py-1 border border-gray-300 rounded text-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleAddVariable}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm hover:bg-blue-200"
                disabled={isLoading || !activeVariable}
              >
                Add
              </button>
            </div>
          </div>

          {/* Editor Content */}
          <div className="border border-gray-300 rounded-b-md p-4 min-h-[300px]">
            <EditorContent editor={editor} />
          </div>

          <div className="text-sm text-gray-500">
            <p>Available variables will be automatically detected from your content.</p>
            {/* <p>Example: {`{donor_name}`, `{donation_amount}`, `{campaign_name}`}</p> */}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              'Save Template'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailTemplateEditorModal;