import { Navigate } from '../../Navigate';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AddLunchModal from '../../components/modal/AddLunchModal';
import LunchTable from './LunchTable';
import { useGetLunchSchedulesQuery } from '../redux/api/manageApi';

dayjs.extend(customParseFormat);

const Lunch = () => {
    const { data, isLoading, isFetching } = useGetLunchSchedulesQuery(undefined);
    const lunchSchedules = data?.data || [];



    return (
        <div className="bg-white p-3 h-[87vh]">
            <div className="flex justify-between items-center mb-4">
                <Navigate title="Lunch Time" />
                <AddLunchModal />
            </div>
            <LunchTable
                lunchSchedules={lunchSchedules}
                loading={isLoading || isFetching}
            />
        </div>
    );
};

export default Lunch;
