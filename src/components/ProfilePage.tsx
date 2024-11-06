import React, { useEffect, useState } from 'react';
import { Card, Typography, Divider, Tag, message } from 'antd';
import UserApi from '../api/userApi';

const { Title, Text } = Typography;

interface IUserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  therapistInfo?: {
    introduction: string | null;
    specialityName: string | null;
  };
}

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const profileService = new UserApi();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await profileService.getUserProfile();
      setProfile(response.data);
    } catch (error) {
      message.error('Failed to load profile data.');
      console.error('Profile data error:', error);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto', backgroundColor: '#f0f2f5' }}>
      {profile ? (
        <Card style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
          <Title level={2} style={{ color: '#1A73E8' }}>Profile</Title>
          <Divider />
          <Text strong>First Name: </Text> <Text>{profile.firstName}</Text><br />
          <Text strong>Last Name: </Text> <Text>{profile.lastName}</Text><br />
          <Text strong>Email: </Text> <Text>{profile.email}</Text><br />
          <Text strong>Role: </Text> <Tag color="blue">{profile.role}</Tag>
          
          {profile.role === 'Therapist' && profile.therapistInfo && (
            <>
              <Divider />
              <Title level={4} style={{ color: '#1A73E8' }}>Therapist Details</Title>
              <Text strong>Specialization: </Text> <Text>{profile.therapistInfo.specialityName || 'Not specified'}</Text><br />
              <Text strong>Introduction: </Text>
              <Text>
                {profile.therapistInfo.introduction || 'No introduction provided.'}
              </Text>
            </>
          )}
        </Card>
      ) : (
        <Text>Loading profile data...</Text>
      )}
    </div>
  );
};