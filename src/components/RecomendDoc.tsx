import React, { useState } from 'react';
import { Card, Button, message, Avatar } from 'antd';
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

  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);

  const handleMeetingCreated = () => {
    setIsCreateModalVisible(false);
  };

  const getAvatarColor = (specialityName: string | null) => {
    switch (specialityName) {
      case 'Addiction Treatment':
        return '#FF6347';
      case 'Trauma Therapy':
        return '#4682B4';
      case 'Child Therapy':
        return '#32CD32';
      case 'Family Therapy':
        return '#FFD700';
      case 'Cognitive Therapy':
        return '#6A5ACD';
      default:
        return '#CCCCCC';
    }
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
        <Avatar size={64} style={{ backgroundColor: getAvatarColor(therapist.speciality.name), marginBottom: '10px' }}>
                {therapist.user.firstName[0]}{therapist.user.lastName[0]}
        </Avatar>
        <br></br>
        <p><strong>Specialty:</strong> {therapist.speciality.name}</p>
        <p><strong>Closest Free Day:</strong> {new Date(closestFreeDay).toLocaleDateString()}</p>
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