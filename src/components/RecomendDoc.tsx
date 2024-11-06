import React from 'react';
import { Card, Button } from 'antd';

interface RecomendTipsProps {
  data: {
    id: number;
    introduction: string;
    specialityId: number;
    speciality: {
      id: number;
      name: string;
      value: number;
    };
    userId: string;
    user: {
      firstName: string;
      lastName: string;
      phoneNumber: string | null;
      id: string;
    };
  }[];
}

export const RecomendDoc: React.FC<RecomendTipsProps> = ({ data }) => {
  if (!data || data.length === 0) return <p>No recommendations available</p>;

  return (
    <div style={{ display: 'flex', overflowX: 'auto', gap: '20px', padding: '10px' }}>
      {data.map((recommendation) => (
        <Card
          key={recommendation.id}
          title={`${recommendation.user.firstName} ${recommendation.user.lastName}`}
          bordered={false}
          style={{ width: 300 }}
        >
          <p><strong>Specialty:</strong> {recommendation.speciality.name}</p>
          <p><strong>Phone:</strong> {recommendation.user.phoneNumber || 'N/A'}</p>
          <Button type="primary">Meeting</Button>
        </Card>
      ))}
    </div>
  );
};