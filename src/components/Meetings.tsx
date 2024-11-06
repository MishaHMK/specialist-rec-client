import React, { useEffect, useState } from 'react';
import { Calendar, Badge, Typography, Modal, List, message, Button, Form, Input, DatePicker, Select } from 'antd';
import MeetingApi from '../api/meetingApi';
import dayjs from 'dayjs';
import { DeleteOutlined } from '@ant-design/icons';
import {IMeeting} from '../interfaces/IMeeting';

const { Title } = Typography;
const { Option } = Select;


export const MeetingsPage: React.FC = () => {
    const [meetings, setMeetings] = useState<IMeeting[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMeetings, setSelectedMeetings] = useState<IMeeting[]>([]);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [form] = Form.useForm();
    const meetingService = new MeetingApi();
    
    useEffect(() => {
        fetchUserMeetings();
    }, []);

    const fetchUserMeetings = async () => {
        try {
            const response = await meetingService.getAllMyMeetings();
            setMeetings(response.data);
        } catch (error) {
            message.error('Failed to load meetings.');
        }
    };

    const dateCellRender = (value: dayjs.Dayjs) => {
        const dateString = value.format('YYYY-MM-DD');
        const dayMeetings = meetings.filter(meeting =>
            dayjs(meeting.startDate).format('YYYY-MM-DD') === dateString
        );

        if (dayMeetings.length > 0) {
            return (
                <ul className="events">
                    <li>
                        <Badge status="default" text={`${dayMeetings.length} meeting${dayMeetings.length > 1 ? 's' : ''}`} />
                    </li>
                </ul>
            );
        }
        return null;
    };

    const handleDateSelect = (value: dayjs.Dayjs) => {
        const dateString = value.format('YYYY-MM-DD');
        const dayMeetings = meetings.filter(meeting =>
            dayjs(meeting.startDate).format('YYYY-MM-DD') === dateString
        );
        setSelectedMeetings(dayMeetings);
        setSelectedDate(dateString);
        setIsModalVisible(true);
    };

    const handleCreateMeeting = async (values: { title: string; url: string; date: any; isOnline: boolean }) => {
        try {
            const newMeeting = {
                title: values.title,
                url: values.url,
                startDate: values.date.format('YYYY-MM-DDTHH:mm:ss'),
                isOnline: values.isOnline,
            };
            await meetingService.createMeeting(newMeeting); 
            message.success('Meeting created successfully!');
            setIsCreateModalVisible(false);
            form.resetFields();
            fetchUserMeetings(); 
        } catch (error) {
            message.error('Failed to create meeting');
        }
    };

    const handleDeleteMeeting = async (id: number) => {
        try {
            await meetingService.deleteMeeting(id); 
            message.success('Meeting deleted successfully!');
            setSelectedMeetings(selectedMeetings.filter(meeting => meeting.id !== id));
            fetchUserMeetings();
        } catch (error) {
            message.error('Failed to delete meeting');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2} style={{ textAlign: 'center' }}>Your Meetings</Title>
            <Button type="primary" onClick={() => setIsCreateModalVisible(true)} style={{ marginBottom: '20px' }}>
                Create Meeting
            </Button>
            <Calendar 
                dateCellRender={dateCellRender} 
                onSelect={handleDateSelect} 
            />

            <Modal
                title={`Meetings on ${selectedDate}`}
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <List
                    itemLayout="vertical"
                    dataSource={selectedMeetings}
                    renderItem={(meeting) => (
                        <List.Item
                            key={meeting.id}
                            actions={[
                                <Button 
                                    type="link" 
                                    icon={<DeleteOutlined />} 
                                    onClick={() => handleDeleteMeeting(meeting.id)} 
                                    danger 
                                >
                                    Delete
                                </Button>
                            ]}
                        >
                            <List.Item.Meta
                                title={meeting.title}
                                description={
                                    <>
                                        <div><strong>Time:</strong> {dayjs(meeting.startDate).format('HH:mm')}</div>
                                        {meeting.isOnline && meeting.url && (
                                            <div><strong>URL:</strong> <a href={meeting.url}>{meeting.url}</a></div>
                                        )}
                                    </>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Modal>

            <Modal
                title="Create New Meeting"
                visible={isCreateModalVisible}
                onCancel={() => setIsCreateModalVisible(false)}
                footer={null}
            >
                <Form form={form} onFinish={handleCreateMeeting} layout="vertical">
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

export default MeetingsPage;
