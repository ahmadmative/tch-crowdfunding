import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// @ts-ignore
import ImageUploader from "quill-image-uploader";
// @ts-ignore
import ImageResize from "quill-image-resize-module-react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config/url";

// Register modules
Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/imageResize", ImageResize);

// Toolbar configurations
const modules = {
  toolbar: [
    [{ header: [1, 2, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link", "image"],
    ["clean"],
    ["align"],
  ],
  imageUploader: {
    upload: (file: any) => {
      toast.info("Uploading Image");
      return new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append("image", file);

        fetch(
          "https://api.imgbb.com/1/upload?key=055aee72cc2132ca184d425fba12b72a",
          {
            method: "POST",
            body: formData,
          }
        )
          .then((response) => response.json())
          .then((result) => resolve(result.data.url))
          .catch(() => reject("Upload failed"));
      });
    },
  },
  imageResize: {
    parchment: Quill.import('parchment'),
    modules: ['Resize', 'DisplaySize']
  }
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "indent",
  "link",
  "image",
  "align",
];

const EmailTemplateEditor = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContentChange = (value: string) => setContent(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      name: title,
      subject: description,
      body: content,
    };

    try {
      const response = await axios.post(`${BASE_URL}/template/create`, formData);
      console.log(response.data);
      toast.success("Email template sent successfully!");
      setTitle("");
      setDescription("");
      setContent("");
    } catch (error: any) {
      toast.error("Error, please try again.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full px-4 py-28 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Write New Email Template
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title (Dropdown) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <select
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Select an event</option>
              <option value="Donation Receipt to Donors">Donation Receipt to Donors</option>
              <option value="Donation Receipt to Campaigner">Donation Receipt to Campaigner</option>
              <option value="Campaign Status Update to Campaigner">Campaign Status Update to Campaigner by Admin</option>
              {/* <option value="To Admin on New Campaign Creation">To Admin on New Campaign Creation</option> */}
              <option value="To Campaigner on Campaign Completion">To Campaigner on Campaign Completion</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Subject
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
              placeholder="Enter Subject"
            />
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="bg-white rounded-md">
              <ReactQuill
                value={content}
                onChange={handleContentChange}
                className="h-96"
                theme="snow"
                placeholder="Write your content here..."
                modules={modules}
                formats={formats}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 mt-[90px] py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Publishing..." : "Publish Email Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmailTemplateEditor;