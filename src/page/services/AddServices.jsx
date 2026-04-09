import {
  Form,
  Modal,
  Input,
  Select,
  message,
} from "antd";
import { useAddServicesOwnerMutation } from "../redux/api/manageApi";

const AddServices = ({ openAddModal, setOpenAddModal }) => {
  const [addServices] = useAddServicesOwnerMutation()
  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    // setFileList([]);
    setOpenAddModal(false);
  };

  const handleSubmit = async (values) => {
       const data = {
      duration: Number(values?.duration),
      price: Number(values?.price),
      availableTo: values?.availableTo,
      serviceName: values?.serviceName,
    };
    try {
      const response = await addServices(data).unwrap();

      message.success(response?.message);
      setOpenAddModal(false);
    } catch (error) {
      message.error(error?.data?.message);
    }
  };

  return (
    <Modal
      centered
      open={openAddModal}
      onCancel={handleCancel}
      footer={null}
      width={400}
    >
      <div className="mb-6 mt-2">
        <h2 className="text-center font-semibold text-xl mb-4">
          Add Services
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="px-2"
        >
          <Form.Item label="Service name" name="serviceName" className="mb-0">
            <Input
              placeholder="input services"
              className="w-full"
              style={{ height: 40 }}
            />
            </Form.Item>
            <div className="mt-4">  <Form.Item
                          label="Services Available To"
                          name="availableTo"
                          rules={[
                            { required: true, message: "Please input availableTo!" },
                          ]}
                        >
                          <Select
                            style={{ height: "48px" }}
                            placeholder="Select Available"
                            className="w-full"
                          >
                            <Option value="Select Available">Select</Option>
                            <Option value="EVERYONE">EVERYONE</Option>
                            <Option value="MALE">MALE</Option>
                            <Option value="FEMALE">FEMALE</Option>
                     
                          </Select>
                        </Form.Item></div>



          {/* Date, Time, Duration */}
          <div className="grid grid-cols-3 gap-2 mt-3 mb-4">
            <Form.Item  label="Duration" name="duration" className="mb-0">
              <Input
              placeholder="Duration"
              className="w-full"
              style={{ height: 40 }}
            />
            </Form.Item>
            <Form.Item label="Price" name="price" className="mb-0">
               <Input
               type="number"
              placeholder="Price"
              className="w-full"
              style={{ height: 40 }}
            />
            </Form.Item>
          </div>

       

          <button
            type="submit"
            className="w-full py-2 mt-2 bg-[#D17C51] text-white rounded-md"
          >
            Save
          </button>
        </Form>
      </div>
    </Modal>
  );
};

export default AddServices;
