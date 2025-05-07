import './App.css'
import UserProvider from './components/main/contexUser';
import { router } from './Router'
import { RouterProvider } from "react-router";

function App() {
  return (
    <>
     <UserProvider>
     <RouterProvider router={router} />
    </UserProvider>
    </>
  )
}
export default App
