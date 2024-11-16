import React, { useEffect, useState } from 'react';
import { Calendar, Tag , Typography, Modal, List, message, Button, Form, Input, DatePicker, Select } from 'antd';
import MeetingApi from '../api/meetingApi';
import dayjs from 'dayjs';
import { DeleteOutlined, CalendarOutlined  } from '@ant-design/icons';
import { IMeeting } from '../interfaces/IMeeting';
import  CreateMeetingModal  from '../components/CreateMeetingModal'

const { Title } = Typography;
const { Option } = Select;

export const MeetingsPage: React.FC = () => {
    const [meetings, setMeetings] = useState<IMeeting[]>([]);
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedMeetings, setSelectedMeetings] = useState<IMeeting[]>([]);
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

    const dateCellRender = (value : any) => {
        const dateString = value.format('YYYY-MM-DD');
        const dayMeetings = meetings.filter(meeting =>
            dayjs(meeting.startDate).format('YYYY-MM-DD') === dateString
        );

        if (dayMeetings.length > 0) {
            return (
                <div style={{ textAlign: 'center', padding: '5px' }}>
                    <Tag
                        color="blue"
                        icon={<CalendarOutlined />}
                        style={{
                            fontSize: '0.9rem',
                            padding: '5px 10px',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {dayMeetings.length} Meeting{dayMeetings.length > 1 ? 's' : ''}
                    </Tag>
                </div>
            );
        }
        return null;
    };

    const handleDateSelect = (value : any) => {
        const dateString = value.format('YYYY-MM-DD');
        const dayMeetings = meetings.filter(meeting =>
            dayjs(meeting.startDate).format('YYYY-MM-DD') === dateString
        );
        setSelectedMeetings(dayMeetings);
        setSelectedDate(dateString);
        setIsModalVisible(true);
    };

    const handleDeleteMeeting = async (id : any) => {
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
        </div>
    );
};

