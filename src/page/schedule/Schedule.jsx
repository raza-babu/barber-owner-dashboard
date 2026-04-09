/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useMemo } from "react";
import { Table } from "antd";
import {
  useGetProfileQuery,
  useGetScheduleDateQuery,
} from "../redux/api/manageApi";
import { Navigate } from "../../Navigate";
import { Link } from "react-router-dom";
import AddSchedule from "./AddSchedule";

const Schedule = () => {
  const [status, setStatus] = useState("BOOKING");
  const { data: profileData } = useGetProfileQuery();
  const id = profileData?.data?.id;
  const { data, isLoading } = useGetScheduleDateQuery({ id, status });
  const [openAddModal, setOpenAddModal] = useState(false);
  const barbers = data?.data?.barbers || [];
  const dataSource = useMemo(() => {
    return barbers.map((barber, index) => ({
      key: index + 1,
      name: barber.name,
      id: barber.barberId,
      image: barber.image,
      queue: barber.totalQueueLength,
      start: barber.schedule?.start,
      end: barber.schedule?.end,
      status: barber.status,
    }));
  }, [barbers]);

  // 🔹 Table columns
  const columns = [
    {
      title: "SI No",
      dataIndex: "key",
      // render: (_, __, index) => Number(index + 1) + (meta?.page - 1) * pageSize,
    },
    {
      title: "Barber",
      dataIndex: "name",
      render: (text, record) => (
        <Link to={`/dashboard/schedualDate/schedulaeDateDetails/${record?.id}`}>
          <div className="flex items-center gap-2">
            <img
              src={record.image}
              alt="barber"
              className="w-8 h-8 rounded-full"
            />
            <span>{text}</span>
          </div>
        </Link>
      ),
    },
    {
      title: "Schedule",
      render: (_, record) => (
        <span>
          {record.start} - {record.end}
        </span>
      ),
    },
    {
      title: "Queue",
      dataIndex: "queue",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span
          className={`px-3 py-1 rounded text-sm ${
            status === "ACTIVE"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <div className="flex justify-between mb-4">
        <Navigate title={"Appointment Date"} />
        {status === "QUEUE" && (
          <button
            className="bg-[#D17C51] px-3 py-2 rounded text-white mb-4"
            onClick={() => setOpenAddModal(true)}
          >
            Add Queue
          </button>
        )}
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => setStatus("BOOKING")}
          className={`px-6 py-2 rounded border ${
            status === "BOOKING"
              ? "bg-[#D17C51] text-white"
              : "border-[#D17C51] text-[#D17C51]"
          }`}
        >
          Booking
        </button>

        <button
          onClick={() => setStatus("QUEUE")}
          className={`px-6 py-2 rounded border ${
            status === "QUEUE"
              ? "bg-[#D17C51] text-white"
              : "border-[#D17C51] text-[#D17C51]"
          }`}
        >
          Queue
        </button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        loading={isLoading}
        pagination={false}
        scroll={{ x: 800 }}
      />

      <AddSchedule
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />
    </div>
  );
};

export default Schedule;
