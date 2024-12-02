import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, message } from 'antd';
import dayjs from 'dayjs';
import MeetingApi from '../api/meetingApi';

const { Option } = Select;

interface CreateMeetingModalProps {
    visible: boolean;
    onClose: () => void;
    therapistId: string;
    clientId: string;
    onMeetingCreated: () => void;
}

const CreateMeetingModal: React.FC<CreateMeetingModalProps> = ({ visible, onClose, therapistId, clientId, onMeetingCreated }) => {
    const [form] = Form.useForm();
    const [bookedTimes, setBookedTimes] = useState<number[]>([]);
    const meetingService = new MeetingApi();

    useEffect(() => {
        if (visible) {
            form.resetFields();
        }
    }, [visible]);

    const fetchBookedTimes = async () => {
        try {
            const response = await meetingService.getBookedDates(therapistId);
            setBookedTimes(response.data.map((time: string) => dayjs(time).hour()));
        } catch (error) {
            message.error('Failed to load booked times.');
        }
    };

    const disableUnavailableTimes = () => {
        const allHours = Array.from({ length: 24 }, (_, i) => i);
        return allHours.filter(hour => hour < 8 || hour >= 18 || bookedTimes.includes(hour));
    };

    const disablePastAndWeekendDates = (currentDate: dayjs.Dayjs) => {
        const today = dayjs().startOf('day');
        const day = currentDate.day();
        return currentDate.isBefore(today) || day === 0 || day === 6; // Disable past dates and weekends
    };

    const handleDateChange = (date: dayjs.Dayjs) => {
        if (date) {
            fetchBookedTimes();
        }
    };

    const handleCreateMeeting = async (values: { title: string; url: string; date: dayjs.Dayjs; isOnline: boolean }) => {
        try {
            const newMeeting = {
                title: values.title,
                url: values.isOnline ? values.url : null,
                startDate: values.date.format('YYYY-MM-DDTHH:mm:ss'),
                isOnline: values.isOnline,
                clientId,
                therapistId,
            };
            await meetingService.createMeeting(newMeeting);
            message.success('Meeting created successfully!');
            onMeetingCreated();
            onClose();
        } catch (error) {
            message.error('Failed to create meeting');
        }
    };

    return (
        <Modal
            title="Create New Meeting"
            visible={visible}
            onCancel={onClose}
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
                    <DatePicker
                        showTime={{
                            format: 'HH:00',
                            disabledHours: disableUnavailableTimes,
                            disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i).filter(minute => minute !== 0),
                        }}
                        format="YYYY-MM-DD HH:00"
                        disabledDate={disablePastAndWeekendDates} // Updated to disable weekends and past dates
                        onChange={handleDateChange}
                        style={{ width: '100%' }}
                    />
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
    );
};

export default CreateMeetingModal;