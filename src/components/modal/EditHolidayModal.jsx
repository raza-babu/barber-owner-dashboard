import { Button, Form, Modal, Select, DatePicker, Switch, Input, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";
import { useUpdateHolidayMutation } from "../../page/redux/api/holidayApi";
import { useGetAllBarberOwnerQuery } from "../../page/redux/api/manageApi";
import { ImSpinner3 } from "react-icons/im";

const EditHolidayModal = ({ record }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const { id, barberId, date, reason, isAllDay } = record || {};
  const [updateHoliday, { isLoading }] = useUpdateHolidayMutation();

  // Fetch barbers list (up to 100 for selection dropdown)
  const { data: barberData, isLoading: isBarbersLoading } = useGetAllBarberOwnerQuery({
    limit: 100,
  });
  const barbers = barberData?.data || [];

  const handleEditSubmit = async (values) => {
    const payload = {
      barberId: values.barberId,
      date: values.date ? values.date.format("YYYY-MM-DD") : null,
      reason: values.reason,
      isAllDay: !!values.isAllDay,
    };

    try {
      await updateHoliday({
        id: id,
        data: payload,
      }).unwrap();
      message.success("Holiday updated successfully!");
      setModalOpen(false);
    } catch (error) {
      message.error(error?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      <Button
        type="text"
        icon={<EditOutlined className="text-blue-500" />}
        onClick={() => {
          form.setFieldsValue({
            barberId: barberId,
            date: date ? dayjs(date) : null,
            reason: reason,
            isAllDay: !!isAllDay,
          });
          setModalOpen(true);
        }}
      />

      <Modal
        title="Edit Barber Holiday"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
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
            <DatePicker
              className="w-full"
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current <= dayjs().endOf("day")}
            />
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
                  Saving Changes...
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

export default EditHolidayModal;
