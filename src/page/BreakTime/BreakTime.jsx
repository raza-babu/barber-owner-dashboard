import { Navigate } from '../../Navigate';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import AddBreakModal from '../../components/modal/AddBreakModal';
import BreakTimeTable from './BreakTimeTable';
import { useGetBreakTimesQuery } from '../redux/api/manageApi';

dayjs.extend(customParseFormat);

const BreakTime = () => {
  const { data, isLoading, isFetching } = useGetBreakTimesQuery(undefined);
  const breakTimes = data?.data || [];

  return (
    <div className="bg-white p-3 h-[87vh]">
      <div className="flex justify-between items-center mb-4">
        <Navigate title="Break Times" />
        <AddBreakModal />
      </div>
      <BreakTimeTable breakTimes={breakTimes} loading={isLoading || isFetching} />
    </div>
  );
};

export default BreakTime;
