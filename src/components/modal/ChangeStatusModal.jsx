import { message, Modal } from "antd";
import { FiEdit } from "react-icons/fi";
import { useUpdateStatusCustomerMutation } from "../../page/redux/api/manageApi";
import { CgSpinnerTwo } from "react-icons/cg";

const ChangeStatusModal = ({
  statusModalOpen,
  setStatusModalOpen,
  bookingId,
  updatedStatus,
  statusTitle,
}) => {
  const [updateStatus, { isLoading }] = useUpdateStatusCustomerMutation();

  const handleClick = async () => {
    try {
      const res = await updateStatus({
        bookingId,
        status: updatedStatus,
      }).unwrap();
      message.success(res?.message);
      setStatusModalOpen(false);
    } catch (error) {
      message.error(error?.data?.message);
    }
  };

  return (
    <>
      <button
        className="p-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full"
        onClick={() => {
          setStatusModalOpen(true);
        }}
      >
        <FiEdit size={14} />
      </button>
      <Modal
        title={`Are you sure, you want to ${statusTitle}?`}
        open={statusModalOpen}
        onCancel={() => setStatusModalOpen(false)}
        maskClosable={false}
        footer={false}
        closable={false}
      >
        <div className="flex justify-end px-4 gap-x-3">
          <button
            onClick={() => setStatusModalOpen(false)}
            className="bg-black text-white px-4 py-2 rounded-md cursor-pointer"
          >
            No
          </button>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="px-4 cursor-pointer py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none disabled:cursor-not-allowed"
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

export default ChangeStatusModal;
