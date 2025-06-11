import type React from "react"
import { useState, useEffect } from "react"
import { Trash2, Plus, Save, X, AlertCircle, CheckCircle } from "lucide-react"
import axios from "axios"
import { BASE_URL } from "../config/url"
import upload from "../utils/upload"

// Simple Notification component
interface NotificationProps {
  isOpen: boolean
  onClose: () => void
  title: string
  message: string
}

const Notification: React.FC<NotificationProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null

  const isSuccess = title.toLowerCase().includes("success")

  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div className={`rounded-lg shadow-lg p-4 ${isSuccess ? "bg-green-50" : "bg-red-50"}`}>
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isSuccess ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div className="ml-3 w-0 flex-1">
            <p className={`text-sm font-medium ${isSuccess ? "text-green-800" : "text-red-800"}`}>{title}</p>
            <p className={`mt-1 text-sm ${isSuccess ? "text-green-700" : "text-red-700"}`}>{message}</p>
          </div>
          <div className="ml-4 flex-shrink-0 flex">
            <button
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${isSuccess
                  ? "text-green-500 hover:bg-green-100 focus:ring-green-400"
                  : "text-red-500 hover:bg-red-100 focus:ring-red-400"
                }`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface FeatureCard {
  _id?: string
  image: string
  stats: string
  title: string
  description: string
  image2: string
}

interface HeaderContent {
  title: string
  subtitle: string
  description: string
}

const FeatureSectionUpdate: React.FC = () => {
  // Default feature cards data
  const defaultFeatureCards: FeatureCard[] = [
    {
      _id: "1",
      image: "/campaign-card.png",
      stats: "96%",
      title: "Healthcare Support",
      description: "Providing essential healthcare services to underserved communities.",
      image2: "/hand-heart.png",
    },
    {
      _id: "2",
      image: "/campaign-card.png",
      stats: "94%",
      title: "Education Support",
      description: "Helping children access quality education and learning resources.",
      image2: "/money.png",
    },
    {
      _id: "3",
      image: "/campaign-card.png",
      stats: "95%",
      title: "Food Support",
      description: "Delivering nutritious meals to families in need across regions.",
      image2: "/bag.png",
    },
  ]

  const defaultHeaderContent: HeaderContent = {
    title: "Highlights our impactful work",
    subtitle: "OUR FEATURES",
    description:
      "Discover the positive change we've created through our programs, partnerships, and dedicated efforts. From healthcare and education to environmental sustainability.",
  }

  const [featureCards, setFeatureCards] = useState<FeatureCard[]>([])
  const [headerContent, setHeaderContent] = useState<HeaderContent>(defaultHeaderContent)
  const [isLoading, setIsLoading] = useState(true)
  const [notification, setNotification] = useState({
    isOpen: false,
    title: "",
    message: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [editedHeaderContent, setEditedHeaderContent] = useState<HeaderContent>(defaultHeaderContent)
  const [editedFeatureCards, setEditedFeatureCards] = useState<FeatureCard[]>([])
  const [hasChanges, setHasChanges] = useState(false)
  const [image1Loading, setImage1Loading] =useState(false);
  const [image2Loading, setImage2Loading] = useState(false);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/features`)
        if (res.data) {
          setHeaderContent(res.data)
          setFeatureCards(res.data.features)
        }
        console.log("features from api", res.data.features)

      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()

  }, [])

  const showNotification = (title: string, message: string) => {
    setNotification({ isOpen: true, title, message })
    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isOpen: false }))
    }, 5000)
  }

  const closeNotification = () => {
    setNotification({ isOpen: false, title: "", message: "" })
  }

  const handleStartEditing = () => {
    setIsEditing(true)
    setEditedHeaderContent({ ...headerContent })
    setEditedFeatureCards(JSON.parse(JSON.stringify(featureCards)))
  }

  const handleCancelEditing = () => {
    setIsEditing(false)
    setEditedHeaderContent({ ...headerContent })
    setEditedFeatureCards(JSON.parse(JSON.stringify(featureCards)))
    setHasChanges(false)
  }

  const handleHeaderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setEditedHeaderContent((prev) => ({ ...prev, [name]: value }))
    setHasChanges(true)
  }

  const handleFeatureCardChange = (index: number, field: keyof FeatureCard, value: string) => {
    const updatedCards = [...editedFeatureCards]
    updatedCards[index] = { ...updatedCards[index], [field]: value }
    setEditedFeatureCards(updatedCards)
    setHasChanges(true)
  }

  const handleAddFeatureCard = () => {
    const newId = `new-${Date.now()}`
    const newCard: FeatureCard = {
      _id: newId,
      image: "/campaign-card.png",
      stats: "0%",
      title: "New Feature",
      description: "Description for the new feature",
      image2: "/bag.png",
    }
    setEditedFeatureCards([...editedFeatureCards, newCard])
    setHasChanges(true)
  }

  const handleDeleteFeatureCard = (index: number) => {
    const updatedCards = [...editedFeatureCards]
    updatedCards.splice(index, 1)
    setEditedFeatureCards(updatedCards)
    setHasChanges(true)
  }



  const handleSaveChanges = async () => {

    setIsLoading(true)

    console.log("Changes saved:", {
      title: editedHeaderContent.title,
      subTitle: editedHeaderContent.subtitle,
      description: editedHeaderContent.description,
      features: editedFeatureCards,
    })

    const res = await axios.post(`${BASE_URL}/features`, {
      title: editedHeaderContent.title,
      subTitle: editedHeaderContent.subtitle,
      description: editedHeaderContent.description,
      features: editedFeatureCards,
    })

    window.location.reload()

    setIsEditing(false)
    setHasChanges(false)
    setIsLoading(false)
    showNotification("Success", "All changes saved successfully")

  }

  if (isLoading) return (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
  )

  return (
    <div className="max-w-[1200px] mx-auto py-8 px-4">
      <Notification
        isOpen={notification.isOpen}
        onClose={closeNotification}
        title={notification.title}
        message={notification.message}
      />

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Feature Section Management</h1>
          {!isEditing ? (
            <button
              onClick={handleStartEditing}
              className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:scale-105 transition-tranform duration-300"
            >
              Edit Content
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancelEditing}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveChanges}
                disabled={!hasChanges}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${hasChanges
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
              >
                <Save size={16} />
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Header Content Section */}
        <div className="mb-8 bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Header Content</h2>
          <div className="grid gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
              {isEditing ? (
                <input
                  type="text"
                  name="subtitle"
                  value={editedHeaderContent.subtitle}
                  onChange={handleHeaderChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              ) : (
                <p className="p-2 bg-white border border-gray-200 rounded-md">{headerContent.subtitle}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  name="title"
                  value={editedHeaderContent.title}
                  onChange={handleHeaderChange}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              ) : (
                <p className="p-2 bg-white border border-gray-200 rounded-md">{headerContent.title}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              {isEditing ? (
                <textarea
                  name="description"
                  value={editedHeaderContent.description}
                  onChange={handleHeaderChange}
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                />
              ) : (
                <p className="p-2 bg-white border border-gray-200 rounded-md">{headerContent.description}</p>
              )}
            </div>
          </div>
        </div>

        {/* Feature Cards Table */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Feature Cards</h2>
            {isEditing && (
              <button
                onClick={handleAddFeatureCard}
                className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform duration-300"
              >
                <Plus size={16} />
                Add New Feature
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Image Path
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Stats
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Description
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Icon Path
                  </th>
                  {isEditing && (
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {(isEditing ? editedFeatureCards : featureCards).map((card, index) => (
                  <tr key={card._id || index}>
                    <td className="px-6 py-4 whitespace-nowrap">
  {isEditing ? (
    <div className="flex flex-col gap-2">
      <img src={editedFeatureCards[index].image} alt="feature" className="h-16 w-16 object-cover rounded-md" />
      {image1Loading && <p>Loading...</p>}
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) {
            setImage1Loading(true)
            const uploadedUrl = await upload(file)
            setImage1Loading(false)
            handleFeatureCardChange(index, "image", uploadedUrl)
          }
        }}
      />
    </div>
  ) : (
    <img src={card.image} alt="feature" className="h-16 w-16 object-cover rounded-md" />
  )}
</td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedFeatureCards[index].stats}
                          onChange={(e) => handleFeatureCardChange(index, "stats", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                      ) : (
                        card.stats
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editedFeatureCards[index].title}
                          onChange={(e) => handleFeatureCardChange(index, "title", e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                      ) : (
                        card.title
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {isEditing ? (
                        <textarea
                          value={editedFeatureCards[index].description}
                          onChange={(e) => handleFeatureCardChange(index, "description", e.target.value)}
                          rows={2}
                          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                        />
                      ) : (
                        card.description
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
  {isEditing ? (
    <div className="flex flex-col gap-2">
      <img src={editedFeatureCards[index].image2} alt="feature" className="h-16 w-16 object-cover rounded-md" />
      {image2Loading && <p>Loading...</p>}
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0]
          if (file) {
            setImage2Loading(true)
            const uploadedUrl = await upload(file)
            setImage2Loading(false)
            handleFeatureCardChange(index, "image2", uploadedUrl)

          }
        }}
      />
    </div>
  ) : (
    <img src={card.image2} alt="feature" className="h-16 w-16 object-cover rounded-md" />
  )}
</td>

                    {isEditing && (
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleDeleteFeatureCard(index)}
                          className="text-red-600 hover:text-red-900 ml-4"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Changes Button (Bottom) */}
        {isEditing && hasChanges && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveChanges}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:scale-105 duration-300 transition-transform"
            >
              <Save size={18} />
              Save All Changes
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeatureSectionUpdate
