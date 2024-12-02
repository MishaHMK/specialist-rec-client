import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Divider, Pagination, message, Button, Empty } from 'antd';
import { useNavigate } from 'react-router-dom';
import DiaryApi from '../api/diaryApi';
import { IPatient } from '../interfaces/IPatient'; // Ensure this interface includes the required fields

const { Title, Text } = Typography;

export const PatientsPage: React.FC = () => {
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalPatients, setTotalPatients] = useState(0);
  const navigate = useNavigate();

  const diaryApi = new DiaryApi();

  useEffect(() => {
    fetchPatients(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchPatients = async (page: number, pageSize: number) => {
    try {
      const data = await diaryApi.getAllPatients(page, pageSize);
      setPatients(data.patients);
      setTotalPatients(data.totalCount);
    } catch (error) {
      message.error('Failed to load patients.');
      console.error('Error loading patients:', error);
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const goToDiary = (patientId: string, patientName: string) => {
    navigate(`/diary/${patientId}/${patientName}`);
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#1A73E8' }}>Your Patients</Title>
      <Divider />

      <Row gutter={[16, 16]} justify="center">
        {patients.length > 0 ? (
          patients.map(patient => (
            <Col xs={24} sm={12} md={8} lg={6} key={patient.id}>
              <Card
                style={{
                  textAlign: 'center',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                  overflow: 'hidden',
                }}
                hoverable
              >
                <Avatar size={64} style={{ backgroundColor: '#1A73E8', marginBottom: '10px' }}>
                  {patient.firstName[0]}{patient.lastName[0]}
                </Avatar>
                <Title level={4}>
                  {patient.firstName} {patient.lastName} {patient.fatherName && ` ${patient.fatherName}`}
                </Title>

                <p style={{ marginTop: '10px', color: '#595959' }}>
                  {patient.description || "No additional information provided."}
                </p>
                <Button 
                  type="primary" 
                  style={{ marginTop: '10px', width: '100%' }}
                  onClick={() => goToDiary(patient.id, `${patient.firstName} ${patient.lastName}`)}
                >
                  View Diary
                </Button>
              </Card>
            </Col>
          ))
        ) : (
          <Empty description="No patients found." style={{ marginTop: '50px' }} />
        )}
      </Row>

      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={totalPatients}
        onChange={handlePageChange}
        showSizeChanger
        style={{ textAlign: 'center', marginTop: '20px' }}
      />
    </div>
  );
};
