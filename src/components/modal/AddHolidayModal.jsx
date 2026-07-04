import { Form, Modal, Select, DatePicker, Switch, Input, message } from "antd";
import { useState } from "react";
import { useAddHolidayMutation } from "../../page/redux/api/holidayApi";
import { useGetAllBarberOwnerQuery } from "../../page/redux/api/manageApi";
import { ImSpinner3 } from "react-icons/im";

const AddHolidayModal = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [addHoliday, { isLoading }] = useAddHolidayMutation();
  
  // Fetch barbers list (up to 100 for selection dropdown)
  const { data: barberData, isLoading: isBarbersLoading } = useGetAllBarberOwnerQuery({
    limit: 100,
  });
  const barbers = barberData?.data || [];

  const handleAddSubmit = async (values) => {
    const payload = {
      barberId: values.barberId,
      date: values.date ? values.date.format("YYYY-MM-DD") : null,
      reason: values.reason,
      isAllDay: !!values.isAllDay,
    };

    try {
      await addHoliday(payload).unwrap();
      message.success("Holiday added successfully!");
      setModalOpen(false);
      form.resetFields();
    } catch (error) {
      message.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <button
        className="bg-[#D17C51] hover:bg-[#b06138] duration-300 px-4 py-2 rounded text-white cursor-pointer"
        onClick={() => setModalOpen(true)}
      >
        Add Holiday
      </button>

      <Modal
        title="Add Barber Holiday"
        open={modalOpen}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddSubmit} initialValues={{ isAllDay: true }}>
          <Form.Item
            label="Select Barber"
            name="barberId"
            rules={[{ required: true, message: "Please select a barber!" }]}
          >
            <Select
              placeholder="Select a barber"
              loading={isBarbersLoading}
              showSearch
              optionLabelProp="label"
              filterOption={(input, option) =>
                (option?.searchValue ?? "").toLowerCase().includes(input.toLowerCase())
              }
            >
              {barbers.map((b) => (
                <Select.Option
                  key={b.barberId}
                  value={b.barberId}
                  label={b.barberName}
                  searchValue={b.barberName || ""}
                >
                  <div className="flex items-center gap-2 py-1">
                    <img
                      src={
                        b.barberImage ||
                        "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
                      }
                      alt={b.barberName}
                      className="w-7 h-7 rounded-full object-cover border border-gray-200"
                    />
                    <span className="font-medium text-gray-800">
                      {b.barberName || "Unnamed Barber"}
                    </span>
                    {b.hourlyRate && (
                      <span className="text-xs text-gray-400 ml-auto">
                        £{b.hourlyRate}/hr
                      </span>
                    )}
                  </div>
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label="Holiday Date"
            name="date"
            rules={[{ required: true, message: "Please select the holiday date!" }]}
          >
            <DatePicker className="w-full" format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: "Please provide a reason!" }]}
          >
            <Input.TextArea placeholder="e.g. Vacation, Sick Leave" rows={3} />
          </Form.Item>

          <Form.Item
            label="All Day Holiday"
            name="isAllDay"
            valuePropName="checked"
          >
            <Switch checkedChildren="Yes" unCheckedChildren="No" />
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center gap-2 justify-center mt-4 py-2 bg-[#D17C51] hover:bg-[#b06138] duration-300 cursor-pointer text-white rounded disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {isLoading ? (
                <>
                  <ImSpinner3 size={16} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>Add Holiday</>
              )}
            </button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddHolidayModal;
