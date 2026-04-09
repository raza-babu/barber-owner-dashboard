import {
  Form,
  Modal,
  DatePicker,
  TimePicker,
  Input,
  Select,
} from "antd";
import dayjs from "dayjs";
const format = "HH:mm";
const AddBooking = ({ openAddModal, setOpenAddModal }) => {
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
            New Booking
          </h2>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="px-2"
          >
            <Form.Item label="Customer Name" name="name" className="mb-4">
              <Input
                placeholder="Customer Name"
                className="w-full"
                style={{ height: 40 }}
              />
            </Form.Item>

            <Form.Item label="Service" name="service" className="mb-4">
              <Input
                placeholder="Service"
                className="w-full"
                style={{ height: 40 }}
              />
            </Form.Item>

            <Form.Item
              label="Assigned Barber"
              name="name"
              className="mb-4"
            >
              <Select
                labelInValue
                defaultValue={{ value: "select", label: "Assigned Barber" }}
                options={[
                  {
                    value: "talha",
                    label: "Talha",
                  },
                  {
                    value: "rafi",
                    label: "Rafi",
                  },
                ]}
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <Form.Item label="Schedule Date" name="Schedule" className="mb-4">
                <DatePicker
                  placeholder="Schedule Date"
                  className="w-full"
                  style={{ height: 40 }}
                />
              </Form.Item>
              <Form.Item label="Time" name="time" className="mb-0">
                <TimePicker
                  className="w-full"
                  defaultValue={dayjs("12:08", format)}
                  format={format}
                  style={{ height: 40 }}
                />
              </Form.Item>
            </div>

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

export default AddBooking;
