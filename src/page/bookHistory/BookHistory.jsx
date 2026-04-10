import {
  Table,
  Input,
  Pagination,
  Select,
  DatePicker,
  Modal,
  Button,
  List,
  Avatar,
  Divider,
  Descriptions,
} from "antd";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";

import { Navigate } from "../../Navigate";
import { useState } from "react";
import dayjs from "dayjs";
import { useGetAllCustomerOwnerQuery } from "../redux/api/manageApi";
import useDebounce from "../../hooks/useDebounce";

const BookHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const openModal = (record) => {
    setSelectedBooking(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBooking(null);
  };

  // ✅ STATES
  const [activeTab, setActiveTab] = useState("ALL");
  const [status, setStatus] = useState("COMPLETED"); // ✅ default always COMPLETED
  const [date, setDate] = useState(null);

  const pageSize = 10;

  const { searchTerm } = useDebounce({ searchQuery, setCurrentPage }); //debounce handled
  // ✅ API QUERY
  const {
    data: customerData,
    isLoading,
    isFetching,
  } = useGetAllCustomerOwnerQuery({
    page: currentPage,
    limit: pageSize,
    searchTerm: searchTerm || undefined,
    type: activeTab !== "ALL" ? activeTab : undefined,
    status, // ✅ always comes from state
    date: activeTab === "QUEUE" ? date : undefined,
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const meta = customerData?.meta || {};

  const columns = [
    {
      title: "SI No",
      render: (_, __, index) => Number(index + 1) + (meta?.page - 1) * pageSize,
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.customerImage || "https://via.placeholder.com/40"}
            className="w-8 h-8 rounded-full"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Barber Name",
      dataIndex: "barberName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={record.barberImage || "https://via.placeholder.com/40"}
            className="w-8 h-8 rounded-full"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Time",
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (price) => `£${price}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span
          className={`px-2 py-1 rounded text-sm font-medium ${
            status === "COMPLETED"
              ? "bg-green-200 text-green-800"
              : status === "CANCELLED"
                ? "bg-red-200 text-red-800"
                : "bg-gray-200 text-gray-800"
          }`}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Action",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          shape="circle"
          icon={<EyeOutlined />}
          onClick={() => openModal(record)}
        />
      ),
    },
  ];

  const tableData = customerData?.data || [];

  return (
    <div className="bg-white p-3 h-[87vh]">
      {/* HEADER */}
      <div className="md:flex justify-between items-center">
        <Navigate title="Previous Bookings" />

        {/* FILTERS */}
        <div className="flex gap-4 items-center">
          {activeTab === "QUEUE" && (
            <DatePicker
              onChange={(value) => {
                setDate(value ? dayjs(value).format("YYYY-MM-DD") : null);
                setCurrentPage(1);
              }}
            />
          )}

          {/* STATUS SELECT */}
          <Select
            value={status}
            onChange={(value) => {
              setStatus(value);
              setCurrentPage(1);
            }}
            style={{ width: 160, height: 42 }}
            options={[
              { value: "COMPLETED", label: "Completed" },
              { value: "CANCELLED", label: "Cancelled" },
              { value: "NO_SHOW", label: "No Show" },
            ]}
          />

          {/* SEARCH */}
          <Input
            placeholder="Search"
            prefix={<SearchOutlined />}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            style={{ width: 160, height: 42 }}
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mt-4">
        {["ALL", "BOOKING", "QUEUE"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setCurrentPage(1);
              setDate(null); // ✅ only date reset
            }}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-[#D17C51] text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="mt-4">
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="bookingId"
          pagination={false}
          scroll={{ x: 800 }}
          loading={isLoading || isFetching}
        />
      </div>

      {/* PAGINATION */}
      {meta?.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={customerData?.meta?.total || 0}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}
      <Modal
        title="Booking Details"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={720}
      >
        {selectedBooking && (
          <>
            {/* CUSTOMER & BARBER */}
            <div className="flex justify-between gap-6">
              <div className="flex items-center gap-3">
                <Avatar size={64} src={selectedBooking.customerImage} />
                <div>
                  <p className="font-semibold">
                    {selectedBooking.customerName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedBooking.customerEmail}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedBooking.customerPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar size={64} src={selectedBooking.barberImage} />
                <div>
                  <p className="font-semibold">{selectedBooking.barberName}</p>
                  <p className="text-sm text-gray-500">Barber</p>
                </div>
              </div>
            </div>

            <Divider />

            {/* BOOKING INFO */}
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Booking Type">
                {selectedBooking.bookingType}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedBooking.status}
              </Descriptions.Item>
              <Descriptions.Item label="Date">
                {new Date(selectedBooking.bookingDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Time">
                {selectedBooking.startTime} - {selectedBooking.endTime}
              </Descriptions.Item>
              <Descriptions.Item label="Total Price" span={2}>
                ${selectedBooking.totalPrice}
              </Descriptions.Item>
              {selectedBooking.notes && (
                <Descriptions.Item label="Notes" span={2}>
                  {selectedBooking.notes}
                </Descriptions.Item>
              )}
            </Descriptions>

            <Divider />

            {/* SERVICES */}
            <h3 className="font-semibold mb-2">Services</h3>
            <List
              bordered
              dataSource={selectedBooking.services}
              renderItem={(service) => (
                <List.Item>
                  <div className="flex justify-between w-full">
                    <div>
                      <p className="font-medium">{service.serviceName}</p>
                      <p className="text-sm text-gray-500">
                        Available To: {service.availableTo}
                      </p>
                    </div>
                    <p className="font-semibold">${service.price}</p>
                  </div>
                </List.Item>
              )}
            />
          </>
        )}
      </Modal>
    </div>
  );
};

export default BookHistory;
