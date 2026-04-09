import { Form, Modal, DatePicker, Input } from "antd";
const AddManage = ({ openAddModal, setOpenAddModal }) => {
  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    // setFileList([]);
    setOpenAddModal(false);
  };

  const handleSubmit = () => {
    //console.log("Submitted:", values);
  };

  return (
    <div>
      <Modal
        centered
        open={openAddModal}
        onCancel={handleCancel}
        footer={null}
        width={400}
      >
        <div className="mb-6 mt-2">
          <h2 className="text-center font-semibold text-xl mb-4">
            New Schedule
          </h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="px-2"
          >
            <Form.Item label="Barber Name" name="name" className="mb-0">
              <Input
                placeholder="Input Customer name"
                className="w-full"
                style={{ height: 40 }}
              />
            </Form.Item>

            <Form.Item label="Working hours" name="service" className="mb-0">
              <Input
                placeholder="input Service"
                className="w-full"
                style={{ height: 40 }}
              />
            </Form.Item>

            <Form.Item label="Break Times" name="assign" className="mb-0">
              <Input
                placeholder="input assign"
                className="w-full"
                style={{ height: 40 }}
              />
            </Form.Item>

            {/* Date, Time, Duration */}

            <Form.Item
              label="Real-time Availability"
              name="date"
              className="mb-0"
            >
              <DatePicker
                placeholder="Enter Date"
                className="w-full"
                style={{ height: 40 }}
              />
            </Form.Item>

             <Form.Item
              label="Special Dates"
              name="datee"
              className="mb-0"
            >
              <DatePicker
                placeholder="Enter Date"
                className="w-full"
                style={{ height: 40 }}
              />
            </Form.Item>

            <button
              type="submit"
              className="w-full py-2 mt-2 bg-[#D17C51] text-white rounded-md"
            >
              Confirm
            </button>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default AddManage;
