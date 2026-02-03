import React, { useState } from "react";
import { Table, Dropdown } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { RxCrossCircled } from "react-icons/rx";
import { Navigate } from "../../Navigate";
import { IoIosArrowDown } from "react-icons/io";
import ManageBarber from "./ManageBarber";
import AddBooking from "./AddBooking";
import { useGetSingleShedualeQuery } from "../redux/api/manageApi";
import { useParams } from "react-router-dom";

const BookingManagement = () => {
  const { id } = useParams();
  const { data: singleShaduale, isLoading } = useGetSingleShedualeQuery({ id });
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("personal");

  const items = [
    { label: <button>Barber</button>, key: "0" },
    { label: <button>Customer</button>, key: "1" },
  ];


  const dataSource =
    singleShaduale?.data?.map((item, index) => ({
      key: index + 1,
      dayName: item.dayName,
      time: item.time,
      isActive: item.isActive ? "Open" : "Closed",
    })) || [];

  const columns = [
    { title: "#", dataIndex: "key", key: "key" },
    { title: "Day", dataIndex: "dayName", key: "dayName" },
    { title: "Working Hours", dataIndex: "time", key: "time" },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (status) => (
        <span
          className={`font-medium ${
            status === "Open" ? "text-green-600" : "text-red-500"
          }`}
        >
          {status}
        </span>
      ),
    },

  ];

  return (
    <div className="p-1">
      <div className="flex justify-between">
        <Navigate title={"Schedule Management"} />
      </div>

   

      {selectedTab === "personal" && (
        <div>
         
          <Table
            dataSource={dataSource}
            columns={columns}
            loading={isLoading}
            pagination={false}
            scroll={{ x: 800 }}
          />
        </div>
      )}

      {selectedTab === "photo" && <ManageBarber />}

      <AddBooking
        setOpenAddModal={setOpenAddModal}
        openAddModal={openAddModal}
      />
    </div>
  );
};

export default BookingManagement;
