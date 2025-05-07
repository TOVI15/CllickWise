import AvatarName from "../user/AvatarName";
import UserProvider from "./contexUser";

export default function Main() {
    return (<>
        <UserProvider>          
            <AvatarName></AvatarName>
        </UserProvider>
    </>)
}