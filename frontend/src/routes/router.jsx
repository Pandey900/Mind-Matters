// routers.jsx
import { createBrowserRouter } from "react-router-dom";
import Mainlayout from "../layout/MainLayout";
import Home from "../pages/Home/Home";
import Instructors from "../pages/Instructors/Instructors";
import Classes from "../pages/Classes/Classes";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import SingleClass from "../pages/Classes/SingleClass";
import DashboardLayout from "../layout/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import StudentCP from "../pages/Dashboard/Student/StudentCP";
import EnrolledClasses from "../pages/Dashboard/Student/Enroll/EnrolledClasses";
import SelectedClasses from "../pages/Dashboard/Student/SelectedClasses";
import PaymentHistory from "../pages/Dashboard/Student/Payment/History/PaymentHistory";
import AsInstructor from "../pages/Dashboard/Student/Apply/AsInstructor";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Mainlayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "instructors",
        element: <Instructors />,
      },
      {
        path: "classes",
        element: <Classes />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/class/:id",
        element: <SingleClass />,
        loader: ({ params }) =>
          fetch(`http://localhost:3000/class/${params.id}`),
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      // Students Routes
      {
        path: "student-cp",
        element: <StudentCP />,
      },
      {
        path: "enrolled-class",
        element: <EnrolledClasses />,
      },
      {
        path: "my-selected",
        element: <SelectedClasses />,
      },
      {
        path: "my-payments",
        element: <PaymentHistory />,
      },
      {
        path: "apply-instructor",
        element: <AsInstructor />,
      },
    ],
  },
]);
