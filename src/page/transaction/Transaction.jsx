import { Table, Input, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Navigate } from "../../Navigate";
import { useGetAllTreansactionOwnerQuery } from "../redux/api/manageApi";
import useDebounce from "../../hooks/useDebounce";

export const Transaction = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const { searchTerm } = useDebounce({ searchQuery, setCurrentPage }); //debounce handled
  const {
    data: transaction,
    isLoading,
    isFetching,
  } = useGetAllTreansactionOwnerQuery({
    searchTerm,
    page: currentPage,
    limit: pageSize,
  });

  const meta = transaction?.meta || {};

  const handlePageChange = (page) => setCurrentPage(page);

  const columns = [
    {
      title: "SI No",
      render: (_, __, index) => Number(index + 1) + (meta?.page - 1) * pageSize,
    },
    {
      title: "Date",
      dataIndex: "bookingDate",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.customerImage}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Customer Email",
      dataIndex: "customerEmail",
      key: "customerEmail",
    },
    {
      title: "Barber Name",
      dataIndex: "barberName",
      key: "barberName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.barberImage}
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Barber Email",
      dataIndex: "barberEmail",
      key: "barberEmail",
    },
    {
      title: "Paid Amount",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      render: (text) => `£${text}`,
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded ${
            status === "COMPLETED"
              ? "bg-green-200 text-green-800"
              : "bg-red-200 text-red-800"
          }`}
        >
          {status}
        </span>
      ),
    },
  ];

  const tableData = transaction?.data || [];

  return (
    <div>
      <div className="bg-white p-3 h-[87vh]">
        <div className="flex justify-between">
          <Navigate title={"Transaction"} />
          <Input
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search"
            prefix={<SearchOutlined />}
            style={{ width: 150, height: "42px" }}
          />
        </div>

        <div className="p-2">
          <div className="rounded-md overflow-hidden">
            <Table
              columns={columns}
              dataSource={tableData}
              rowKey="paymentId"
              pagination={false}
              rowClassName="border-b border-gray-300"
              scroll={{ x: 1000 }}
              loading={isLoading || isFetching}
            />
          </div>
        </div>

        {meta?.totalPages > 1 && (
          <div className="mt-4 flex justify-center">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={transaction?.meta?.total || 0}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};
