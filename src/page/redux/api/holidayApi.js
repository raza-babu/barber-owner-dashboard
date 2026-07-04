import TagTypes from "../../../constants/tayType.constant";
import { baseApi } from "./baseApi";

const holidayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHolidays: builder.query({
      query: () => {
        return {
          url: "/barber-holidays",
          method: "GET",
        };
      },
      providesTags: [TagTypes.holidays],
    }),
    addHoliday: builder.mutation({
      query: (data) => {
        return {
          url: "/barber-holidays",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TagTypes.holidays],
    }),
    updateHoliday: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/barber-holidays/${id}`,
          method: "PATCH",
          body: data,
        };
      },
      invalidatesTags: [TagTypes.holidays],
    }),
    deleteHoliday: builder.mutation({
      query: (id) => {
        return {
          url: `/barber-holidays/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TagTypes.holidays],
    }),
  }),
});

export const {
  useGetHolidaysQuery,
  useAddHolidayMutation,
  useUpdateHolidayMutation,
  useDeleteHolidayMutation,
} = holidayApi;
