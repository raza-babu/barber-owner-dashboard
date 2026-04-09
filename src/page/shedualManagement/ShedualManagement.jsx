import { useState } from "react";
import { Table, Input, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Navigate } from "../../Navigate";
import ManageBarber from "./ManageBarber";
import AddSchedual from "./AddSchedual";
import { useGetAllShedualeBarberQuery } from "../redux/api/manageApi";
import { Link } from "react-router-dom";

const ShedualManagement = () => {
  const [searchTerm, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("schedule");
  const [hireType, setHireType] = useState("non-hired");

  const pageSize = 10;

  const { data, isLoading, isFetching } = useGetAllShedualeBarberQuery({
    all: hireType === "non-hired",
    searchTerm,
    page: currentPage,
    limit: pageSize,
  });

  const dataSource =
    data?.data?.map((barber, index) => ({
      key: index,
      barberFullName: barber.barberName,
      id: barber.barberId,
      barberEmail: barber.barberEmail,
      barberPhoneNumber: barber.barberPhone || "N/A",
      barberAddress: barber.barberAddress,
      image: barber.barberImage,
    })) || [];

  const meta = data?.meta || {};

  const columns = [
    {
      title: "SI No",
      dataIndex: "key",
      render: (_, __, index) => Number(index + 1) + (meta?.page - 1) * pageSize,
    },
    ...(hireType === "non-hired"
      ? [
          {
            title: "Barber Name",
            dataIndex: "barberFullName",
            render: (text, record) => (
              <div className="flex items-center gap-2">
                <img
                  src={record.image}
                  alt="barber"
                  className="w-8 h-8 rounded-full"
                />
                <span>{text}</span>
              </div>
            ),
          },
        ]
      : []),
    ...(hireType === "hired"
      ? [
          {
            title: "Barber Name",
            dataIndex: "barberFullName",
            render: (text, record) => (
              <Link
                to={`/dashboard/schedualManagement/bookingManagement/${record.id}`}
              >
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
        ]
      : []),
    {
      title: "Email",
      dataIndex: "barberEmail",
    },
    {
      title: "Phone",
      dataIndex: "barberPhoneNumber",
    },

    {
      title: "Address",
      dataIndex: "barberAddress",
    },
  ];

  return (
    <div className="bg-white p-3 h-[87vh]">
      {/* FILTER BAR */}
      <div className="md:flex justify-between  items-center ">
        <Navigate title="Schedule Management" />
        <div className="flex gap-4 justify-between mb-4">
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            className="w-64"
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button
            className="bg-[#D17C51] w-75 text-white px-5 py-1.5 rounded cursor-pointer"
            onClick={() => setOpenAddModal(true)}
          >
            + New Schedule
          </button>
        </div>
      </div>

      <>
        {/* HIRED FILTER */}
        <div className="flex gap-3 mb-3">
          <button
            onClick={() => setHireType("non-hired")}
            className={`px-4 py-1 border rounded ${
              hireType === "non-hired" ? "bg-[#D17C51] text-white" : ""
            }`}
          >
            Not scheduled
          </button>
          <button
            onClick={() => setHireType("hired")}
            className={`px-4 py-1 border rounded ${
              hireType === "hired" ? "bg-[#D17C51] text-white" : ""
            }`}
          >
            Scheduled
          </button>
        </div>

        {/* TABLE */}
        <Table
          dataSource={dataSource}
          columns={columns}
          loading={isLoading || isFetching}
          pagination={false}
          scroll={{ x: 800 }}
        />

        {meta?.totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={data?.meta?.total || 0}
              onChange={(page) => setCurrentPage(page)}
              showSizeChanger={false}
            />
          </div>
        )}
      </>

      {/* ================= MANAGE TAB ================= */}
      {selectedTab === "manage" && <ManageBarber />}

      <AddSchedual
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />
    </div>
  );
};

export default ShedualManagement;
