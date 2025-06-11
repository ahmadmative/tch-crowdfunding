import { useState, useEffect } from "react"
import axios from "axios"
import { BASE_URL } from "../config/url"
import upload from "../utils/upload"


interface AboutUsData {
  title: string
  subtitle: string
  description: string
  features: string[]
  stats: {
    value: string
    label: string
  }[]
  images: {
    mainImage: string
    secondaryImage: string
  }
}

const AboutUsSectionUpdate = () => {
  const [aboutData, setAboutData] = useState<AboutUsData>({
    title: "United in compassion, changing lives",
    subtitle: "ABOUT US",
    description: "Our dedication, transparency, and community-driven approach set us apart. Partnering with us, programs that create meaningful change.",
    features: [
      "community-centered approach",
      "transparency and accountability",
      "empowerment through partner",
      "volunteer and donor engagement"
    ],
    stats: [
      { value: "25+", label: "Years of experience" },
      { value: "100+", label: "Projects completed" },
      { value: "1M+", label: "Lives impacted" }
    ],
    images: {
      mainImage: "/aboutus-1.png",
      secondaryImage: "/aboutus-2.png",
    }
  })

  const [newFeature, setNewFeature] = useState("")
  const [loading, setLoading] = useState(false)
  const [imageUploading, setImageUploading] = useState({
    mainImage: false,
    secondaryImage: false,
  })


  useEffect(() => {
    const fetchAboutData = async () => {
      setLoading(true)
      try {
        const res = await axios.get(`${BASE_URL}/about-us`)
        if (res.data) {
          setAboutData(res.data)
        }
      } catch (error) {
        console.error("Failed to fetch about us data", error)
      } finally {
        setLoading(false)
      }
    }
    fetchAboutData()
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setAboutData(prev => ({ ...prev, [name]: value }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...aboutData.features]
    updatedFeatures[index] = value
    setAboutData(prev => ({ ...prev, features: updatedFeatures }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setAboutData(prev => ({
        ...prev,
        features: [...prev.features, newFeature.trim()]
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = aboutData.features.filter((_, i) => i !== index)
    setAboutData(prev => ({ ...prev, features: updatedFeatures }))
  }

  const handleStatChange = (index: number, field: 'value' | 'label', newValue: string) => {
    const updatedStats = [...aboutData.stats]
    updatedStats[index] = { ...updatedStats[index], [field]: newValue }
    setAboutData(prev => ({ ...prev, stats: updatedStats }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, imageType: keyof AboutUsData['images']) => {
    const file = e.target.files?.[0]

    if (!file) return

    try {
      setImageUploading(prev => ({ ...prev, [imageType]: true }))

      
        const url= await upload(file)
       
      
      // const imageUrl = URL.createObjectURL(file)
      setAboutData(prev => ({
        ...prev,
        images: { ...prev.images, [imageType]: url }
      }))
    } catch (error) {
      console.error(`Failed to upload ${imageType} image`, error)
    } finally {
      setImageUploading(prev => ({ ...prev, [imageType]: false }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      

      await axios.post(`${BASE_URL}/about-us`, aboutData)
      // alert("About Us section updated successfully!")
    } catch (error) {
      console.error("Failed to update about us section", error)
      alert("Failed to update about us section")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Edit About Us Section</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Images Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image */}
            <div>
              <label className="block font-medium mb-2">Main Image</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100">
                  {aboutData.images.mainImage && (
                    <img 
                      src={aboutData.images.mainImage} 
                      alt="Main" 
                      className="w-full h-full object-cover"
                    />
                  )}
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
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:scale-105 transition-transform duration-300 cursor-pointer inline-block"
                  >
                    {imageUploading.mainImage ? "Uploading..." : "Change"}
                  </label>
                </div>
              </div>
            </div>

            {/* Secondary Image */}
            <div>
              <label className="block font-medium mb-2">Secondary Image</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100 border-2 border-white">
                  {aboutData.images.secondaryImage && (
                    <img 
                      src={aboutData.images.secondaryImage} 
                      alt="Secondary" 
                      className="w-full h-full object-cover"
                    />
                  )}
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
                    className="px-4 py-2 bg-gray-900 text-white rounded hover:scale-105 trnasition-trnaform duration-300 cursor-pointer inline-block"
                  >
                    {imageUploading.secondaryImage ? "Uploading..." : "Change"}
                  </label>
                </div>
              </div>
            </div>

            
          </div>
        </div>

        {/* Text Content Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Text Content</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block font-medium mb-1">Subtitle</label>
              <input
                type="text"
                name="subtitle"
                value={aboutData.subtitle}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={aboutData.title}
                onChange={handleInputChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={aboutData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Features List</h2>
          
          <div className="grid grid-cols-1 gap-4">
            {aboutData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                  className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
                />
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="p-2 text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <input
              type="text"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="New feature text"
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
            />
            <button
              type="button"
              onClick={addFeature}
              className="px-4 py-2 bg-gray-900 text-white rounded hover:scale-105 transition-transform duration-300"
            >
              Add Feature
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Statistics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aboutData.stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div>
                  <label className="block font-medium mb-1">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(index, 'value', e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(index, 'label', e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:scale-105 transition-transform duration-300 "
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  )
}

export default AboutUsSectionUpdate