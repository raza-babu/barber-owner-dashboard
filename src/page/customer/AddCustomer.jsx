import {
  Form,
  Modal,
  Input,
  Select,
} from "antd";

const AddCustomer = ({ openAddModal, setOpenAddModal }) => {
  const [form] = Form.useForm();
  const handleCancel = () => {
    form.resetFields();
    // setFileList([]);
    setOpenAddModal(false);
  };

  const handleSubmit = () => {
   // console.log("Submitted", values);
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
          Add Customers
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="px-2"
        >
          <Form.Item label="Customer name" name="name" className="mb-4">
            <Input
              placeholder="Customer Name"
              className="w-full"
              style={{ height: 40 }}
            />
          </Form.Item>

          <Form.Item label="City" name="city" className="mb-4">
            <Input
              placeholder="City"
              className="w-full"
              style={{ height: 40 }}
            />
          </Form.Item>
           <Form.Item label="Gender" name="gender" className="mb-4">
            <Select
            
              labelInValue
              defaultValue={{ value: "gender", label: "Gender" }}
              
              
              options={[
                {
                  value: "MAle",
                  label: "Male",
                },
                {
                  value: "Female",
                  label: "Female",
                },
                {
                  value: "Others",
                  label: "others",
                },
              ]}
            />
          </Form.Item>


          <Form.Item label="Contact" name="contact" className="mb-0">
            <Input
              placeholder="Contact"
              className="w-full"
              style={{ height: 40 }}
            />
          </Form.Item>

      

        

       

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

export default AddCustomer;
