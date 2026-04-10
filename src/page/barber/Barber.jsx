import { Table, Input, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Navigate } from "../../Navigate";
import { Link } from "react-router-dom";
import { useGetAllBarberOwnerQuery } from "../redux/api/manageApi";
import { useState } from "react";
import useDebounce from "../../hooks/useDebounce";

export const Barber = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const { searchTerm } = useDebounce({ searchQuery, setCurrentPage }); //debounce handled
  const {
    data: barberData,
    isLoading,
    isFetching,
  } = useGetAllBarberOwnerQuery({
    searchTerm: searchTerm,
    page: currentPage,
    limit: pageSize,
  });
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
      dataIndex: "barberName",
      key: "barberName",
      render: (text, record) => (
        <Link to={`/dashboard/barber/barberDetails/${record?.barberId}`}>
          <div className="flex items-center gap-2">
            <img
              src={
                record.barberImage ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />
            <span>{text}</span>
          </div>
        </Link>
      ),
    },
    {
      title: "Contact",
      dataIndex: "barberPhone",
      key: "barberPhone",
      render: (text) => text || "N/A",
    },
    {
      title: "Hourly Rate",
      dataIndex: "hourlyRate",
      key: "hourlyRate",
      render: (rate) => `£${rate}`,
    },
  ];

  // Use backend data if exists
  const tableData = barberData?.data || [];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <div className="md:flex justify-between">
        <div className="flex">
          <Navigate title={"Barbers"} />
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
            rowKey="barberId"
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
