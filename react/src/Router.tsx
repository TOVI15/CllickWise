import { createBrowserRouter } from "react-router";
import About from "./components/main/Main";
import store from "./components/recipe/recipeStor";
import { Provider } from "react-redux";
import AddRecipes from "./components/recipe/AddRecipes";
import All from "./components/recipe/SeeRecipes";
import Login from "./components/user/Login";
import AppLayout from "./components/main/AppLayout";
import RegisteredStudents from "./components/students/RegisteredStudents";
import StudentEditCard from "./components/students/StudentEditCard";
import StudentDatabase from "./components/students/StudentDatabase";
import StudentsTable from "./components/students/StudentTable";

export const router = createBrowserRouter([

  
  { path: "/", element: <Login /> },

  {
    path: "/main",
    element: <AppLayout />,
    children: [
      { path: "about", element: <About /> },
      { path: "students", element: <StudentsTable/> },
      { path: "students/status/true", element: <StudentsTable/> },
      { path: "students/course/1", element: <StudentsTable/> },
      { path: "students/course/2", element: <StudentsTable/> },
      { path: "students/course/3", element: <StudentsTable/> },   
      { path: "edit-student/:id", element: <StudentEditCard /> },
      { path: "registedStudent", element: <RegisteredStudents  /> },
      { path: "studentDetails", element: <StudentDatabase  /> },
      { path: "recipes", element: <All /> },
      { path: "addrecipes", element: <Provider store={store}><AddRecipes /></Provider> },
    ],
  },
]);
