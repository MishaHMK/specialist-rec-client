import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Pagination, Typography, Badge, Empty, Button } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { IDiaryEntry } from '../interfaces/IDiaryEntry';
import DiaryApi from '../api/diaryApi';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;

export const UsersDiary: React.FC = () => {
  const { patientId, patientName } = useParams<{ patientId: string; patientName: string }>();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<IDiaryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalEntries, setTotalEntries] = useState(0);
  const [expandedEntryIds, setExpandedEntryIds] = useState<Set<number>>(new Set());

  const diaryService = new DiaryApi();

  useEffect(() => {
    if (patientId) {
      fetchDiaryEntries(patientId, currentPage, pageSize);
    }
  }, [patientId, currentPage, pageSize]);

  const fetchDiaryEntries = async (userId: string, page: number, pageSize: number) => {
    try {
      const response = await diaryService.getAllPatientEntries(userId, page, pageSize);
      setEntries(response.entries);
      setTotalEntries(response.totalCount);
    } catch (error) {
      console.error('Failed to fetch diary entries:', error);
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (patientId) {
      fetchDiaryEntries(patientId, page, pageSize || 8);
    }
  };

  const toggleDetails = (entryId: number) => {
    setExpandedEntryIds((prevExpandedIds) => {
      const newExpandedIds = new Set(prevExpandedIds);
      if (newExpandedIds.has(entryId)) {
        newExpandedIds.delete(entryId);
      } else {
        newExpandedIds.add(entryId);
      }
      return newExpandedIds;
    });
  };

  const getEmotionBadgeColor = (emotionName: string) => {
    switch (emotionName) {
      case 'Happy':
        return 'green';
      case 'Sad':
        return 'blue';
      case 'Angry':
        return 'red';
      case 'Calm':
        return 'purple';
      default:
        return 'gray';
    }
  };

  
  const severityOptions = [
    { label: 'None', value: 0 },
    { label: 'Very Low', value: 0.2 },
    { label: 'Low', value: 0.4 },
    { label: 'Medium', value: 0.6 },
    { label: 'High', value: 0.8 },
    { label: 'Very High', value: 1.0 },
  ];

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      <Button type="default" onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        Back to Patients
      </Button>
      <Card
        title={<Title level={3} style={{ margin: 0, color: '#1A73E8' }}>{patientName}'s Diary</Title>}
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginBottom: '20px' }}
      >
        {entries.length > 0 ? (
          <>
            <Row gutter={[16, 16]}>
              {entries.map((entry) => (
                <Col xs={24} sm={12} md={8} lg={6} key={entry.id}>
                  <Card
                    hoverable
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
                      height: 'auto',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                    title={
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text strong style={{ fontSize: '14px', color: '#333' }}>
                          {dayjs(entry.createdAt).format('DD MMM YYYY')}
                        </Text>
                        <Badge
                          color={getEmotionBadgeColor(entry.emotion.name)}
                          text={entry.emotion.name}
                          style={{ fontSize: '12px' }}
                        />
                      </div>
                      }
                  >
                    <Paragraph ellipsis={!expandedEntryIds.has(entry.id) ? { rows: 2 } : undefined}>
                  {entry.description}
                </Paragraph>
                {expandedEntryIds.has(entry.id) && (
                  <div>
                    <Text type="secondary">Date: {dayjs(entry.createdAt).format('YYYY-MM-DD')}</Text>
                    <br />
                    <Text type="secondary">Emotion: {entry.emotion.name}</Text>
                    <br />
                    <Text type="secondary">Severity: {entry.value === 0 ? 'None' :
                     severityOptions.find(option => option.value === entry.value)?.label}</Text>
                  </div>
                )}
                <Button
                  type="link"
                  onClick={() => toggleDetails(entry.id)}
                  style={{ padding: 0, color: '#1A73E8', fontSize: '12px', fontWeight: 'bold' }}
                >
                  {expandedEntryIds.has(entry.id) ? 'Show Less' : 'Read More'}
                </Button>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={totalEntries}
              onChange={handlePageChange}
              showSizeChanger
              style={{ textAlign: 'center', marginTop: '20px' }}
            />
          </>
        ) : (
          <Empty description="No diary entries available for this patient" />
        )}
      </Card>
    </div>
  );
};
