import { Form, Modal, TimePicker, Select, DatePicker, message } from "antd";
import { useState } from "react";
import { useAddBreakMutation, useGetAllBarberOwnerQuery } from "../../page/redux/api/manageApi";
import { ImSpinner3 } from "react-icons/im";
import useDebounce from "../../hooks/useDebounce";

const AddBreakModal = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { searchTerm } = useDebounce({ searchQuery, setCurrentPage });
  const { data: barberData, isLoading: barberLoading } = useGetAllBarberOwnerQuery({
    page: currentPage,
    limit: 20,
    searchTerm: searchTerm,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [addBreak, { isLoading }] = useAddBreakMutation();
  const barbers = barberData?.data || [];

  const handleAddSubmit = async (values) => {
    const payload = {
      barberId: values.barberId,
      date: values.date ? values.date.format('YYYY-MM-DD') : null,
      startTime: values.startTime ? values.startTime.format('hh:mm A') : null,
      endTime: values.endTime ? values.endTime.format('hh:mm A') : null,
    };

    try {
      await addBreak(payload).unwrap();
      message.success('Break time added successfully!');
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
      <Modal title="Add Lunch Time" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleAddSubmit}>
          <Form.Item label="Barber" name="barberId" rules={[{ required: true, message: 'Please select a barber!' }]}>
            <Select
              showSearch
              placeholder="Search and select a barber"
              loading={barberLoading}
              onSearch={(val) => setSearchQuery(val)}
              filterOption={false}
              notFoundContent={barberLoading ? "Loading..." : "No barbers found"}
              options={barbers.map(b => ({ label: b.barberName, value: b.barberId }))}
            />
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date!' }]}>
            <DatePicker format="YYYY-MM-DD" className="w-full" />
          </Form.Item>
          <Form.Item label="Start Time" name="startTime" rules={[{ required: true, message: 'Please select a start time!' }]}>
            <TimePicker use12Hours format="hh:mm A" className="w-full" />
          </Form.Item>
          <Form.Item label="End Time" name="endTime" rules={[
            { required: true, message: 'Please select an end time!' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || !getFieldValue('startTime')) return Promise.resolve();
                if (value.isSame(getFieldValue('startTime'))) return Promise.reject(new Error('End time cannot be the same as start time!'));
                if (value.isBefore(getFieldValue('startTime'))) return Promise.reject(new Error('End time must be greater than start time!'));
                return Promise.resolve();
              },
            }),
          ]}>
            <TimePicker use12Hours format="hh:mm A" className="w-full" />
          </Form.Item>
          <Form.Item className="mb-0 text-right">
            <button type="submit" disabled={isLoading} className="w-full flex items-center gap-2 justify-center mt-4 py-2 bg-[#D17C51] cursor-pointer text-white rounded hover:bg-gray-800 focus:ring-2 focus:ring-gray-500 disabled:cursor-not-allowed">
              {isLoading ? (
                <>
                  <ImSpinner3 size={16} className="animate-spin" />
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
  );
};

export default AddBreakModal;
