import { createBrowserRouter } from "react-router";
import About from "./components/main/Main";
import store from "./components/recipe/recipeStor";
import { Provider } from "react-redux";
import AddRecipes from "./components/recipe/AddRecipes";
import All from "./components/recipe/SeeRecipes";
import Login from "./components/user/Login";
import AppLayout from "./components/main/AppLayout";
import StudentDatabase from "./components/students/StudentDatabase";
import RegisteredStudents from "./components/students/RegisteredStudents";
import StudentEditCard from "./components/students/StudentEditCard";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> },

  {
    path: "/main",
    element: <AppLayout />,
    children: [
      { path: "about", element: <About /> },
      { path: "studentDatebase", element: <StudentDatabase /> },
      { path: "edit-student/:id", element: <StudentEditCard /> },
      { path: "registedStudent", element: <RegisteredStudents students={[]} registeredStudents={undefined} /> },
      { path: "recipes", element: <All /> },
      { path: "addrecipes", element: <Provider store={store}><AddRecipes /></Provider> },
    ],
  },
]);
