import axios from "axios"
import React, { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { BASE_URL } from "../../config/url"

interface Props {
  open: boolean
  onClose: () => void
  onSave: () => void
  question: string
  answer: string
  selectedCategory: string | null
  onQuestionChange: (value: string) => void
  onAnswerChange: (value: string) => void
  onCategoryChange: (value: string) => void
  isEditing: boolean
}

interface Category {
  _id: string
  title: string  // Changed from 'name' to 'title' to match API response
  icon?: string
  active?: boolean
  __v?: number
}

const FaqModal: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  question,
  answer,
  selectedCategory,
  onQuestionChange,
  onAnswerChange,
  onCategoryChange,
  isEditing
}) => {
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  const fetchFaqsCategories = async () => {
    setLoadingCategories(true)
    try {
      const res = await axios.get(`${BASE_URL}/faqs/categories?active=true`)
      if (res.data) {
        setCategories(res.data)
      }
    } catch (error) {
      toast.error("Failed to fetch categories")
    } finally {
      setLoadingCategories(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchFaqsCategories()
    }
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg">
        <h3 className="text-xl font-bold mb-4">{isEditing ? "Edit FAQ" : "Add FAQ"}</h3>

        <div className="mb-4">
          <label className="block font-medium mb-1">Question</label>
          <input
            value={question}
            onChange={(e) => onQuestionChange(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter the question"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Answer</label>
          <textarea
            value={answer}
            onChange={(e) => onAnswerChange(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter the answer"
            rows={4}
          />
        </div>

        {/* Category Dropdown */}
        <div className="mb-4">
          <label className="block font-medium mb-1">Category</label>
          <select
            value={selectedCategory || ""}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={loadingCategories}
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}  
              </option>
            ))}
          </select>
          {loadingCategories && <p className="text-sm text-gray-500 mt-1">Loading categories...</p>}
        </div>

        <div className="flex justify-end gap-2">
          <button 
            onClick={onClose} 
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-blue-400"
            disabled={!question.trim() || !answer.trim() || !selectedCategory}
          >
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FaqModal