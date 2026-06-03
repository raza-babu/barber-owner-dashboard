import { Navigate } from '../../Navigate';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AddLunchModal from '../../components/modal/AddLunchModal';
import LunchTable from './LunchTable';
import { useGetLunchSchedulesQuery } from '../redux/api/manageApi';

dayjs.extend(customParseFormat);

const Lunch = () => {
    //   const [data, setData] = useState([
    //     { id: 1, date: '2026-06-03', startTime: '01:00 PM', endTime: '02:00 PM' }
    //   ]);

    const { data, isLoading } = useGetLunchSchedulesQuery(undefined);
    const lunchSchedules = data?.data || [];



    return (
        <div className="bg-white p-3 h-[87vh]">
            <div className="flex justify-between items-center mb-4">
                <Navigate title="Lunch Time" />
                <AddLunchModal />
            </div>
            <LunchTable lunchSchedules={lunchSchedules} />
        </div>
    );
};

export default Lunch;
