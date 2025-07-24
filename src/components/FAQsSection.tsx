import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config/url";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FaqModal from "./faqs/FaqModal";
import { Link } from "react-router-dom";
import { EditIcon, TrashIcon } from "lucide-react";

interface FAQ {
  category: any; // Category will be an ObjectId (string) of the category
  question: string;
  answer: string;
}

interface FAQsData {
  heading: string;
  subHeading: string;
  questions: FAQ[];
}

export default function FAQsUpdate() {
  const [faqs, setFaqs] = useState<FAQsData>({
    heading: "",
    subHeading: "",
    questions: [],
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; title: string }[]>([]); // Array of categories with id and name
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [allQuestions, setAllQuestions] = useState<FAQ[]>([]);


  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
    
    if (searchValue.trim() === "") {
      // Show all questions when search is empty
      setFaqs({ ...faqs, questions: allQuestions });
    } else {
      // Filter questions based on search
      const filteredFaqs = allQuestions.filter((faq) =>
        faq.question.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFaqs({ ...faqs, questions: filteredFaqs });
    }
  }

  


  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/faqs`);
      if (res.data) {
        setFaqs(res.data);
        setAllQuestions(res.data.questions); // Store all questions for search functionality
      }
    } catch (error) {
      toast.error("Failed to fetch FAQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const autoSubmit = async (updatedData?: FAQsData) => {
    try {
      setSubmitting(true);
      const dataToSubmit = updatedData || faqs;
      await axios.post(`${BASE_URL}/faqs`, dataToSubmit);
      toast.success("Changes saved");
    } catch (err) {
      toast.error("Failed to save changes");
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = async (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    const updatedFaqs = { ...faqs, [name]: value };
    setFaqs(updatedFaqs);
    await autoSubmit(updatedFaqs);
  };

  const handleSaveModal = async () => {
    if (!question.trim() || !answer.trim()) {
      toast.error("Question and answer cannot be empty");
      return;
    }

    if (!selectedCategory) {
      toast.error("Category must be selected");
      return;
    }

    

    const updatedQuestions = [...faqs.questions];

    if (editIndex !== null) {
      updatedQuestions[editIndex] = { category: selectedCategory, question, answer };
      // fetchFaqs()
      
      toast.success("Question updated");
      
    } else {
      updatedQuestions.push({ category: selectedCategory, question, answer });
      toast.success("Question added");
    }

    const updatedFaqs = { ...faqs, questions: updatedQuestions };
    setFaqs(updatedFaqs);
    setAllQuestions(updatedQuestions); // Update the stored questions for search

    setQuestion("");
    setAnswer("");
    setEditIndex(null);
    setSelectedCategory(null);
    setModalOpen(false);

    await autoSubmit(updatedFaqs);
  };

  const handleEdit = (index: number) => {
    const { category, question, answer } = faqs.questions[index];
    setSelectedCategory(category);
    setQuestion(question);
    setAnswer(answer);
    setEditIndex(index);
    setModalOpen(true);
  };

  const handleDeleteClick = (index: number) => {
    setDeleteIndex(index);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (deleteIndex !== null) {
      const updatedQuestions = faqs.questions.filter(
        (_, i) => i !== deleteIndex
      );
      const updatedFaqs = { ...faqs, questions: updatedQuestions };
      setFaqs(updatedFaqs);
      setAllQuestions(updatedQuestions); // Update the stored questions for search
      setDeleteIndex(null);
      setShowDeleteConfirm(false);
      toast.success("Question deleted");
      await autoSubmit(updatedFaqs);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="space-y-6">
        {/* Heading Section */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-2">FAQs Management</h2>
          <p className="text-gray-600 mb-4">
            Update your site's frequently asked questions
          </p>

          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Main Heading</label>
              <input
                name="heading"
                value={faqs.heading}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                placeholder="Enter FAQs heading"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Sub Heading</label>
              <textarea
                name="subHeading"
                value={faqs.subHeading}
                onChange={handleInputChange}
                className="w-full p-2 border rounded"
                rows={3}
                placeholder="Enter subheading or description"
              />
            </div>
          </div>
        </div>

        <div className="flex mt-4">
          <Link
          to={"/content/faqs/categories"}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Manage Categories
        </Link>
        </div>


        <div className="flex mt-4">
          {/* search bar */}
          <input
            type="text"
            placeholder="Search by question"
            className="w-full p-2 border rounded"
            value={search}
            onChange={handleSearch}
          />
        </div>

        {/* FAQs Listing */}
        <div className="bg-white p-6 rounded shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Questions Listing</h3>
            <button
              type="button"
              onClick={() => {
                setQuestion("");
                setAnswer("");
                setSelectedCategory(null);
                setEditIndex(null);
                setModalOpen(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Question
            </button>
          </div>

          {faqs.questions.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No questions added yet
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Question</th>
                    <th className="px-4 py-2 border">Answer</th>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.questions.map((faq, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{faq.question}</td>
                      <td className="px-4 py-2 border">{faq.answer}</td>
                      <td className="px-4 py-2 border">
                        {
                          
                            faq.category.title
                        }
                      </td>
                      <td className="px-4 py-2 border space-x-2">
                        <button
                          onClick={() => handleEdit(index)}
                          className="text-blue-600 hover:underline"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(index)}
                          className="text-red-600 hover:underline"
                        >
                          <TrashIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <FaqModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveModal}
        question={question}
        answer={answer}
        selectedCategory={selectedCategory}
        onQuestionChange={setQuestion}
        onAnswerChange={setAnswer}
        onCategoryChange={setSelectedCategory}
        isEditing={editIndex !== null}
      />

      {/* Confirm Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Confirm Delete</h3>
            <p className="mb-4">Are you sure you want to delete this FAQ?</p>
            <div className="flex space-x-4">
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
