import {
  Form,
  Modal,
  DatePicker,
  Input,
  Select,
  message,
} from "antd";
import dayjs from "dayjs";
import {
  useAddQueueMutation,
  useGetAllServicesOwnerSelectQuery,
} from "../redux/api/manageApi";
import { useGetProfileQuery } from "../redux/api/manageApi";

const AddSchedule = ({ openAddModal, setOpenAddModal }) => {
  const [form] = Form.useForm();

  const { data: profileData } = useGetProfileQuery();
  const saloonOwnerId = profileData?.data?.id;

  const { data: services } = useGetAllServicesOwnerSelectQuery({
    page: 1,
    limit: 10000,
  });
  const [addQueue, { isLoading }] = useAddQueueMutation();

  const handleCancel = () => {
    form.resetFields();
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
    const payload = {
      fullName: values.fullName,
      email: values.email,
      saloonOwnerId,
      date: dayjs(values.date).format("YYYY-MM-DD"),
      services: values.services, // array
      notes: values.notes,
      type: "QUEUE",
    };

    try {
      await addQueue(payload).unwrap();
      message.success("Queue added successfully");
      handleCancel();
    } catch (error) {
      message.error("Failed to add queue");
    }
  };

  return (
    <Modal
      centered
      open={openAddModal}
      onCancel={handleCancel}
      footer={null}
      width={420}
    >
      <h2 className="text-center font-semibold text-xl mb-4">
        Add Queue
      </h2>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
        {/* Full Name */}
        <Form.Item
          label="Full Name"
          name="fullName"
          rules={[{ required: true, message: "Full name required" }]}
        >
          <Input placeholder="Enter full name" />
        </Form.Item>

        {/* Email */}
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input placeholder="Enter email" />
        </Form.Item>

        {/* Date */}
        <Form.Item
          label="Date"
          name="date"
          rules={[{ required: true }]}
        >
          <DatePicker
            className="w-full"
            disabledDate={(current) =>
              current && current < dayjs().startOf("day")
            }
          />
        </Form.Item>

        {/* Services */}
        <Form.Item
          label="Services"
          name="services"
          rules={[{ required: true, message: "Select at least one service" }]}
        >
          <Select
            mode="multiple"
            placeholder="Select services"
          >
            {services?.data?.map((service) => (
              <Select.Option key={service.id} value={service.id}>
                {service.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        {/* Notes */}
        <Form.Item label="Notes" name="notes">
          <Input.TextArea rows={3} placeholder="Notes (optional)" />
        </Form.Item>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-[#D17C51] text-white rounded-md"
        >
          {isLoading ? "Saving..." : "Save"}
        </button>
      </Form>
    </Modal>
  );
};

export default AddSchedule;
