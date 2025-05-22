import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BASE_URL } from '../../config/url';
import { toast } from 'react-toastify';
import CampaignCard from '../Campaigns/CampaignCard';

const OrganizationCampaigns = () => {
  const { id } = useParams();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/campaigns/organisation/${id}`);
      setData(res.data);
    } catch (error) {
      toast.error('Error fetching campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  if (loading) return <p className="text-center mt-10 text-lg">Loading campaigns...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Campaigns</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {data.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>
    </div>
  );
};

export default OrganizationCampaigns;
