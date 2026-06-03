import { Button, Form, Modal, TimePicker } from "antd"
import { EditOutlined } from '@ant-design/icons';
import { useState } from "react";


const EditLunchModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = (values) => {
        const payload = {
            id: Date.now(),
            date: dayjs().format('YYYY-MM-DD'), // Default to today since it's not in the form
            startTime: values.startTime ? values.startTime.format('hh:mm A') : null,
            endTime: values.endTime ? values.endTime.format('hh:mm A') : null,
        };
        message.success('Lunch time added successfully!');
    };

    return (
        <>

            <Button
                type="text"
                icon={<EditOutlined className="text-blue-500" />}
                onClick={() => setModalOpen(true)}
            />

            <Modal
                title="Edit Lunch Time"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleSubmit}>
                    <Form.Item
                        label="Start Time"
                        name="startTime"
                        rules={[{ required: true, message: 'Please select a start time!' }]}
                    >
                        <TimePicker use12Hours format="hh:mm A" className="w-full" />
                    </Form.Item>

                    <Form.Item
                        label="End Time"
                        name="endTime"
                        rules={[{ required: true, message: 'Please select an end time!' }]}
                    >
                        <TimePicker use12Hours format="hh:mm A" className="w-full" />
                    </Form.Item>

                    <Form.Item className="mb-0 text-right">
                        <Button onClick={() => setModalOpen(false)} className="mr-2">
                            Cancel
                        </Button>
                        <Button type="primary" htmlType="submit" className="bg-[#D17C51] text-white hover:bg-[#D17C51]/90">
                            Update
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default EditLunchModal