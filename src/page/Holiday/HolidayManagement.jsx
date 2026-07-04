import { Navigate } from "../../Navigate";
import AddHolidayModal from "../../components/modal/AddHolidayModal";
import HolidayTable from "./HolidayTable";
import { useGetHolidaysQuery } from "../redux/api/holidayApi";

const HolidayManagement = () => {
  const { data, isLoading, isFetching } = useGetHolidaysQuery(undefined);
  const holidays = data?.data || [];

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm min-h-[85vh]">
      <div className="flex justify-between items-center mb-6">
        <Navigate title="Holiday Management" />
        <AddHolidayModal />
      </div>
      
      <div className="mt-4">
        <HolidayTable
          holidays={holidays}
          loading={isLoading || isFetching}
        />
      </div>
    </div>
  );
};

export default HolidayManagement;
