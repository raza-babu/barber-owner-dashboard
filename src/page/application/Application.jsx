import { Table, Input, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Navigate } from "../../Navigate";
import { useGetApplicationsQuery } from "../redux/api/applicationApi";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";
import profile_placeholder from "../../assets/profile_placeholder.png";

const Application = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const { searchTerm } = useDebounce({ searchQuery, setCurrentPage }); //debounce handled
  const {
    data: barberData,
    isLoading,
    isFetching,
  } = useGetApplicationsQuery([
    { name: "page", value: currentPage },
    { name: "limit", value: pageSize },
    { name: "searchTerm", value: searchTerm },
  ]);


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const meta = barberData?.meta || {};

  const columns = [
    {
      title: "SI No",
      key: "siNo",
      render: (_, __, index) => Number(index + 1) + (meta?.page - 1) * pageSize,
    },
    {
      title: "Barber Name",
      dataIndex: "barber",
      key: "barberName",
      render: (barber) => (
        // <Link to={`/dashboard/barber/barberDetails/${record?.barberId}`}>
        <div className="flex items-center gap-2">
          <img
            src={barber?.image || profile_placeholder}
            alt="avatar"
            className="w-8 h-8 rounded-full"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = profile_placeholder;
            }}
          />
          <span>{barber?.fullName}</span>
        </div>
        // </Link>
      ),
    },
    {
      title: "Contact",
      dataIndex: "barber",
      key: "contact",
      render: (barber) => (
        <>
          <div>
            <p>{barber?.email}</p>
            <p>{barber?.phoneNumber}</p>
          </div>
        </>
      ),
    },
    {
      title: "Hourly Rate",
      dataIndex: "jobPost",
      key: "hourlyRate",
      render: (jobPost) => `£${jobPost?.hourlyRate}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => <span className="capitalize">{status}</span>,
    },
  ];

  // Use backend data if exists
  const tableData = barberData?.data || [];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <div className="md:flex justify-between">
        <div className="flex">
          <Navigate title={"Applications"} />
        </div>
        <Input
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ width: 250, height: "42px" }}
        />
      </div>

      <div className="p-2">
        <div className="rounded-md overflow-hidden">
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="id"
            pagination={false}
            rowClassName="border-b border-gray-300"
            scroll={{ x: 800 }}
            loading={isLoading || isFetching}
          />
        </div>
      </div>
      {meta?.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={barberData?.meta?.total || 0}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};
export default Application;
