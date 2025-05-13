import axios from "axios";
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/url";
import { toast } from "react-toastify";
import FaqCategoryModal from "./faqs/FaqCategoryModal";

interface Category {
  _id: string;
  title: string;
  icon: string;
  active: boolean;
  __v: number;
}

const FaqsCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]); // Change type to Category[]
  const [loading, setLoading] = useState(true);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState<Category | null>(null); // Change type to Category | null

  const handleCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/faqs/categories`);
      setCategories(res.data); // Set categories as array of objects
    } catch (error) {
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setEditCategory(null); // Reset edit category
    setCategoryModalOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    // Pass the whole category object
    setEditCategory(category);
    setCategoryModalOpen(true);
  };

  useEffect(() => {
    handleCategories();
  }, []);

  const handleSaveCategory = () => {
    handleCategories();
    toast.success("Category saved");
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/faqs/categories/${id}`);
      handleCategories();
      toast.success("Category Status Updated");
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="space-y-6">
        {/* Heading Section */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-bold mb-2">FAQs Categories</h2>
          <p className="text-gray-600 mb-4">Manage categories for your FAQs</p>

          <div className="flex justify-between mb-4">
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add Category
            </button>
          </div>

          {/* Categories Table */}
          {categories.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No categories available
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr className="bg-gray-100 text-left">
                    <th className="px-4 py-2 border">#</th>
                    <th className="px-4 py-2 border">Category</th>
                    <th className="px-4 py-2 border">Active</th>
                    <th className="px-4 py-2 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category, index) => (
                    <tr key={category._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border">{index + 1}</td>
                      <td className="px-4 py-2 border">{category.title}</td>
                      <td className="px-4 py-2 border">
                        <span
                          className={`px-2 py-1 rounded text-white text-sm ${
                            category.active ? "bg-green-500" : "bg-red-500"
                          }`}
                        >
                          {category.active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-4 py-2 border space-x-2">
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleDeleteCategory(category._id);
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Toggle_Status
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

      {/* Category Modal */}
      <FaqCategoryModal
        open={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
        category={editCategory || null} // Pass full category object
        onSave={handleSaveCategory}
      />
    </div>
  );
};

export default FaqsCategories;
