import { useState, useEffect } from "react";
import axios from "axios";
import { BASE_URL } from "../config/url";
import upload from "../utils/upload";

interface PayoutData {
  title: string;
  subtitle: string;
  shortDescription: string;
  longDescription: string;
  buttonText: string;
  images: {
    mainImage: string;
    secondaryImage: string;
  };
}

const PayoutUpdate = () => {
  const [data, setData] = useState<PayoutData>({
    title: "Fees & Payouts",
    subtitle: "Fees",
    shortDescription: "Driven by compassion and a shared vision, we work hand-in-hand with communities to create meaningful change.",
    longDescription: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites.",
    buttonText: "Fund Now",
    images: {
      mainImage: "",
      secondaryImage: ""
    }
  });

  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState({
    mainImage: false,
    secondaryImage: false
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/payouts`);
        if (res.data) {
          // Safely merge API data with default values
          setData(res.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert("Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof data.images) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setImageUploading(prev => ({ ...prev, [type]: true }));
      
      const url = await upload(file);
      
      setData(prev => ({
        ...prev,
        images: {
          ...prev.images,
          [type]: url
        }
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed");
    } finally {
      setImageUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const sanitizedImages = {
        ...(data.images.mainImage && { mainImage: data.images.mainImage }),
        ...(data.images.secondaryImage && { secondaryImage: data.images.secondaryImage }),
      };
      
      const payload = {
        ...data,
        images: sanitizedImages,
      };
      await axios.post(`${BASE_URL}/payouts`, payload);
      alert("Changes saved successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save changes");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold mb-6">Edit Fees & Payout Section</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image */}
            <div>
              <label className="block font-medium mb-2">Main Image</label>
              <div className="flex flex-col gap-4">
                <div className="w-full max-w-[480px] rounded-[20px] overflow-hidden bg-gray-100">
                  <img 
                    src={data.images.mainImage} 
                    alt="Main" 
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.png';
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    id="mainImage"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'mainImage')}
                    className="hidden"
                  />
                  <label
                    htmlFor="mainImage"
                    className="inline-block px-4 py-2 bg-gray-900 text-white rounded hover:scale-105 transition-transform cursor-pointer"
                  >
                    {imageUploading.mainImage ? "Uploading..." : "Change Image"}
                  </label>
                </div>
              </div>
            </div>

            {/* Secondary Image */}
            <div>
              <label className="block font-medium mb-2">Secondary Image</label>
              <div className="flex flex-col gap-4">
                <div className="w-full max-w-[412px] rounded-[20px] overflow-hidden border-[15px] border-white bg-gray-100">
                  <img 
                    src={data.images.secondaryImage} 
                    alt="Secondary" 
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-image.png';
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    id="secondaryImage"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'secondaryImage')}
                    className="hidden"
                  />
                  <label
                    htmlFor="secondaryImage"
                    className="inline-block px-4 py-2 bg-gray-900 text-white rounded hover:scale-105 transition-transform cursor-pointer"
                  >
                    {imageUploading.secondaryImage ? "Uploading..." : "Change Image"}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={data.subtitle}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={data.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Short Description</label>
              <textarea
                name="shortDescription"
                value={data.shortDescription}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Long Description</label>
              <textarea
                name="longDescription"
                value={data.longDescription}
                onChange={handleInputChange}
                rows={6}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Button Text</label>
              <input
                type="text"
                name="buttonText"
                value={data.buttonText}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:scale-105 transition-trnasform duration-300"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PayoutUpdate;