import { Form, Modal, TimePicker } from "antd";
import { useState } from "react";
import { useAddLunchMutation } from "../../page/redux/api/manageApi";
import { ImSpinner3 } from "react-icons/im";


const AddBreakModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [addLunch, { isLoading }] = useAddLunchMutation();

  const handleAddSubmit = async (values) => {
    const payload = {
      startTime: values.startTime ? values.startTime.format('hh:mm A') : null,
      endTime: values.endTime ? values.endTime.format('hh:mm A') : null,
    };

    try {
      await addLunch(payload).unwrap();
      message.success('Lunch time added successfully!');
      setModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.message || "Something went wrong");
    }
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
            rules={[
              { required: true, message: 'Please select an end time!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || !getFieldValue('startTime')) {
                    return Promise.resolve();
                  }
                  if (value.isSame(getFieldValue('startTime'))) {
                    return Promise.reject(new Error('End time cannot be the same as start time!'));
                  }
                  if (value.isBefore(getFieldValue('startTime'))) {
                    return Promise.reject(new Error('End time must be greater than start time!'));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <TimePicker use12Hours format="hh:mm A" className="w-full" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center gap-2 justify-center mt-4 py-2 bg-[#D17C51] cursor-pointer text-white rounded hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <ImSpinner3 siz={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>Add</>
              )}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default AddBreakModal;