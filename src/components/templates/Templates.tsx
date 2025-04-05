import { DocumentDuplicateIcon, PencilIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import React from 'react'
import { useTemplate } from '../../context/TemplateContext';
import EditTemplateEditorModal from './EditTemplate';

interface Template {
  _id: string;
  name: string;
  subject: string;
  body: string;
  createdAt: string;
}

interface TemplatesComponentProps {
  templates: Template[];
}

const TemplatesComponent = ({ templates }: TemplatesComponentProps) => {
    const { setSelectedTemplate } = useTemplate();
    const [editModal, setEditModal] = React.useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <EditTemplateEditorModal isOpen={editModal} onClose={() => setEditModal(false)} refreshTemplates={() => {}} />
      {templates?.map((template: Template) => (
        <div key={template._id} className="border rounded-lg p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold">{template.name}</h4>
              <p className="text-xs text-gray-500 mt-2">Created At: {dayjs(template.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
            </div>
            <div className="flex space-x-2">
              <button onClick={()=> {setSelectedTemplate(template);setEditModal(true)}} className="text-primary-600 hover:text-primary-800">
                <PencilIcon className="h-5 w-5" />
              </button>
              <button className="text-gray-600 hover:text-gray-800">
                <DocumentDuplicateIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-700">Subject: {template.subject}</p>
            {/* <p className="text-sm text-gray-700">Description: {template.body}</p> */}
          </div>
          <div className="mt-4 flex justify-end">
            <button onClick={() => setSelectedTemplate(template)}  className="text-primary-600 hover:text-primary-800 text-sm font-medium">
              Use Template
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TemplatesComponent