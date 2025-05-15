import axios from 'axios';
import React, { useEffect } from 'react';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Guides = () => {
  const [guides, setGuides] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/guide`);
      setGuides(res.data);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this guide?')) return;

    try {
      await axios.delete(`${BASE_URL}/guide/${id}`);
      toast.success('Guide deleted');
      setGuides(prev => prev.filter((guide: any) => guide._id !== id));
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete guide');
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className='flex flex-col gap-4 w-full'>
      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-semibold'>Guides</h2>
        <Link to='/guide/write' className='bg-gray-900 text-white py-2 px-4 rounded-md'>
          Add New Guide
        </Link>
      </div>

      <div className='overflow-x-auto bg-white'>
        <table className='min-w-full border bg-white border-gray-200'>
          <thead className='bg-gray-100'>
            <tr>
              <th className='text-left p-2 border'>#</th>
              <th className='text-left p-2 border'>Title</th>
              <th className='text-left p-2 border'>Category</th>
              <th className='text-left p-2 border'>Image</th>
              <th className='text-left p-2 border'>Video</th>
              <th className='text-left p-2 border'>Actions</th>
            </tr>
          </thead>
          <tbody>
            {guides.map((guide: any, index: number) => (
              <tr key={guide._id} className='border-t'>
                <td className='p-2 border'>{index + 1}</td>
                <td className='p-2 border'>{guide.title}</td>
                <td className='p-2 border'>{guide.category?.name}</td>
                <td className='p-2 border'>
                  <img src={guide.image} alt='cover' className='w-16 h-10 object-cover rounded' />
                </td>
                <td className='p-2 border'>
                  <a href={guide.videoUrl} target='_blank' rel='noreferrer' className='text-blue-600 underline'>
                    View Video
                  </a>
                </td>
                <td className='p-2 border'>
                  <button
                    onClick={() => handleDelete(guide._id)}
                    className='bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {guides.length === 0 && (
              <tr>
                <td colSpan={6} className='text-center p-4'>
                  No guides found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Guides;
