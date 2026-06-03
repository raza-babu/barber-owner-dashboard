import { Table } from "antd";
import EditLunchModal from "../../components/modal/EditLunchModal";
import DeleteLunchModal from "../../components/modal/DeleteLunchModal";

const LunchTable = ({ lunchSchedules, loading }) => {

    // Columns for the table
    const columns = [
        {
            title: 'SI No',
            dataIndex: 'id',
            key: 'id',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Date',
            dataIndex: 'startedAt',
            key: 'date',
            render: (date) => <span>{date?.split('T')[0]}</span>
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
                    <EditLunchModal record={record} />
                    <DeleteLunchModal lunchId={record.id} />
                </div>
            ),
        },
    ];


    return (
        <>

            <Table
                columns={columns}
                dataSource={lunchSchedules}
                rowKey="id"
                pagination={false}
                loading={loading}
            />
        </>
    )
}

export default LunchTable