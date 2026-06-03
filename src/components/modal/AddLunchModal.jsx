import { Button, Form, Modal, TimePicker } from "antd";
import { useState } from "react";

const AddLunchModal = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [form] = Form.useForm();

    const handleAddSubmit = (values) => {
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

            <button
                className="bg-[#D17C51] px-4 py-2 rounded text-white cursor-pointer"
                onClick={() => setModalOpen(true)}
            >
                Add Lunch Time
            </button>

            <Modal
                title="Add Lunch Time"
                open={modalOpen}
                onCancel={() => setModalOpen(false)}
                footer={null}
            >
                <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
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
                            Save
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default AddLunchModal;