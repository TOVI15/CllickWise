import { createContext, useReducer, Dispatch, useEffect, useState } from "react";
import UserReducer, { Action, initialUserState, typeUser } from "../../moduls/User";

export const UserContext = createContext<{
  state: typeUser;
  dispatch: Dispatch<Action>;
  isLoaded: boolean;
} | undefined>(undefined);

export default function UserProvider({ children }: { children: React.ReactNode }) {
    const storedUser = localStorage.getItem("user");
    const parsedUser = storedUser ? JSON.parse(storedUser) : initialUserState;
  
    // 2. אתחול הדינאמי
    const [state, dispatch] = useReducer(UserReducer, parsedUser);
    const [isLoaded, setIsLoaded] = useState(false);
  
    useEffect(() => {
      setIsLoaded(true); 
    }, []);
  
    useEffect(() => {
      if (state.token) {
        localStorage.setItem("user", JSON.stringify(state));
      } else {
        localStorage.removeItem("user");
      }
    }, [state]);

  return (
    <UserContext.Provider value={{ state, dispatch, isLoaded }}>
      {children}
    </UserContext.Provider>
  );
}
