import { createBrowserRouter } from "react-router";
import Login from "./components/user/Login";
import AppLayout from "./components/main/AppLayout";
import ResetPasswordPage from "./components/user/ResetPasswordPage";
import ProtectedRoute from "./components/user/ProtectedRoute";
import EmployeeManagement from "./components/user/EmployeeManagement";
import Temp from "./components/students/Table";
import StudentsTable from "./components/students/Table";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/reset-password", element: <ResetPasswordPage /> },

  {
    path: "/main",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "users",
        element: (
          <ProtectedRoute>
            <EmployeeManagement  />
          </ProtectedRoute>
        ),
      },
      {
        path: "students",
        element: (
          <ProtectedRoute>
            <Temp />
          </ProtectedRoute>
        ),
      },
      {
        path: "students/status/true",
        element: (
          <ProtectedRoute>
            <StudentsTable />
          </ProtectedRoute>
        ),
      },
      {
        path: "students/course/:groupId",
        element: (
          <ProtectedRoute>
            <StudentsTable />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);