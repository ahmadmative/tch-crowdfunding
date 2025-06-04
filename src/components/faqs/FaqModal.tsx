import axios from "axios"
import React, { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"
import { BASE_URL } from "../../config/url"

interface Category {
  _id: string
  title: string  
  icon?: string
  active?: boolean
  __v?: number
}

interface Props {
  open: boolean
  onClose: () => void
  onSave: () => void
  question: string
  answer: string
  selectedCategory: string | Category | null
  onQuestionChange: (value: string) => void
  onAnswerChange: (value: string) => void
  onCategoryChange: (value: string) => void
  isEditing: boolean
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
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
      fetchFaqsCategories()
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open])

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

  const getSelectedCategoryId = () => {
    if (!selectedCategory) return ""
    return typeof selectedCategory === "string"
      ? selectedCategory
      : selectedCategory._id
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-lg"
      >
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

        <div className="mb-4">
          <label className="block font-medium mb-1">Category</label>
          <select
            value={getSelectedCategoryId()}
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
            disabled={!question.trim() || !answer.trim() || !getSelectedCategoryId()}
          >
            {isEditing ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FaqModal
