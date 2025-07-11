import React, { useState, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
// @ts-ignore
import ImageUploader from "quill-image-uploader";
// @ts-ignore
import ImageResize from "quill-image-resize-module-react";
import axios from "axios";
import { toast } from "react-toastify";
import { BASE_URL } from "../../config/url";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

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
  "Welcome Email": ["{{name}}"],
  "OTP Code Email": ["{{otp_code}}"],
  "Password Reset": ["{{name}}", "{{otp_code}}"],
  // "Campaign Creation Email": ["{{campaigner_name}}", "{{amount}}", "{{starting_date}}"],
  "Donation Receipt (Donor)": ["{{donor_name}}", "{{amount}}", "{{campaign_name}}"],
  "New Donation Alert (Campaign Owner)": ["{{campaigner_name}}", "{{amount}}", "{{campaign_name}}", "{{donor_name}}"],
  // "Campaign Status Update to Campaigner": ["{{campaigner_name}}", "{{campaign_title}}", "{{status}}"],
  "Campaign Completion": ["{{campaigner_name}}", "{{campaign_title}}", "{{amount}}", "{{total_donors}}", "{{start_date}}", "{{end_date}}"],
  "Campaign Rejection": ["{{campaigner_name}}", "{{campaign_title}}", "{{reasons}}"],
  "Campaign Approval" : ["{{campaigner_name}}", "{{campaign_title}}"],
  
  "Organisation Registration Approved": ["{{organization_admin_name}}", "{{organization_name}}"],
  "Organisation Verification Required": ["{{organization_admin_name}}", "{{organization_name}}"],
  "Automatic Certificate Issuance (Donor)": ["{{donor_name}}", "{{organization_name}}", "{{amount}}"],
  "Monthly Summary Certificate": ["{{donor_name}}"],

  "Money WithDrawal Request Email": ["{{admin_name}}", "{{amount}}"],
};

const EmailTemplateEditor = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quillRef = useRef<any>(null);

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
      const response = await axios.post(
        `${BASE_URL}/template/create`,
        formData
      );
      console.log(response.data);
      toast.success("Email template sent successfully!");
      setTitle("");
      setDescription("");
      setContent("");
    } catch (error: any) {
      toast.error("Error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Insert selected code at current cursor position
  const insertCode = (code: string) => {
    const editor = quillRef.current?.getEditor();
    const range = editor?.getSelection();
    if (range) {
      editor.insertText(range.index, code);
    }
  };

  return (
    <div className="w-full px-4 min-h-screen">
      <div className="max-w-6xl  mx-auto bg-white rounded-lg shadow-md p-6">
        <Link
          to="/notifications"
          className="flex items-center w-[40px] h-[40px]  justify-center hover:bg-gray-200 rounded-full mb-4"
        >
          <ArrowLeft className="w-6 h-6" />
        </Link>

        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Write New Email Template
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title Dropdown */}
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
              {Object.keys(options).map((key) => (
                <option key={key} value={key}>
                  {key}
                </option>
              ))}
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

          {/* Code Buttons */}
          {title && options[title]?.length > 0 && (
            <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-md">
              <span className="text-sm font-medium text-gray-700">
                Available Codes:
              </span>
              {options[title].map((code) => (
                <button
                  type="button"
                  key={code}
                  onClick={() => insertCode(code)}
                  className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition"
                >
                  {code}
                </button>
              ))}
            </div>
          )}

          {/* Quill Editor */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Content
            </label>
            <div className="bg-white rounded-md">
              <ReactQuill
                ref={quillRef}
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

          {/* Submit */}
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
