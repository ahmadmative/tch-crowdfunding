"use client";
import axios from "axios";
import { BASE_URL } from "../../config/url";
import { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const WorkSection = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState<string>("");

  // Fetch existing work section data
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${BASE_URL}/work-section`);
      if (res.data && res.data.data) {
        // Handle case where data is nested in a 'data' property
        const data = res.data.data;
        setTitle(data.title || "");
        setContent(data.content || "");
        setId(data._id);
        setEdit(true);
      } else if (res.data) {
        // Handle case where data is directly in response
        setTitle(res.data.title || "");
        setContent(res.data.content || "");
        setId(res.data._id);
        setEdit(true);
      }
    } catch (err: any) {
      // Handle 404 or no data found - this is normal for first-time setup
      if (err.response?.status === 404) {
        setError(null); // Don't show error for 404, just keep in create mode
        setEdit(false);
      } else {
        setError(err.response?.data?.message || err.message || "Failed to fetch data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Submit handler for create/update
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Title and content cannot be empty.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const payload = { title: title.trim(), content };
      let response;

      if (edit && id) {
        // Update existing record
        response = await axios.put(`${BASE_URL}/work-section/${id}`, payload, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
      } else {
        // Create new record
        response = await axios.post(`${BASE_URL}/work-section`, payload, {
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        // After successful creation, switch to edit mode
        if (response.data && response.data._id) {
          setId(response.data._id);
          setEdit(true);
        } else if (response.data && response.data.data && response.data.data._id) {
          setId(response.data.data._id);
          setEdit(true);
        }
      }

      alert(`${edit ? 'Updated' : 'Created'} successfully!`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to save";
      setError(errorMessage);
      alert(`Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Work Section Management</h1>
      
      {loading && <p style={{ color: "#0070f3" }}>Loading...</p>}
      
      {error && (
        <div style={{ 
          backgroundColor: "#fee", 
          color: "red", 
          padding: "10px", 
          marginBottom: "10px",
          borderRadius: "5px",
          border: "1px solid #fcc"
        }}>
          Error: {error}
        </div>
      )}

      {/* Title Input */}
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="title" style={{ 
          display: "block", 
          marginBottom: "5px",
          fontWeight: "bold"
        }}>
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter section title"
          disabled={loading}
          style={{ 
            width: "100%", 
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>

      {/* Content Editor */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ 
          display: "block", 
          marginBottom: "5px",
          fontWeight: "bold"
        }}>
          Content *
        </label>
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent}
          readOnly={loading}
          placeholder="Enter section content..."
          style={{ height: "200px", marginBottom: "50px" }}
        />
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading || !title.trim() || !content.trim()}
        style={{
          marginTop: "15px",
          padding: "12px 24px",
          backgroundColor: loading || !title.trim() || !content.trim() ? "#ccc" : "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: loading || !title.trim() || !content.trim() ? "not-allowed" : "pointer",
          fontSize: "16px",
          fontWeight: "bold"
        }}
      >
        {loading ? "Saving..." : edit ? "Update Work Section" : "Create Work Section"}
      </button>

      
    </div>
  )
}

export default WorkSection; 