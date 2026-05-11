import { message, Modal } from "antd";
import { useUpdateTypeMutation } from "../../page/redux/api/manageApi";
import { CgSpinnerTwo } from "react-icons/cg";
import { useState } from "react";
import TypeBadge from "../badge/TypeBadge";

const ChangeTypeModal = ({ scheduleId, type }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [updateStatus, { isLoading }] = useUpdateTypeMutation();

  const handleClick = async () => {
    try {
      const res = await updateStatus({
        id: scheduleId,
        data: {
          type: type === "BOOKING" ? "QUEUE" : "BOOKING",
        },
      }).unwrap();
      message.success(res?.message);
      setModalOpen(false);
    } catch (error) {
      message.error(error?.data?.message);
    }
  };

  return (
    <>
      <TypeBadge type={type} onClick={() => setModalOpen(true)} />
      <Modal
        title={`Are you sure, you want to convert this ${type === "BOOKING" ? "booking to a queue" : "queue to a booking"}?`}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        maskClosable={false}
        footer={false}
        closable={false}
      >
        <div className="flex justify-end px-4 gap-x-3">
          <button
            onClick={() => setModalOpen(false)}
            className="bg-black text-white px-4 py-2 rounded-md cursor-pointer"
          >
            No
          </button>
          <button
            onClick={handleClick}
            disabled={isLoading}
            className="px-4 cursor-pointer py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none disabled:cursor-not-allowed"
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

export default ChangeTypeModal;
