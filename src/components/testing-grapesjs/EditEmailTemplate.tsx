// [unchanged imports]
import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// @ts-ignore
import ImageUploader from "quill-image-uploader";
// @ts-ignore
import ImageResize from "quill-image-resize-module-react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config/url";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// Register Quill modules
Quill.register("modules/imageUploader", ImageUploader);
Quill.register("modules/imageResize", ImageResize);

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
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize"],
  },
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

const options: Record<string, string[]> = {
  "OTP Code Email": ["{{otp_code}}"],
  "Campaign Creation Email": ["{{campaigner_name}}", "{{amount}}", "{{starting_date}}"],
  "Donation Receipt to Donors": ["{{donor_name}}", "{{amount}}"],
  "Donation Receipt to Campaigner": ["{{campaigner_name}}", "{{amount}}"],
  "Campaign Status Update to Campaigner": ["{{campaigner_name}}", "{{campaign_title}}", "{{status}}"],
  "To Campaigner on Campaign Completion": ["{{campaigner_name}}", "{{campaign_title}}"],
  "Money WithDrawal Request Accept Email": ["{{name}}", "{{amount}}"],
};

const EditEmailTemplateEditor = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const quillRef = useRef<ReactQuill | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/template/${id}`);
        setTitle(res.data.name);
        setDescription(res.data.subject);
        setContent(res.data.body);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.patch(`${BASE_URL}/template/${id}`, {
        name: title,
        subject: description,
        body: content,
      });
      toast.success("Email template updated successfully!");
    } catch (error) {
      toast.error("Error updating template. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const insertAtCursor = (variable: string) => {
    const editor = quillRef.current?.getEditor();
    if (editor) {
      const range = editor.getSelection(true);
      if (range) {
        editor.insertText(range.index, variable, "user");
        editor.setSelection({
          index: range.index + variable.length,
          length: 0,
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  return (
    <div className="w-full px-4 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
        <Link
          to="/notifications"
          className="flex w-[40px] h-[40px] items-center justify-center hover:bg-gray-200 rounded-full  mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Update Email Template
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <select
              value={title}
              disabled
              className="w-full p-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="">Select an event</option>
              {Object.keys(options).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
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

          {title && options[title] && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Insert Variable
              </label>
              <div className="flex flex-wrap gap-2">
                {options[title].map((variable) => (
                  <button
                    key={variable}
                    type="button"
                    onClick={() => insertAtCursor(variable)}
                    className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <ReactQuill
              ref={quillRef}
              value={content}
              onChange={setContent}
              className="h-96"
              theme="snow"
              placeholder="Write your content here..."
              modules={modules}
              formats={formats}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 mt-[90px] py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Publishing..." : "Update Email Template"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEmailTemplateEditor;
