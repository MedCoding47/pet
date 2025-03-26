import React, { useState } from 'react';
import PostingPets from './PostingPets';
import AdoptingRequests from './AdoptingRequests';
import AdoptedHistory from './AdoptedHistory';
import ApprovedRequests from './ApprovedRequests';
import PostPetSection from '../Services/PostPetSection'; // Import the PostPetSection component

const AdminScreen = () => {
  const [screen, setScreen] = useState('postingPet');

  return (
    <div className='admin-screen-container'>
      <div className='admin-screen-left'>
        <div>
          <p onClick={() => setScreen('postingPet')}>Post Pet Requests</p>
          <p onClick={() => setScreen('approvedRequests')}>Approved Pets</p>
          <p onClick={() => setScreen('adoptingPet')}>Adoption Requests</p>
          <p onClick={() => setScreen('adoptedHistory')}>Adopted History</p>
          <p onClick={() => setScreen('postPet')}>Post a Pet</p> {/* Add this line */}
        </div>
      </div>
      <div className='admin-screen-right'>
        {screen === 'postingPet' && <PostingPets />}
        {screen === 'approvedRequests' && <ApprovedRequests />}
        {screen === 'adoptingPet' && <AdoptingRequests />}
        {screen === 'adoptedHistory' && <AdoptedHistory />}
        {screen === 'postPet' && <PostPetSection />} {/* Add this line */}
      </div>
    </div>
  );
};

export default AdminScreen;