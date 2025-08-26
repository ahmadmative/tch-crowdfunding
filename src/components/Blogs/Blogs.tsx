import axios from 'axios';
import React, { useEffect, useState, Fragment } from 'react';
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6); // 6 cards per page for grid layout
  const [totalPages, setTotalPages] = useState<number>(0);
  const [paginatedBlogs, setPaginatedBlogs] = useState<Blog[]>([]);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);

  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/blog`);
      setData(res.data);
      setFilteredBlogs(res.data); // Initialize filtered data
    } catch (error) {
      toast.error("Error fetching blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  // Pagination helper functions
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };

  // Filter logic
  useEffect(() => {
    if (!data.length) {
      setFilteredBlogs([]);
      return;
    }

    const filtered = data.filter(blog => {
      const searchLower = searchTerm.toLowerCase();
      
      return !searchTerm || (
        blog.title.toLowerCase().includes(searchLower) ||
        blog.description.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower)
      );
    });

    setFilteredBlogs(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, data]);

  // Pagination logic
  useEffect(() => {
    if (!filteredBlogs.length) {
      setPaginatedBlogs([]);
      setTotalPages(0);
      return;
    }

    const total = Math.ceil(filteredBlogs.length / itemsPerPage);
    setTotalPages(total);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginated = filteredBlogs.slice(startIndex, endIndex);
    
    setPaginatedBlogs(paginated);
  }, [filteredBlogs, currentPage, itemsPerPage]);

  const clearFilters = () => {
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-[10px] px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Blogs</h1>

      {/* Header with Write Blog Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <Link to={'/blog/write'} className='p-2 bg-gray-800 text-white cursor-pointer w-[150px] h-[50px] rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors'>
          Write a Blog
        </Link>

        {/* Search Filter */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="Search blogs..."
              className="w-full p-3 pl-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-3.5 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Status and Clear Button */}
      {searchTerm && (
        <div className="flex justify-between items-center mb-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">
            Showing {filteredBlogs.length} of {data.length} blogs
            <span className="ml-2 text-blue-600">(filtered)</span>
          </div>
          <button
            onClick={clearFilters}
            className="px-3 py-1 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
          >
            Clear Filter
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {data.length === 0 ? 'No blogs found.' : 'No blogs match your search criteria.'}
          </p>
          {searchTerm && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Blog Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {paginatedBlogs.map((item) => (
              <BlogCard key={item._id} data={item} onDelete={fetchBlogs} />
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4">
            {/* Items per page selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={18}>18</option>
              </select>
              <span className="text-sm text-gray-700">blogs per page</span>
            </div>

            {/* Pagination info */}
            <div className="text-sm text-gray-700">
              Showing {filteredBlogs.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredBlogs.length)} of {filteredBlogs.length} blogs
              {searchTerm && (
                <span className="text-blue-600"> (filtered from {data.length} total)</span>
              )}
            </div>

            {/* Pagination buttons */}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  First
                </button>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((pageNum, index, array) => (
                  <Fragment key={pageNum}>
                    {index > 0 && array[index - 1] !== pageNum - 1 && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                    <button
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 text-sm border rounded transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-500 border-blue-500 text-white'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                    {index < array.length - 1 && array[index + 1] !== pageNum + 1 && pageNum !== totalPages && (
                      <span className="px-2 text-gray-500">...</span>
                    )}
                  </Fragment>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Last
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Blogs;
