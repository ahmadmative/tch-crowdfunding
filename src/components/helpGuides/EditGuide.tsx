"use client";

import React, { useState, ChangeEvent, useEffect } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageUploader from "quill-image-uploader";
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from "../../config/url";
import upload, { uploadMedia } from "../../utils/upload";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

Quill.register("modules/imageUploader", ImageUploader);

const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
    ["link", "image"],
    ["clean"],
  ],
  imageUploader: {
    upload: (file: File) => {
      toast.info("Uploading Image");
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);

        fetch("https://api.imgbb.com/1/upload?key=055aee72cc2132ca184d425fba12b72a", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then((data) => resolve(data.data.url))
          .catch(() => reject("Upload failed"));
      });
    },
  },
};

const formats = [
  "header", "bold", "italic", "underline", "strike", "blockquote",
  "list", "indent", "link", "image"
];

const EditGuide: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [category, setCategory] = useState("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/guide-category?active=true`);
      setCategories(res.data);
    } catch {
      toast.error("Failed to fetch categories");
    }
  };

  const fetchGuide = async (id: string) => {
    try {
      const res = await axios.get(`${BASE_URL}/guide/${id}`);
      const guide = res.data;
      setTitle(guide.title);
      setDescription(guide.description);
      setContent(guide.content);
      setCoverImage(guide.image); // corrected key name
      setCategory(guide.category); // since category is a string ID
      setVideoUrl(guide.videoUrl);
    } catch (error) {
      toast.error("Failed to fetch guide");
    }
  };

  useEffect(() => {
    if (id) {
      fetchGuide(id);
      fetchCategories();
    }
  }, [id]);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("No file selected!");
    toast.info("Uploading cover image...");
    const url = await upload(file);
    setCoverImage(url);
    toast.success("Cover image uploaded!");
  };

  const handleVideoChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setVideoFile(file);
    setVideoProgress(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let videoLink = videoUrl;
      if (videoFile) {
        toast.info("Uploading video...");
        const uploadRes = await uploadMedia(videoFile, setVideoProgress);
        // @ts-ignore
        videoLink = uploadRes.url;
        toast.success("Video uploaded!");
      }

      if (!coverImage) {
        toast.error("Please upload a cover image!");
        setIsSubmitting(false);
        return;
      }

      const formData = {
        title,
        image: coverImage,
        description,
        content,
        category,
        videoUrl: videoLink,
      };

      await axios.patch(`${BASE_URL}/guide/${id}`, formData);
      toast.success("Guide updated successfully!");
    } catch {
      toast.error("Error updating guide. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-2 min-h-screen">
      <Link
        to="/guide"
        className="flex items-center justify-center mb-2 gap-2 hover:bg-gray-200 w-[50px] h-[50px] rounded-full"
      >
        <ArrowLeft className="w-6 h-6" />
      </Link>
      <ToastContainer />
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Blog Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Cover Image</label>
            <input type="file" accept="image/*" className="hidden" id="cover-image" onChange={handleImageUpload} />
            <div className="flex items-center gap-4">
              <label htmlFor="cover-image" className="px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700">
                {coverImage ? "Change Cover Image" : "Upload Cover Image"}
              </label>
              {coverImage && <img src={coverImage} alt="Preview" className="max-w-xs h-32 object-cover rounded-md" />}
            </div>
          </div>

          {/* Video Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Video Upload</label>
            <input type="file" accept="video/*" onChange={handleVideoChange} />
            {videoProgress > 0 && (
              <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
                <div className="bg-blue-500 h-4 transition-all" style={{ width: `${videoProgress}%` }}></div>
              </div>
            )}
            {videoUrl && !videoFile && (
              <video controls className="mt-2 w-full max-w-md rounded-md">
                <source src={videoUrl} type="video/mp4" />
              </video>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full px-4 py-2 border border-gray-300 rounded-md" />
          </div>

          {/* Content */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <ReactQuill value={content} onChange={setContent} modules={modules} formats={formats} className="h-96" />
          </div>

          <div className="flex justify-end pt-10">
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
              {isSubmitting ? "Publishing..." : "Update Blog"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditGuide;
