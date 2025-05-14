// GuideCategory.tsx
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import axios from 'axios';
import GuideCategoryModal from './GuideCategoryModal';
import { Pencil, Trash2 } from 'lucide-react';

const GuideCategory = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/guide-category`);
      setData(res.data);
      console.log("fetch guide",res.data);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const handleEdit = (cat: any) => {
    setSelectedCategory(cat);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setSelectedCategory(null);
    setOpenModal(true);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Guide Categories</h2>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Category
        </button>
      </div>

      <table className="min-w-full bg-white border rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Icon</th>
            <th className="py-2 px-4 border-b">Status</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((cat: any) => (
            <tr key={cat._id}>
              <td className="py-2 px-4 border-b">{cat.name}</td>
              <td className="py-2 px-4 border-b">
                <img src={cat.icon} alt={cat.name} className="w-10 h-10" />
              </td>
              <td className="py-2 px-4 border-b">
                {cat.isActive ? 'Active' : 'Inactive'}
              </td>
              <td className="py-2 px-4 border-b flex gap-2">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Pencil size={18} />
                </button>
                <button
                  onClick={async () => {
                    try {
                      await axios.delete(`${BASE_URL}/guide-category/${cat._id}`);
                      fetch();
                      toast.success('Deleted');
                    } catch (err) {
                      toast.error('Error deleting');
                    }
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {openModal && (
        <GuideCategoryModal
          onClose={() => setOpenModal(false)}
          onSuccess={() => {
            setOpenModal(false);
            fetch();
          }}
          initialData={selectedCategory}
        />
      )}
    </div>
  );
};

export default GuideCategory;
