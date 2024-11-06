import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button, Pagination, Typography, Badge, Modal, Form, Input, Select, message, Empty } from 'antd';
import AuthLocalStorage from '../AuthLocalStorage';
import { IDiaryEntry } from '../interfaces/IDiaryEntry';
import DiaryApi from '../api/diaryApi';
import { IEmotion } from '../interfaces/IEmotion';
import dayjs from 'dayjs';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export const DiaryPage: React.FC = () => {
  const [entries, setEntries] = useState<IDiaryEntry[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [totalEntries, setTotalEntries] = useState(0);
  const [expandedEntryIds, setExpandedEntryIds] = useState<Set<number>>(new Set());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [emotions, setEmotions] = useState<IEmotion[]>([]);
  const [diaryId, setDiaryId] = useState<number | null>(null);
  const [diaryExists, setDiaryExists] = useState<boolean>(true); 

  const diaryService = new DiaryApi();

  useEffect(() => {
    checkDiaryExistence();
    fetchEmotions();
  }, []);

  const checkDiaryExistence = async () => {
    try {
      const response = await diaryService.getDiaryId();
      if (response.data) {
        setDiaryId(response.data);
        setDiaryExists(true);
        fetchDiaryEntries(response.data, currentPage, pageSize);
      } else {
        setDiaryExists(false);
      }
    } catch (error) {
      console.error('Failed to check diary existence:', error);
    }
  };

  const fetchDiaryEntries = async (id: number, page: number, pageSize: number) => {
    try {
      const response = await diaryService.getAllEntries(id, page, pageSize);
      setEntries(response.entries);
      setTotalEntries(response.totalCount);
    } catch (error) {
      console.error('Failed to fetch diary entries:', error);
    }
  };

  const fetchEmotions = async () => {
    try {
      const response = await diaryService.getAllEmotions();
      setEmotions(response.data);
    } catch (error) {
      console.error('Failed to fetch emotions:', error);
    }
  };

  const handleCreateDiary = async () => {
    try {
      await diaryService.createDiary(); 
      message.success('Diary created successfully!');
      setDiaryExists(true);
      checkDiaryExistence(); 
    } catch (error) {
      message.error('Failed to create diary');
      console.error(error);
    }
  };

  const handleAddEntry = async (values: { description: string; emotionId: number; value: number }) => {
    try {
      await diaryService.addEntry(values.description, values.emotionId, values.value);
      message.success('Entry added successfully!');
      setIsModalVisible(false);
      form.resetFields();
      fetchDiaryEntries(diaryId!, currentPage, pageSize); 
    } catch (error) {
      message.error('Failed to add entry');
      console.error(error);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);
    if (diaryId) {
      fetchDiaryEntries(diaryId, page, pageSize);
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

  const handleDeleteEntry = async (id: number) => {
    try {
      await diaryService.deleteEntry(id);
      message.success('Entry deleted successfully!');
      setEntries(entries.filter(entry => entry.id !== id)); 
    } catch (error) {
      message.error('Failed to delete entry');
      console.error(error);
    }
  };

  const confirmDelete = (id: number) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this entry?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      cancelText: 'No',
      onOk: () => handleDeleteEntry(id),
    });
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

  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
      {diaryExists ? (
        <>
          <Card
        title={<Title level={3} style={{ margin: 0, color: '#1A73E8' }}>Your Diary</Title>}
        extra={<Button type="primary" onClick={() => setIsModalVisible(true)} style={{ backgroundColor: '#1A73E8' }}>Add Entry</Button>}
        style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px', marginBottom: '20px' }}
      >
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
                  justifyContent: 'space-between'
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
                    <Button
                      type="link"
                      onClick={() => confirmDelete(entry.id)}
                      icon={<DeleteOutlined />}
                      danger
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        marginTop: '10px',
                        fontSize: '16px',
                        color: 'red'
                      }}/>
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
                    <Text type="secondary">Severity: {entry.value === 0 ? 'None' : severityOptions.find(option => option.value === entry.value)?.label}</Text>
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
      </Card>

      {/* Add Entry Modal */}
      <Modal
        title="Add New Diary Entry"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleAddEntry} layout="vertical">
          <Form.Item
            label="Emotion"
            name="emotionId"
            rules={[{ required: true, message: 'Please select an emotion' }]}
          >
            <Select placeholder="Select Emotion">
              {emotions.map((emotion) => (
                <Option key={emotion.id} value={emotion.id}>
                  {emotion.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please enter a description' }]}
          >
            <TextArea rows={4} placeholder="Describe your day..." />
          </Form.Item>
          <Form.Item
            label="Severity"
            name="value"
            rules={[{ required: true, message: 'Please select a severity level' }]}
          >
            <Select placeholder="Select Severity">
              {severityOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
              Add Entry
            </Button>
          </Form.Item>
        </Form>
      </Modal>
        </>
      ) : (
        <Card style={{ textAlign: 'center', padding: '50px', borderRadius: '8px' }}>
          <Empty description="No Diary Found" />
          <Button type="primary" onClick={handleCreateDiary} style={{ marginTop: '20px' }}>
            Create Diary
          </Button>
        </Card>
      )}
    </div>
  );
};
