import { Form, Modal, Select, TimePicker, Switch, message } from "antd";
import dayjs from "dayjs";
import { useAddBarberManagementMutation, useGetAllShedualeBarberSelectQuery } from "../redux/api/manageApi";

const format = "hh:mm A"; 

const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const AddSchedual = ({ openAddModal, setOpenAddModal }) => {
  const [form] = Form.useForm();
  const { data: schedualeBarber, isLoading } = useGetAllShedualeBarberSelectQuery({
    
     page: 1,
    limit: 100000,
  });
  const [addBarberManagement] = useAddBarberManagementMutation();

  const handleCancel = () => {
    form.resetFields();
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {

    // map schedule data
    const schedules = weekDays.map((day) => {
      const timeRange = values[day]; // [start, end]
      return {
        dayName: day,
        time: timeRange
          ? `${dayjs(timeRange[0]).format(format)} - ${dayjs(
              timeRange[1]
            ).format(format)}`
          : "",
        isActive: values[`${day}_isActive`] ?? false,
      };
    });

    const data = {

      barberId: values.barberId,
      schedules,
      type:values?.type
    };


    try {
      const response = await addBarberManagement(data).unwrap();
      message.success(response?.message || "Schedule Added!");
      setOpenAddModal(false);
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <Modal
      centered
      open={openAddModal}
      onCancel={handleCancel}
      footer={null}
      width={500}
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
          {/* Barber Select */}
          <Form.Item
            label="Barber Name"
            name="barberId"
            rules={[{ required: true, message: "Please select a barber" }]}
          >
            <Select
              placeholder="Select Barber"
              loading={isLoading}
              style={{ height: 40 }}
            >
              {schedualeBarber?.data?.map((barber) => (
                <Select.Option key={barber.barberId} value={barber.barberId}>
                  {barber.barberName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Schedule Type"
            name="type"
            rules={[{ required: true, message: "Please select Type" }]}
          >
            <Select style={{ height: "45px" }} placeholder="Select Type">
              <Option value="BOOKING">Booking</Option>
              <Option value="QUEUE">Queue</Option>
            </Select>
          </Form.Item>

          {/* Loop over week days */}
          {weekDays.map((day) => (
            <div
              key={day}
              className="grid grid-cols-2 gap-4 items-center mb-4 border p-2 rounded"
            >
              <Form.Item
                label={day.charAt(0).toUpperCase() + day.slice(1)}
                name={day}
                className="mb-0"
              >
                <TimePicker.RangePicker
                  format={format}
                  className="w-full"
                  use12Hours
                />
              </Form.Item>
              <Form.Item
                label="Active"
                name={`${day}_isActive`}
                valuePropName="checked"
                className="mb-0"
              >
                <Switch />
              </Form.Item>
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-[#D17C51] text-white rounded-md"
          >
            Confirm
          </button>
        </Form>
      </div>
    </Modal>
  );
};

export default AddSchedual;
