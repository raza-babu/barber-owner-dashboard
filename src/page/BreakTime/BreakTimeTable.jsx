import React from 'react';
import { Table } from 'antd';
import EditBreakModal from '../../components/modal/EditBreakModal';
import DeleteBreakModal from '../../components/modal/DeleteBreakModal';

const BreakTimeTable = ({ breakTimes, loading }) => {
  const columns = [
    {
      title: 'SI No',
      dataIndex: 'id',
      key: 'id',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Barber',
      key: 'barber',
      render: (_, record) => (
        <div className="flex items-center gap-2">
          {record.barberImage ? (
            <img
              src={record.barberImage}
              alt="Barber"
              style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
          ) : null}
          <span>{record.barberName}</span>
        </div>
      ),
    },
    {
      title: 'Barber Email',
      dataIndex: 'barberEmail',
      key: 'barberEmail',
    },
    {
      title: 'Barber Phone',
      dataIndex: 'barberPhone',
      key: 'barberPhone',
    },
    {
      title: 'Date',
      dataIndex: 'startedAt',
      key: 'date',
      render: (date) => <span>{date?.split('T')[0]}</span>,
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      key: 'startTime',
    },
    {
      title: 'End Time',
      dataIndex: 'endTime',
      key: 'endTime',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <div className="flex gap-2">
          <EditBreakModal record={record} />
          <DeleteBreakModal breakId={record.id} />
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={breakTimes}
      rowKey="id"
      pagination={false}
      loading={loading}
    />
  );
};

export default BreakTimeTable;
