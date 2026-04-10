import { Input, Table, Button, Pagination, message } from "antd";
import { Navigate } from "../../Navigate";
import { SearchOutlined } from "@ant-design/icons";
import AddServices from "./AddServices";
import EditServices from "./EditServices";
import { useState } from "react";
import {
  useDeleteServicesOwnerMutation,
  useGetAllServicesOwnerQuery,
} from "../redux/api/manageApi";
import useDebounce from "../../hooks/useDebounce";

const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { searchTerm } = useDebounce({ searchQuery, setCurrentPage }); //debounce handled
  const {
    data: services,
    isLoading,
    isFetching,
  } = useGetAllServicesOwnerQuery({
    searchTerm,
    page: currentPage,
    limit: pageSize,
  });

  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteSrvices] = useDeleteServicesOwnerMutation();
  const handleEdit = (record) => {
    setSelectedUser(record);
    setEditModal(true);
  };

  const meta = services?.meta || {};

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleDeleteFaq = async (id) => {
    try {
      const res = await deleteSrvices(id).unwrap();
      message.success(res?.message);
    } catch (err) {
      message.error(err?.data?.message);
    }
  };
  const columns = [
    {
      title: "Service Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Avilable To",
      dataIndex: "availableTo",
      key: "availableTo",
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration) => `${duration} `,
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => `$${price}`,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-4">
          <Button onClick={() => handleDeleteFaq(record?.id)} type="link">
            Delete
          </Button>
          <Button type="link" onClick={() => handleEdit(record)}>
            Edit
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <div className="md:flex justify-between mb-4">
        <Navigate title={"Services"} />
        <Input
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ width: 250, height: "42px" }}
        />
      </div>

      <Button
        className="bg-[#D17C51] text-white mb-4"
        onClick={() => setOpenAddModal(true)}
      >
        + New Services
      </Button>

      <Table
        columns={columns}
        dataSource={services?.data}
        rowKey="id"
        loading={isLoading || isFetching}
        pagination={false}
        scroll={{ x: 900 }}
      />

      {meta?.totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={services?.meta?.total || 0}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}

      <AddServices
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      />
      <EditServices
        editModal={editModal}
        setEditModal={setEditModal}
        selectedUser={selectedUser}
      />
    </div>
  );
};

export default Services;
