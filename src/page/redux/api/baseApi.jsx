import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
//sdf
const baseQuery = fetchBaseQuery({
  baseUrl: "https://backend.barberstime.com/api/v1",
  // prepareHeaders: (headers) => {
  //   const token = JSON.parse(localStorage.getItem("accessToken"));
  //   if (token) {
  //     headers.set("Authorization", `${token}`);
  //   }
  //   return headers;
  // },
  prepareHeaders: (headers, { getState }) => {
    const token = getState().logInUser.token;
    
    if (token) {
      headers.set("authorization", `${token}`);
    }
    return headers;
  },
});


export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQuery,
  tagTypes: ["overview", "host"],
  endpoints: () => ({}),
});


export const SOCKET_BASE = "https://backend.barberstime.com";
// asdfsf