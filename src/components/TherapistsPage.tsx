import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Avatar, Divider, message, Button, Input, Pagination, Select, Modal, Form, DatePicker} from 'antd';
import TherapistApi from '../api/therapistApi';
import {ITherapist} from '../interfaces/ITherapist';
import MeetingApi from '../api/meetingApi';
import AuthLocalStorage from '../AuthLocalStorage';
import { jwtDecode } from 'jwt-decode';

const { Title, Text } = Typography;
const { Option } = Select;

export const TherapistsPage: React.FC = () => {
  const [therapists, setTherapists] = useState<ITherapist[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [totalTherapists, setTotalTherapists] = useState(0);
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [therapistId, setTherapistId] = useState<string>('');
  const [form] = Form.useForm();

  const token = AuthLocalStorage.getToken() as string;
  const user: any = jwtDecode(token);
  const userId = user["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];

  const meetingService = new MeetingApi();

  useEffect(() => {
    fetchTherapists(currentPage, pageSize, specializationFilter);
    fetchSpecializations();
  }, [currentPage, pageSize, specializationFilter]);

  const therapistSevice = new TherapistApi();

  const handleActionClick = async (values: { id: string; title: string; url: string; date: any; isOnline: boolean }) => {
    try {
        const newMeeting = {
            title: values.title,
            url: values.url,
            startDate: values.date.format('YYYY-MM-DDTHH:mm:ss'),
            isOnline: values.isOnline,
            clientId: userId,
            therapistId: therapistId
        };
        await meetingService.createMeeting(newMeeting); 
        message.success('Meeting created successfully!');
        setIsCreateModalVisible(false);
        form.resetFields();
    } catch (error) {
        message.error('Failed to create meeting');
    }
    console.log(therapistId);
  };

  const handleModal = (id: string) => {
    setIsCreateModalVisible(true);
    setTherapistId(id);
  };

  const fetchTherapists = async (page: number, pageSize: number, specialization: string) => {
    try {
      const data = await therapistSevice.getTherapists(page, pageSize, specialization);
      setTherapists(data.therapists); 
      setTotalTherapists(data.total);
    } catch (error) {
      console.error("Error loading therapists:", error);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const data = await TherapistApi.getSpecializations();
      setSpecializations(data);
    } catch (error) {
      console.error("Failed to fetch specializations:", error);
    }
  };

  const handlePageChange = (page: number, pageSize?: number) => {
    setCurrentPage(page);
    if (pageSize) setPageSize(pageSize);
  };

  const handleSpecializationChange = (value: string) => {
    setSpecializationFilter(value);
    setCurrentPage(1); // Reset to first page on filter change
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
      case 'Counseling':
        return '#6A5ACD';
      default:
        return '#CCCCCC';
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      <Title level={2} style={{ textAlign: 'center', color: '#1A73E8' }}>Meet Our Therapists</Title>
      <Divider />

      <Row gutter={[16, 16]} justify="space-between" style={{ marginBottom: '20px' }}>
        <Col>
          <Select
            placeholder="Filter by Specialization"
            onChange={handleSpecializationChange}
            allowClear
            style={{ width: '200px' }}
          >
            <Option value="">All Specializations</Option>
            {specializations.map(spec => (
              <Option key={spec} value={spec}>{spec}</Option>
            ))}
          </Select>
        </Col>
        <Col>
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={totalTherapists}
            onChange={handlePageChange}
            showSizeChanger
            style={{ textAlign: 'center' }}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="center">
        {therapists.map(therapist => (
          <Col xs={24} sm={12} md={8} lg={6} key={therapist.id}>
            <Card
              style={{
                textAlign: 'center',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden'
              }}
              hoverable
            >
              <Avatar size={64} style={{ backgroundColor: getAvatarColor(therapist.specialityName), marginBottom: '10px' }}>
                {therapist.firstName[0]}{therapist.lastName[0]}
              </Avatar>
              <Title level={4}>{therapist.firstName} {therapist.lastName}</Title>
              <Text strong style={{ color: '#1A73E8' }}>{therapist.specialityName || "Speciality Not Available"}</Text>
              <p style={{ marginTop: '10px', color: '#595959' }}>
                {therapist.introduction ? (
                  <Text>{therapist.introduction}</Text>
                ) : "Introduction not provided."}
              </p>
              <Button 
                type="primary" 
                style={{ marginTop: '10px', width: '100%' }} 
                onClick={() => handleModal(therapist.id)}
              >
                Appointments
              </Button> 
            </Card>
          </Col>
        ))}
      </Row>
      <Modal
                title="Create New Meeting"
                visible={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleActionClick} layout="vertical">
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: 'Please enter a title' }]}
                    >
                        <Input placeholder="Enter meeting title" />
                    </Form.Item>
                    <Form.Item
                        label="Date & Time"
                        name="date"
                        rules={[{ required: true, message: 'Please select a date and time' }]}
                    >
                        <DatePicker showTime style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                        label="Is Online?"
                        name="isOnline"
                        rules={[{ required: true, message: 'Please select meeting type' }]}
                    >
                        <Select placeholder="Select type">
                            <Option value={true}>Online</Option>
                            <Option value={false}>Offline</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="URL (for online meetings)"
                        name="url"
                        rules={[{ required: false }]}
                    >
                        <Input placeholder="Enter meeting URL" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                            Create Meeting
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
    </div>
  );
};
