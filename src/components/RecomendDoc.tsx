import React, { useState } from 'react';
import { Card, Button, message } from 'antd';
import { IRecommendation } from '../interfaces/IRecommendation';
import CreateMeetingModal from '../components/CreateMeetingModal';
import AuthLocalStorage from '../AuthLocalStorage';
import { jwtDecode } from 'jwt-decode';

interface RecomendDocProps {
  data: IRecommendation | null;
}

export const RecomendDoc: React.FC<RecomendDocProps> = ({ data }) => {
  const token = AuthLocalStorage.getToken() as string;
  const user: any = jwtDecode(token);
  const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  // Move useState hook here
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleMeetingCreated = () => {
    setIsCreateModalVisible(false);
    message.success('Meeting created successfully');
  };

  if (!data) return <p>No recommendation available</p>;

  const { therapist, closestFreeDay } = data;

  return (
    <div>
      <Card
        title={`${therapist.user.firstName} ${therapist.user.lastName}`}
        bordered={false}
        style={{ width: 300 }}
      >
        <p><strong>Specialty:</strong> {therapist.speciality.name}</p>
        <p><strong>Closest Free Day:</strong> {new Date(closestFreeDay).toLocaleDateString()}</p>
        <p><strong>Phone:</strong> {therapist.user.phoneNumber || 'N/A'}</p>
        <Button type="primary" onClick={() => setIsCreateModalVisible(true)}>Book Meeting</Button>
      </Card>

      <CreateMeetingModal
        visible={isCreateModalVisible}
        onClose={() => setIsCreateModalVisible(false)}
        therapistId={therapist.userId}
        clientId={userId}
        onMeetingCreated={handleMeetingCreated}
      />
    </div>
  );
};