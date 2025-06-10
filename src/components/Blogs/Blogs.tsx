import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import BlogCard from './BlogCard';
import { Link } from 'react-router-dom';

interface Blog {
  _id: string;
  title: string;
  image: string;
  description: string;
  content: string;
}

const Blogs = () => {
  const [data, setData] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/blog`);
      setData(res.data);
    } catch (error) {
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto mt-[10px] px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h1>

      <Link to={'/blog/write'} className='p-2 bg-gray-800 text-white my-4 cursor-pointer w-[150px] h-[50px] rounded-full flex items-center justify-center'>
        Write a Blog
      </Link>

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : data.length === 0 ? (
        <p className="text-center text-gray-500">No blogs found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.map((item) => (
            <BlogCard key={item._id} data={item} onDelete={fetchBlogs} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
