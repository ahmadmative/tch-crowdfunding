import { Send, X, FileText, Edit3, Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import axios from 'axios';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';

interface ReplyModalProps {
  email: string;
  ticketData?: {
    _id: string;
    firstName: string;
    lastName: string;
    subject: string;
  };
  onClose: () => void;
  onSend: (subject: string, message: string, templateId?: string, isHtml?: boolean) => void;
  isLoading?: boolean;
}

interface MailTemplate {
  _id: string;
  subject: string;
  message: string;
}

const ReplyModal: React.FC<ReplyModalProps> = ({
  email,
  ticketData,
  onClose,
  onSend,
  isLoading = false,
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [templates, setTemplates] = useState<MailTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [useRichText, setUseRichText] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [templatesLoading, setTemplatesLoading] = useState(false);

  // React Quill modules configuration (simplified for modal)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 
    'list', 'bullet', 'color', 'background', 'link'
  ];

  // Fetch templates
  const fetchTemplates = async () => {
    setTemplatesLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/support-mail-template/get`);
      setTemplates(response.data);
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to fetch email templates');
    } finally {
      setTemplatesLoading(false);
    }
  };

  // Replace template variables
  const replaceTemplateVariables = (content: string): string => {
    if (!ticketData) return content;
    
    const variables = {
      '{{firstName}}': ticketData.firstName || '',
      '{{lastName}}': ticketData.lastName || '',
      '{{email}}': email || '',
      '{{subject}}': ticketData.subject || '',
      '{{ticketId}}': ticketData._id || '',
      '{{date}}': new Date().toLocaleDateString()
    };

    let replacedContent = content;
    Object.entries(variables).forEach(([variable, value]) => {
      replacedContent = replacedContent.replace(new RegExp(variable, 'g'), value);
    });

    return replacedContent;
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t._id === templateId);
    if (template) {
      setSelectedTemplate(templateId);
      const processedSubject = replaceTemplateVariables(template.subject);
      const processedMessage = replaceTemplateVariables(template.message);
      
      setSubject(processedSubject);
      setMessage(processedMessage);
      
      // Check if template contains HTML to determine if we should use rich text
      const containsHtml = /<[^>]*>/g.test(template.message);
      setUseRichText(containsHtml);
      setIsEditingTemplate(true);
    }
  };

  // Clear template selection
  const clearTemplate = () => {
    setSelectedTemplate("");
    setSubject("");
    setMessage("");
    setUseRichText(false);
    setIsEditingTemplate(false);
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in both subject and message');
      return;
    }
    onSend(subject, message, selectedTemplate || undefined, useRichText);
  };

  // Strip HTML for plain text view
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b p-4">
          <h3 className="text-lg font-semibold">Reply to Support Ticket</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4">
            {/* Recipient Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Recipient Email
              </label>
              <div className="p-2 bg-gray-100 rounded text-gray-800 text-sm">{email}</div>
            </div>

            {/* Template Selection */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-gray-900">Email Templates</h4>
                <div className="flex items-center space-x-2">
                  {selectedTemplate && (
                    <button
                      type="button"
                      onClick={clearTemplate}
                      className="text-xs text-red-600 hover:text-red-800"
                    >
                      Clear Template
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setUseRichText(!useRichText)}
                    className={`text-xs px-2 py-1 rounded ${
                      useRichText ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {useRichText ? 'Rich Text ON' : 'Rich Text OFF'}
                  </button>
                </div>
              </div>

              {templatesLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="text-sm text-gray-500 mt-2">Loading templates...</p>
                </div>
              ) : templates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {templates.map((template) => (
                    <div
                      key={template._id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedTemplate === template._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleTemplateSelect(template._id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-medium text-gray-900 truncate">
                            {template.subject}
                          </h5>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                            {stripHtml(template.message).substring(0, 80)}...
                          </p>
                        </div>
                        <div className="flex items-center ml-2">
                          {selectedTemplate === template._id ? (
                            <Edit3 className="w-4 h-4 text-blue-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No email templates found</p>
                  <p className="text-xs text-gray-400">Create templates in the Email Templates section</p>
                </div>
              )}
            </div>

            {/* Template Variables Info */}
            {/* {isEditingTemplate && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <h5 className="text-sm font-medium text-blue-900 mb-2">
                  <Eye className="w-4 h-4 inline mr-1" />
                  Template Applied & Variables Replaced
                </h5>
                <div className="text-xs text-blue-700 grid grid-cols-2 md:grid-cols-3 gap-1">
                  <span>{'{{firstName}}'} → {ticketData?.firstName || 'N/A'}</span>
                  <span>{'{{lastName}}'} → {ticketData?.lastName || 'N/A'}</span>
                  <span>{'{{email}}'} → {email || 'N/A'}</span>
                  <span>{'{{subject}}'} → {ticketData?.subject || 'N/A'}</span>
                  <span>{'{{ticketId}}'} → {ticketData?._id || 'N/A'}</span>
                  <span>{'{{date}}'} → {new Date().toLocaleDateString()}</span>
                </div>
              </div>
            )} */}

            {/* Subject Field */}
            <div className="mb-4">
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject *
              </label>
              <input
                id="subject"
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter subject"
              />
            </div>

            {/* Message Field */}
            <div className="mb-4">
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message *
                {useRichText && <span className="text-xs text-blue-600 ml-2">(Rich Text Mode)</span>}
              </label>
              
              {useRichText ? (
                <div className="border border-gray-300 rounded">
                  <ReactQuill
                    theme="snow"
                    value={message}
                    onChange={setMessage}
                    modules={modules}
                    formats={formats}
                    placeholder="Type your reply message here..."
                    style={{ minHeight: '200px' }}
                  />
                </div>
              ) : (
                <textarea
                  id="message"
                  required
                  value={stripHtml(message)}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={8}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your reply message here..."
                />
              )}
            </div>

            {/* Character/Word Count */}
            <div className="mb-4 text-xs text-gray-500 text-right">
              {useRichText 
                ? `${stripHtml(message).length} characters`
                : `${message.length} characters`
              }
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading || !subject.trim() || !message.trim()}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 w-4 h-4" />
                  Send Reply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal;