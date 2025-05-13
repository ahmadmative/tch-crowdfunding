import React, { useState, useEffect } from 'react'
import upload from '../../utils/upload'
import axios from 'axios'
import { BASE_URL } from '../../config/url'
import { toast } from 'react-toastify'

const FaqCategoryModal = ({
  open,
  onClose,
  onSave,
  category,
}: {
  open: boolean
  onClose: () => void  
  category: any
  onSave: () => void
}) => {
  console.log(category)
  
  const [data, setData] = useState<{ title: string; icon: File | string }>({
    title: category ? category.title : '',
    icon: category ? category.icon : '',
  })
  
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (category) {
      setData({ title: category.title, icon: category.icon })
    }
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let iconUrl = ''
      if (data.icon instanceof File) {
        iconUrl = await upload(data.icon)
      } else {
        iconUrl = data.icon
      }

      const payload = {
        title: data.title,
        icon: iconUrl,
      }

      if (category) {
        // Edit category
        await axios.patch(`${BASE_URL}/faqs/categories/${category._id}`, payload)
        toast.success('Category updated')
      } else {
        // Add new category
        await axios.post(`${BASE_URL}/faqs/categories`, payload)
        toast.success('Category added')
      }

      // Pass the updated data (not the entire category) to the onSave function
      onSave() 
      onClose()
    } catch (error) {
      toast.error('Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
        <h2 className="text-xl font-semibold mb-4">{category ? 'Edit' : 'Add'} FAQ Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Icon</label>
            {data.icon && typeof data.icon === 'string' ? (
              <div className="mb-2">
                <img src={data.icon} alt="Current Icon" className="w-12 h-12 object-cover" />
              </div>
            ) : null}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                setData({ ...data, icon: e.target.files?.[0] || '' })
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FaqCategoryModal
