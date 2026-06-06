import { createBrowserRouter } from "react-router-dom";
import DashboardLayout from "../layout/dashboardLayout/DashboardLayout";
import Dashboard from "../components/Dashboard/Dashboard";
import Profile from "../page/Settings/Profile";
import TermsCondition from "../page/Settings/TermsCondition";
import FAQ from "../page/Settings/FAQ";
import PrivacyPolicy from "../page/Settings/PrivacyPolicy";
import ForgetPass from "../Auth/ForgetPass";
import Verify from "../Auth/Verify";
import ResetPass from "../Auth/ResetPass";
import Notification from "../page/Notification/Notification";
import About from "../page/Settings/About";
import Login from "../Auth/Login";
import BarberOwner from "../page/barberOwner/BarberOwner";
import { Barber } from "../page/barber/Barber";
import Customer from "../page/customer/Customer";
import BarberDetailsPage from "../page/barber/BarberDetailsPage";
import { BarberOwnerDetails } from "../page/barberOwner/BarberOwnerDetails";
import UserReport from "../page/userReport/UserReport";
import AllShopRegistration from "../components/Dashboard/AllShopRegistration";
import Support from "../page/support/Support";
import BookHistory from "../page/bookHistory/BookHistory";
import { Transaction } from "../page/transaction/Transaction";
import Services from "../page/services/Services";
import ChatBox from "../page/chat/ChatBox";
import ShedualManagement from "../page/shedualManagement/ShedualManagement";
import BookingManagement from "../page/shedualManagement/BookingManagement";
import { SocketProvider } from "../context/ContextProvider";
import ProtectedRoute from "../protectedRoute/ProtectedRoute";
import Schedule from "../page/schedule/Schedule";
import ScheduleDetails from "../page/schedule/ScheduleDetails";
import Application from "../page/application/Application";
import Lunch from "../page/lunch/Lunch";
import BreakTime from "../page/BreakTime/BreakTime";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <SocketProvider>
          <DashboardLayout></DashboardLayout>
        </SocketProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/dashboard/barberOwner",
        element: <BarberOwner></BarberOwner>,
      },
      {
        path: "/dashboard/allShop",
        element: <AllShopRegistration></AllShopRegistration>,
      },
      {
        path: "/dashboard/barberOwner/barberDetails",
        element: <BarberOwnerDetails></BarberOwnerDetails>,
      },
      {
        path: "/dashboard/customer",
        element: <Customer></Customer>,
      },
      {
        path: "/dashboard/userReport",
        element: <UserReport></UserReport>,
      },

      {
        path: "/dashboard/barber",
        element: <Barber></Barber>,
      },
      {
        path: "/dashboard/applications",
        element: <Application />,
      },
      {
        path: "/dashboard/bookingHistory",
        element: <BookHistory></BookHistory>,
      },
      {
        path: "/dashboard/bookingHistory/chat/:id",
        element: <ChatBox></ChatBox>,
      },
      {
        path: "/dashboard/services",
        element: <Services></Services>,
      },
      {
        path: "/dashboard/schedualManagement",
        element: <ShedualManagement></ShedualManagement>,
      },
      {
        path: "/dashboard/schedualDate/schedulaeDateDetails/:id",
        element: <ScheduleDetails></ScheduleDetails>,
      },
      {
        path: "/dashboard/schedualDate",
        element: <Schedule></Schedule>,
      },
      {
        path: "/dashboard/schedualManagement/bookingManagement/:id",
        element: <BookingManagement></BookingManagement>,
      },
      {
        path: "/dashboard/transaction",
        element: <Transaction></Transaction>,
      },
      {
        path: "/dashboard/barber/barberDetails/:id",
        element: <BarberDetailsPage></BarberDetailsPage>,
      },

      {
        path: "/dashboard/support",
        element: <Support></Support>,
      },
      {
        path: "/dashboard/Settings/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/dashboard/Settings/profile",
        element: <Profile></Profile>,
      },
      {
        path: "/dashboard/Settings/lunch",
        element: <Lunch></Lunch>,
      },
      {
        path: "/dashboard/Settings/breaks",
        element: <BreakTime></BreakTime>,
      },
      {
        path: "/dashboard/Settings/notification",
        element: <Notification></Notification>,
      },
      {
        path: "/dashboard/Settings/Terms&Condition",
        element: <TermsCondition></TermsCondition>,
      },
      {
        path: "/dashboard/Settings/FAQ",
        element: <FAQ></FAQ>,
      },
      {
        path: "/dashboard/Settings/aboutUs",
        element: <About></About>,
      },
      {
        path: "/dashboard/Settings/PrivacyPolicy",
        element: <PrivacyPolicy></PrivacyPolicy>,
      }
    ],
  },

  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/forgetpassword",
    element: <ForgetPass></ForgetPass>,
  },
  {
    path: "/verify",
    element: <Verify></Verify>,
  },
  {
    path: "/reset",
    element: <ResetPass></ResetPass>,
  },
]);
