import { createContext, useReducer, Dispatch } from "react";
import User, { Action, typeUser } from "../../moduls/User";

export const UserContext = createContext<{
    state: typeUser;
    dispatch: Dispatch<Action>;
} | undefined>(undefined);

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const initialState: typeUser = {
        id: 0,
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        token: "",
        role: "",
        isActive: false,
        identity: ""
    };
    const [state, dispatch] = useReducer(User, initialState);

    return (
        <UserContext value={{ state, dispatch }}>
          {children}
        </UserContext>
    );
}