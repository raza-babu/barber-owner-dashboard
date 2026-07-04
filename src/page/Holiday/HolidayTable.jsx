import { Table, Tag } from "antd";
import dayjs from "dayjs";
import EditHolidayModal from "../../components/modal/EditHolidayModal";
import DeleteHolidayModal from "../../components/modal/DeleteHolidayModal";

const HolidayTable = ({ holidays, loading }) => {
  const columns = [
    {
      title: "SI No",
      key: "siNo",
      render: (_, __, index) => index + 1,
      width: 80,
    },
    {
      title: "Barber",
      key: "barber",
      render: (_, record) => {
        const barberName = record.user?.fullName || "Unnamed Barber";
        const barberImage =
          record.barberImage ||
          "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";
        return (
          <div className="flex items-center gap-2">
            <img
              src={barberImage}
              alt="Barber"
              className="w-10 h-10 rounded-full object-cover border border-gray-200"
            />
            <span className="font-medium text-gray-800">{barberName}</span>
          </div>
        );
      },
    },
    {
      title: "Barber Email",
      dataIndex: ["user", "email"],
      key: "email",
      render: (email) => email || "N/A",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => (date ? dayjs(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason",
      render: (reason) => (
        <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100 font-normal">
          {reason || "N/A"}
        </span>
      ),
    },
    {
      title: "Duration",
      dataIndex: "isAllDay",
      key: "isAllDay",
      render: (isAllDay) => (
        <Tag color={isAllDay ? "orange" : "blue"}>
          {isAllDay ? "All Day" : "Part-Time"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <EditHolidayModal record={record} />
          <DeleteHolidayModal holidayId={record.id} />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={holidays}
      rowKey="id"
      loading={loading}
      pagination={{ pageSize: 8 }}
      rowClassName="hover:bg-gray-50 transition-colors"
      className="border border-gray-200 rounded-lg overflow-hidden"
    />
  );
};

export default HolidayTable;
