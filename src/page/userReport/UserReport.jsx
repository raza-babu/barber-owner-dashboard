import { useState } from "react";
import { Navigate } from "../../Navigate";
import { Table, Input, Tag } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import ReplyUser from "./ReplyUser";

const UserReport = () => {
  const [openAddModal, setOpenAddModal] = useState(false);


  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <div>
          <div className="font-semibold">{record.fullName}</div>
          <div className="text-xs text-gray-500">{record.name}</div>
        </div>
      ),
    },
    {
      title: "Contact",
      dataIndex: "contact",
    },
    {
      title: "Region",
      dataIndex: "region",
      render: () => <span className="text-gray-400">Image blur</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        return (
          <Tag
            color={status === "Active" ? "green" : "volcano"}
            className="rounded-full px-3"
          >
            {status}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      render: () => (
        <div className="flex gap-2">
          <button
            onClick={() => setOpenAddModal(true)}
            className="bg-[#D17C51] border text-white px-4 py-1 rounded"
          >
            Reply
          </button>
          <button className="bg-[#D15151] text-white px-4 py-1 border rounded">
            Argon
          </button>
        </div>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      name: "Flores",
      fullName: "Albert Flores",
      contact: "flores@mail.com (+62) 21-1234-5678",
      status: "Active",
    },
    {
      key: "2",
      name: "Warren",
      fullName: "Wade Warren",
      contact: "flores@mail.com (+62) 21-1234-5678",
      status: "Active",
    },
    {
      key: "3",
      name: "Richards",
      fullName: "Ronald Richards",
      contact: "flores@mail.com (+62) 21-1234-5678",
      status: "Inactive",
    },
    {
      key: "4",
      name: "Bell",
      fullName: "Jerome Bell",
      contact: "flores@mail.com (+62) 21-1234-5678",
      status: "Active",
    },
    {
      key: "5",
      name: "Jacob",
      fullName: "Jacob Jones",
      contact: "flores@mail.com (+62) 21-1234-5678",
      status: "Active",
    },
    {
      key: "6",
      name: "Marvin",
      fullName: "Marvin McKinney",
      contact: "flores@mail.com (+62) 21-1234-5678",
      status: "Active",
    },
    {
      key: "7",
      name: "Williamson",
      fullName: "Cameron Williamson",
      contact: "flores@mail.com (+62) 21-1234-5678",
      status: "Inactive",
    },
    {
      key: "8",
      name: "Howard",
      fullName: "Esther Howard",
      contact: "flores@mail.com (+62) 21-1234-5678",
      status: "Inactive",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {},
  };

  return (
    <div className="p-1">
      <div className="flex justify-between">
        <div className="flex">
          <Navigate title={"User Report"} />
          <h1 className="pl-2 font-semibold text-xl">{`(110)`}</h1>
        </div>
        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          className="w-64 px-4 py-2 rounded-lg bg-white"
        />
      </div>

      <div className="p-2">
        <div className="rounded-md overflow-hidden">
          <Table
            columns={columns}
            dataSource={data}
            rowSelection={rowSelection}
            pagination={false}
            rowClassName="border-b border-gray-200"
            scroll={{ x: 800 }}
          />
        </div>
      </div>
      <ReplyUser
        setOpenAddModal={setOpenAddModal}
        openAddModal={openAddModal}
      ></ReplyUser>
    </div>
  );
};

export default UserReport;
