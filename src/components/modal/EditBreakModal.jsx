import { useState } from 'react';
import { Button, Form, Modal, TimePicker, Select, DatePicker, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useUpdateBreakMutation, useGetAllBarberOwnerQuery } from '../../page/redux/api/manageApi';
import { ImSpinner3 } from 'react-icons/im';
import useDebounce from '../../hooks/useDebounce';

dayjs.extend(customParseFormat);

const EditBreakModal = ({ record }) => {
  const { id, barberId, lunchStart:date, startTime, endTime } = record || {};
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const { searchTerm } = useDebounce({ searchQuery, setCurrentPage });
  const { data: barberData, isLoading: barberLoading } = useGetAllBarberOwnerQuery({
    page: currentPage,
    limit: 20,
    searchTerm,
  });
  const [updateBreak, { isLoading }] = useUpdateBreakMutation();
  const barbers = barberData?.data || [];

  const handleSubmit = async (values) => {
    const payload = {
      barberId: values.barberId,
      date: values.date ? values.date.format('YYYY-MM-DD') : null,
      startTime: values.startTime ? values.startTime.format('hh:mm A') : null,
      endTime: values.endTime ? values.endTime.format('hh:mm A') : null,
    };

    try {
      await updateBreak({ breakId: id, data: payload }).unwrap();
      message.success('Break time updated successfully!');
      setModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.message || 'Something went wrong');
    }
  };

  const openModal = () => {
    form.setFieldsValue({
      barberId,
      date: date ? dayjs(date, 'YYYY-MM-DD') : null,
      startTime: startTime ? dayjs(startTime, 'hh:mm A') : null,
      endTime: endTime ? dayjs(endTime, 'hh:mm A') : null,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    form.resetFields();
    setSearchQuery('');
  };

  return (
    <>
      <Button type="text" icon={<EditOutlined className="text-blue-500" />} onClick={openModal} />
      <Modal title="Edit Lunch Time" open={modalOpen} onCancel={() => setModalOpen(false)} footer={null}>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="Barber" name="barberId" rules={[{ required: true, message: 'Please select a barber!' }]}>
            <Select
              showSearch
              placeholder="Search and select a barber"
              loading={barberLoading}
              onSearch={(val) => setSearchQuery(val)}
              filterOption={false}
              notFoundContent={barberLoading ? 'Loading...' : 'No barbers found'}
              options={barbers.map(b => ({ label: b.barberName, value: b.barberId }))}
            />
          </Form.Item>
          <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Please select a date!' }]}>
            <DatePicker format="YYYY-MM-DD" className="w-full" disabledDate={(current) => current && current < dayjs().startOf('day')} />
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
                <>Save Changes</>
              )}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditBreakModal;
