import { Button, Modal } from "antd";
import { useState } from "react";
import { CgSpinnerTwo } from "react-icons/cg";
import { DeleteOutlined } from "@ant-design/icons";
import { useDeleteBreakMutation } from "../../page/redux/api/manageApi";
import { message } from "antd";

const DeleteBreakModal = ({ breakId }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteBreak, { isLoading }] = useDeleteBreakMutation();

  const handleDelete = async () => {
    try {
      await deleteBreak(breakId).unwrap();
      message.success('Break time deleted successfully!');
      setModalOpen(false);
    } catch (error) {
      message.error(error?.data?.message || 'Something went wrong');
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
        title="Are you sure you want to delete this break?"
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        maskClosable={false}
        footer={null}
        closable={false}
      >
        <div className="flex justify-end px-4 gap-x-3">
          <button
            onClick={() => setModalOpen(false)}
            className="bg-black text-white px-4 py-1 rounded-md"
          >
            No
          </button>
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 duration-500 text-white px-4 py-1 rounded-md disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <CgSpinnerTwo className="animate-spin" fontSize={16} />
              </>
            ) : (
              "Yes"
            )}
          </button>
        </div>
      </Modal>
    </>
  );
};

export default DeleteBreakModal;
