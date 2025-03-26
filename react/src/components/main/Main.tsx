import UserProvider from "./contex";
import AvatarName from "../user/AvatarName";
import Registration from "../user/Registration";

export default function Main() {
    return (<>
        <UserProvider>          
            <AvatarName></AvatarName>
            <Registration></Registration>
        </UserProvider>
    </>)
}