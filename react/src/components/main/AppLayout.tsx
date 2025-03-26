import { Outlet } from "react-router"
import Bar from "./Bar"
import Main from "./Main"
// import Login from "../user/Login"

const AppLayout = () => {
    return (<>
        <Main />
        <Bar />
        <Outlet />
    </>)
}

export default AppLayout