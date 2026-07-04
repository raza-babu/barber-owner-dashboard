import { Button, Modal, message } from "antd";
import { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { DeleteOutlined } from "@ant-design/icons";
import { useDeleteHolidayMutation } from "../../page/redux/api/holidayApi";

const DeleteHolidayModal = ({ holidayId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteHoliday, { isLoading }] = useDeleteHolidayMutation();

  const handleDelete = async () => {
    try {
      await deleteHoliday(holidayId).unwrap();
      message.success("Holiday deleted successfully!");
      setModalOpen(false);
    } catch (error) {
      message.error(error?.data?.message || "Something went wrong");
      setModalOpen(false);
    }
  };

  return (
    <>
      <Button
        type="text"
        icon={<DeleteOutlined className="text-red-500" />}
        onClick={() => setModalOpen(true)}
      />
      <Modal
        title="Are you sure you want to delete this holiday?"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        maskClosable={false}
        footer={null}
        closable={false}
      >
        <div className="flex justify-end px-4 mt-6 gap-x-3">
          <button
            onClick={() => setModalOpen(false)}
            className="bg-black hover:bg-gray-800 duration-300 text-white px-4 py-1.5 rounded-md cursor-pointer"
          >
            No
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 duration-300 text-white px-4 py-1.5 rounded-md disabled:cursor-not-allowed flex items-center justify-center min-w-[60px] cursor-pointer"
          >
            {isLoading ? (
              <CgSpinnerTwo className="animate-spin" fontSize={16} />
            ) : (
              "Yes"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteHolidayModal;
