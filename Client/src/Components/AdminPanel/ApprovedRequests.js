import React, { useState, useEffect } from 'react';
import api from '../../api'; // Import the Axios instance
import PetCards from './PetCards';

const ApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const response = await api.get('/approved-pets');
      setRequests(response.data);
    } catch (error) {
      console.error('Error fetching approved pets:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <div className='pet-container'>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length > 0 ? (
        requests.map((request) => (
          <PetCards
            key={request.id}
            pet={request}
            updateCards={fetchRequests}
            deleteBtnText="Delete Post"
            approveBtn={false}
          />
        ))
      ) : (
        <p>No Approved Pets available</p>
      )}
    </div>
  );
};

export default ApprovedRequests;