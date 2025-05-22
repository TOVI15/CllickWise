import { createBrowserRouter } from "react-router";
import Login from "./components/user/Login";
import AppLayout from "./components/main/AppLayout";
import StudentsTable from "./components/students/StudentTable";
import ResetPasswordPage from "./components/user/ResetPasswordPage";
import ProtectedRoute from "./components/user/ProtectedRoute";
import EmployeeManagement from "./components/user/EmployeeManagement";

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
            <StudentsTable />
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