import { useState, useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "../config/url"


interface FAQ {
  question: string
  answer: string
}

interface FAQsData {
  heading: string
  subHeading: string
  questions: FAQ[]
}

export default function FAQsUpdate() {
  const [faqs, setFaqs] = useState<FAQsData>({
    heading: "",
    subHeading: "",
    questions: [],
  })
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  useEffect(() => {
    const fetchFaqs = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/faqs`)
        if (res.data) {
          setFaqs(res.data)
        }
      } catch (error) {
        alert("Failed to fetch FAQs data")
      } finally {
        setLoading(false)
      }
    }
    fetchFaqs()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFaqs(prev => ({ ...prev, [name]: value }))
  }

  const handleAddQuestion = () => {
    if (!question.trim() || !answer.trim()) {
      alert("Question and answer cannot be empty")
      return
    }

    if (editIndex !== null) {
      const updatedQuestions = [...faqs.questions]
      updatedQuestions[editIndex] = { question, answer }
      setFaqs(prev => ({ ...prev, questions: updatedQuestions }))
      setEditIndex(null)
    } else {
      setFaqs(prev => ({ ...prev, questions: [...prev.questions, { question, answer }] }))
    }

    setQuestion("")
    setAnswer("")
  }

  const handleEditQuestion = (index: number) => {
    const { question, answer } = faqs.questions[index]
    setQuestion(question)
    setAnswer(answer)
    setEditIndex(index)
  }

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index)
    setShowDeleteConfirm(true)
  }

  const confirmDelete = () => {
    if (deleteIndex !== null) {
      const updatedQuestions = faqs.questions.filter((_, i) => i !== deleteIndex)
      setFaqs(prev => ({ ...prev, questions: updatedQuestions }))
      setShowDeleteConfirm(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!faqs.heading.trim()) {
      alert("Heading cannot be empty")
      return
    }

    try {
      setSubmitting(true)
      await axios.post(`${BASE_URL}/faqs`, faqs)
    //   alert("FAQs updated successfully")
    } catch (error) {
      alert("Failed to update FAQs")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4">

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold text-center mb-2">FAQs Management</h2>
          <p className="text-center text-gray-600 mb-6">Update your website's Frequently Asked Questions</p>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Main Heading</label>
              <input
                name="heading"
                value={faqs.heading}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter the main FAQs heading"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Sub Heading</label>
              <textarea
                name="subHeading"
                value={faqs.subHeading}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter a brief description"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">
            {editIndex !== null ? "Edit Question" : "Add New Question"}
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Question</label>
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter the question"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Answer</label>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter the answer"
                rows={4}
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-4 py-2 bg-gray-900 text-white rounded hover:scale-105 trnasition-transfrom duration-300 flex items-center gap-1"
              >
                {editIndex !== null ? (
                  <>
                    <span>Update Question</span>
                  </>
                ) : (
                  <>
                    <span>Add Question</span>
                  </>
                )}
              </button>

              {editIndex !== null && (
                <button
                  type="button"
                  onClick={() => {
                    setQuestion("")
                    setAnswer("")
                    setEditIndex(null)
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4">FAQs Preview</h3>

          {faqs.questions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No questions added yet</p>
          ) : (
            <div className="space-y-3">
              {faqs.questions.map((faq, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="flex justify-between items-center p-3 bg-gray-50">
                    <h4 className="font-medium">{faq.question}</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditQuestion(index)}
                        className="p-1 text-blue-500 hover:text-blue-700"
                        aria-label="Edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(index)}
                        className="p-1 text-red-500 hover:text-red-700"
                        aria-label="Delete"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="p-3 text-gray-700">{faq.answer}</div>
                </div>
              ))}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-6 px-4 py-2 bg-gray-900 text-white rounded hover:scale-105 trnasition-transform duration-300 disabled:bg-gray-500"
          >
            {submitting ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </form>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <h3 className="text-lg font-bold mb-2">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this FAQ?</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}