import axios from 'axios';
import { Trash } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';

interface BlogCardProps {
  data: {
    _id: string;
    image: string;
    title: string;
    description: string;
  };
  onDelete: (id: string) => void;
}

const BlogCard: React.FC<BlogCardProps> = ({ data, onDelete }) => {

  const handleDelete = (id: string) => {
    try {
      const res = axios.delete(`${BASE_URL}/blog/${id}`);
      toast.success('Blog deleted successfully');
    } catch (error) {
      toast.error('Error deleting blog');
    }
  }


  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden w-full max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <img
        src={data.image}
        alt={data.title}
        className="w-full h-56 object-cover"
      />

      <div className="p-4 flex flex-col flex-grow">
        <h2 className="text-lg font-semibold text-gray-800 mb-1 truncate">
          {data.title}
        </h2>

        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {data.description}
        </p>

        <div onClick={() => handleDelete(data._id)} className='p-2 hover:bg-gray-200 cursor-pointer w-[50px] h-[50px] rounded-full flex items-center justify-center'>
          <Trash className="w-6 h-6" />
        </div>

        <div className="mt-auto">
          <Link
            to={`/blog/${data._id}`}
            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
          >
            Read more
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;
