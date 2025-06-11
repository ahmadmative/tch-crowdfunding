import React, { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config/url";
import Notification from "../components/notification/Notification";
import { Trash2, Edit, Plus, Save, X, Star } from "lucide-react";
import upload from "../utils/upload";

interface TestimonialItem {
  _id?: string;
  name: string;
  role: string;
  content: string;
  avatar?: string;
  rating?: number; // Added rating field
}

interface TestimonialData {
  _id?: string;
  title: string;
  subtitle: string;
  image: string;
  testimonials: TestimonialItem[];
}

const TestimonialUpdate: React.FC = () => {
  const [testimonialData, setTestimonialData] = useState<TestimonialData>({
    title: "TESTIMONIALS",
    subtitle: "What People Say About Us",
    image: "/chooseUs-1.png",
    testimonials: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
  });
  const [isEditingTestimonial, setIsEditingTestimonial] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<TestimonialItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchTestimonialData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/testimonial`);
        if (res.data) {
          setTestimonialData(res.data);
        } else {
          // Set default data if API returns empty
          setTestimonialData({
            title: "What People Say About Us",
            subtitle: "TESTIMONIALS",
            image: "/testimonial.png",
            testimonials: [
              {
                _id: "1",
                name: "John Doe",
                role: "Donor",
                content: "This platform made donating so easy and transparent!",
                avatar: "/user.png",
                rating: 5
              },
              {
                _id: "2",
                name: "Jane Smith",
                role: "Volunteer",
                content: "I love being part of this amazing community helping others.",
                avatar: "/user.png",
                rating: 4
              }
            ]
          });
        }
      } catch (err) {
        console.error(err);
        setNotification({
          isOpen: true,
          title: "Error",
          message: "Failed to fetch testimonials"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonialData();
  }, []);

  const showNotification = (title: string, message: string) => {
    setNotification({ isOpen: true, title, message });
    setTimeout(() => setNotification({ ...notification, isOpen: false }), 5000);
  };

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTestimonialData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestimonialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCurrentTestimonial(prev => ({
      ...prev!,
      [name]: name === "rating" ? parseInt(value) : value
    }));
  };

  const handleSaveAllChanges = async () => {
    try {
      setIsSaving(true);
      const res = await axios.post(`${BASE_URL}/testimonial`, testimonialData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setTestimonialData(res.data);
      showNotification("Success", "All changes saved successfully");
    } catch (err) {
      console.error(err);
      showNotification("Error", "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveTestimonial = () => {
    try {
      let updatedTestimonials = [...testimonialData.testimonials];
      
      if (currentTestimonial?._id) {
        // Update existing testimonial
        const index = updatedTestimonials.findIndex(t => t._id === currentTestimonial._id);
        if (index !== -1) {
          updatedTestimonials[index] = currentTestimonial;
        }
      } else {
        // Add new testimonial
        const newId = Date.now().toString();
        updatedTestimonials.push({
          ...currentTestimonial!,
          _id: newId,
          rating: currentTestimonial?.rating || 5 // Default to 5 stars if not set
        });
      }

      setTestimonialData(prev => ({
        ...prev,
        testimonials: updatedTestimonials
      }));
      setIsEditingTestimonial(false);
      setCurrentTestimonial(null);
      showNotification("Success", "Testimonial saved locally");
    } catch (err) {
      showNotification("Error", "Failed to save testimonial");
      console.error(err);
    }
  };

  const handleDeleteTestimonial = (id: string) => {
    try {
      setTestimonialData(prev => ({
        ...prev,
        testimonials: prev.testimonials.filter(t => t._id !== id)
      }));
      showNotification("Success", "Testimonial deleted locally");
    } catch (err) {
      showNotification("Error", "Failed to delete testimonial");
      console.error(err);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'header' | 'avatar') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await upload(file);
      if (type === 'header') {
        setTestimonialData(prev => ({
          ...prev,
          image: url
        }));
      } else {
        setCurrentTestimonial(prev => ({
          ...prev!,
          avatar: url
        }));
      }
    } catch (err) {
      console.error(err);
      showNotification("Error", "Failed to upload image");
    }
  };

  const renderStars = (rating: number = 5) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={i < rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
          />
        ))}
      </div>
    );
  };

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
  )

  return (
    <div className="font-sans bg-primary w-full py-8 md:py-16">
      <div className="max-w-[1200px] mx-auto p-4">
        <Notification
          isOpen={notification.isOpen}
          onClose={() => setNotification({ ...notification, isOpen: false })}
          title={notification.title}
          message={notification.message}
        />

        {/* Header Section */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Testimonial Section</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={testimonialData.subtitle}
                onChange={handleHeaderChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={testimonialData.title}
                onChange={handleHeaderChange}
                className="w-full p-2 border rounded"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Upload Image</label>
              <div className="flex items-center gap-4">
                {testimonialData.image && (
                  <img
                    src={testimonialData.image}
                    alt="Preview"
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'header')}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Management */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Testimonials</h2>
            <button
              onClick={() => {
                setCurrentTestimonial({
                  name: "",
                  role: "",
                  content: "",
                  avatar: "",
                  rating: 5
                });
                setIsEditingTestimonial(true);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2"
            >
              <Plus size={16} /> Add Testimonial
            </button>
          </div>

          {/* Testimonial Form */}
          {isEditingTestimonial && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="text-lg font-semibold mb-4">
                {currentTestimonial?._id ? "Edit Testimonial" : "Add New Testimonial"}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={currentTestimonial?.name || ""}
                    onChange={handleTestimonialChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Role</label>
                  <input
                    type="text"
                    name="role"
                    value={currentTestimonial?.role || ""}
                    onChange={handleTestimonialChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Content</label>
                  <textarea
                    name="content"
                    value={currentTestimonial?.content || ""}
                    onChange={handleTestimonialChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <select
                    name="rating"
                    value={currentTestimonial?.rating || 5}
                    onChange={handleTestimonialChange}
                    className="w-full p-2 border rounded"
                  >
                    {[1, 2, 3, 4, 5].map(num => (
                      <option key={num} value={num}>
                        {num} Star{num !== 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                  <div className="mt-1">
                    {renderStars(currentTestimonial?.rating || 5)}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Avatar</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="file"
                      name="avatar"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'avatar')}
                      className="w-full p-2 border rounded"
                    />
                    {currentTestimonial?.avatar && (
                      <img
                        src={currentTestimonial.avatar}
                        alt="Avatar Preview"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setIsEditingTestimonial(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTestimonial}
                  className="px-4 py-2 bg-gray-900 text-white rounded flex items-center gap-2"
                >
                  <Save size={16} /> Save
                </button>
              </div>
            </div>
          )}

          {/* Testimonials List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonialData.testimonials.map((testimonial) => (
              <div key={testimonial._id || testimonial.name} className="border rounded-lg p-4 relative">
                <div className="absolute top-2 right-2 flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentTestimonial({ ...testimonial });
                      setIsEditingTestimonial(true);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => testimonial._id && handleDeleteTestimonial(testimonial._id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-3">
                  <img
                    src={testimonial.avatar || "/user-default.jpg"}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <div className="mb-2">
                  {renderStars(testimonial.rating)}
                </div>
                <p className="text-gray-700">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={handleSaveAllChanges} 
          disabled={isSaving}
          className={`bg-gray-900 hover:scale-105 transition-transform duration-300 text-white py-2 px-4 rounded-md mt-4 flex items-center gap-2 ${
            isSaving ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          {isSaving ? "Saving..." : "Save All Changes"}
          {!isSaving && <Save size={16} />}
        </button>
      </div>
    </div>
  );
};

export default TestimonialUpdate;