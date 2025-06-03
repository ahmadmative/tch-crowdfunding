import { PencilIcon } from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import React from 'react'
import { useTemplate } from '../../context/TemplateContext'
import EditTemplateEditorModal from './EditTemplate'
import { Link } from 'react-router-dom'

interface Template {
  _id: string
  name: string
  subject: string
  body: string
  createdAt: string
}

interface TemplatesComponentProps {
  templates: Template[]
}

const TemplatesComponent = ({ templates }: TemplatesComponentProps) => {
  const { setSelectedTemplate } = useTemplate()
  const [editModal, setEditModal] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState('')

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <EditTemplateEditorModal isOpen={editModal} onClose={() => setEditModal(false)} refreshTemplates={() => {}} />

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by template name..."
          className="w-full md:w-1/2 border rounded px-3 py-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1  gap-6">
        {filteredTemplates.map((template: Template) => (
          <div key={template._id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold">{template.name}</h4>
                <p className="text-xs text-gray-500 mt-2">
                  Created At: {dayjs(template.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </p>
              </div>
              <div className="flex space-x-2">
                <Link to={`/builder/${template._id}`} className="text-primary-600 hover:text-primary-800">
                  <PencilIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-700">Subject: {template.subject}</p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: template.body }} />
          </div>
        ))}
      </div>
    </>
  )
}

export default TemplatesComponent
