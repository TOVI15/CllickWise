import { createBrowserRouter } from "react-router";
import About from "./components/main/Main";
import store from "./components/recipe/recipeStor";
import { Provider } from "react-redux";
import AddRecipes from "./components/recipe/AddRecipes";
import All from "./components/recipe/SeeRecipes";
import Login from "./components/user/Login";
import AppLayout from "./components/main/AppLayout";

export const router = createBrowserRouter([
  { path: "/", element: <Login /> }, 

  {
    path: "/main",
    element: <AppLayout/>, 
    children: [
      { path: "about", element: <About /> },
      { path: "recipes", element: <All /> },
      { path: "addrecipes", element: <Provider store={store}><AddRecipes /></Provider> },
    ],
  },
]);
