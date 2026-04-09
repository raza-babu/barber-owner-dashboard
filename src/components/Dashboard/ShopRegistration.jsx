import {
  Table,
  Select,
  DatePicker,
  message,
  Modal,
  Button,
  Descriptions,
  List,
  Avatar,
  Divider,
} from "antd";
import { EyeOutlined } from "@ant-design/icons";
import { useState } from "react";
import dayjs from "dayjs";

import { Link } from "react-router-dom";
import { BiMessageRoundedDots } from "react-icons/bi";
import { useGetAllCustomerOwnerQuery, useUpdateStatusCustomerMutation } from "../../page/redux/api/manageApi";
const STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "COMPLETED", label: "Completed" },
  { value: "RESCHEDULED", label: "Rescheduled" },
];

const ShopRegistration = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const [updateStatus] = useUpdateStatusCustomerMutation();
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

  const [activeTab, setActiveTab] = useState("BOOKING");
  const [status, setStatus] = useState(null);
  const [date, setDate] = useState(null);


  // ✅ API QUERY PARAMS
  const { data: customerData } = useGetAllCustomerOwnerQuery({
  
 
    type: activeTab !== "ALL" ? activeTab : undefined,
    status: status || undefined,
    date: activeTab === "QUEUE" ? date : undefined,
  });
  const handleStatusChange = async (bookingId, status) => {
    try {
      const res = await updateStatus({
        bookingId,
        status,
      }).unwrap();
      message.success(res?.message);
    } catch (error) {
      message.error(error?.data?.message);
    }
  };

  const columns = [
    {
      title: "SI No",
      key: "siNo",
      render: (_, __, index) => index + 1,
    },

    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={
              record.customerImage ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: "Barber Name",
      dataIndex: "barberName",
      key: "barberName",
      render: (text, record) => (
        <div className="flex items-center gap-2">
          <img
            src={
              record.barberImage ||
              "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
            }
            alt="barber"
            className="w-8 h-8 rounded-full"
          />
          <span>{text}</span>
        </div>
      ),
    },

    {
      title: "Booking Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (date) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Time",
      render: (_, record) => `${record.startTime} - ${record.endTime}`,
    },
    {
      title: "Total Price",
      dataIndex: "totalPrice",
      render: (price) => `$${price}`,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 150 }}
          options={STATUS_OPTIONS}
          onChange={(value) => handleStatusChange(record.bookingId, value)}
        />
      ),
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex items-center gap-3 justify-center">
          <Button
            type="primary"
            shape="circle"
            icon={<EyeOutlined />}
            onClick={() => openModal(record)}
          />

          {record?.isRegistered === true && (
            <Link to={`/dashboard/bookingHistory/chat/${record?.customerId}`}>
              <BiMessageRoundedDots className="text-[#AB684D] text-xl cursor-pointer" />
            </Link>
          )}
        </div>
      ),
    },
  ];

  const tableData = customerData?.data.slice(1,5) || [];

  return (
    <div className="p-3 bg-white mt-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold pb-2">Recent Booking Request</h2>
        <Link to={"/dashboard/customer"}>
          <button className="text-[#AB684D]">View all</button>
        </Link>
      </div>
      <div className="md:flex justify-between items-center">
      <div className="flex gap-4 mt-4">
        {["BOOKING", "QUEUE"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setStatus(null);

              if (tab === "QUEUE") {
                setDate(today);
              } else {
                setDate(null);
              }
            }}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? "bg-[#D17C51] text-white" : "bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
        {/* FILTERS */}
        <div className="flex gap-4 items-center">
          {activeTab === "QUEUE" && (
            <DatePicker
              value={date ? dayjs(date) : null}
              onChange={(value) =>
                setDate(value ? dayjs(value).format("YYYY-MM-DD") : null)
              }
            />
          )}

          {/* Status Select */}
          <Select
            value={status}
            onChange={(value) => setStatus(value || null)}
            allowClear
            placeholder="Status"
            style={{ width: 150, height: "42px" }}
            options={[
              { value: "PENDING", label: "Pending" },
              { value: "STARTED", label: "Started" },
              { value: "CONFIRMED", label: "Confirmed" },
              { value: "ENDED", label: "Ended" },
            ]}
          />

     
        </div>
      </div>

      {/* TABS */}
     

      {/* TABLE */}
      <div className="mt-4 rounded-md overflow-hidden">
        <Table
          columns={columns}
          dataSource={tableData}
          rowKey="bookingId"
          pagination={false}
          rowClassName="border-b border-gray-300"
          scroll={{ x: 800 }}
        />
      </div>



      <Modal
        title="Booking Details"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        width={700}
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
                  <p className="text-gray-500 text-sm">
                    {selectedBooking.customerEmail}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {selectedBooking.customerPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Avatar size={64} src={selectedBooking.barberImage} />
                <div>
                  <p className="font-semibold">{selectedBooking.barberName}</p>
                  <p className="text-gray-500 text-sm">Barber</p>
                </div>
              </div>
            </div>

            <Divider />

            {/* BOOKING INFO */}
            <Descriptions bordered size="small" column={2}>
              <Descriptions.Item label="Booking Date">
                {new Date(selectedBooking.bookingDate).toLocaleDateString()}
              </Descriptions.Item>

              <Descriptions.Item label="Time">
                {selectedBooking.startTime} - {selectedBooking.endTime}
              </Descriptions.Item>

              <Descriptions.Item label="Booking Type">
                {selectedBooking.bookingType}
              </Descriptions.Item>

              <Descriptions.Item label="Status">
                {selectedBooking.status}
              </Descriptions.Item>

              <Descriptions.Item label="Total Price" span={2}>
                ${selectedBooking.totalPrice}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            {/* SERVICES LIST */}
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
                    <p className="font-semibold">{service.price}</p>
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

export default ShopRegistration;
