export type typeUser = {
  id: number,
  name: string,
  email: string,
  password: string,
  phone: string,
  address: string,
  token: string,
  role: string,
  isActive: boolean,
  identity: string, 
}

export type Action = 
  | { type: 'Create_User', data: typeUser }  
  | { type: 'Delete_User', id: number }
  | { type: 'UpDate_User', data: Partial<typeUser> };

export const initialUserState: typeUser = {
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

export default function UserReducer(state: typeUser, action: Action): typeUser {
  switch (action.type) {
    case 'Create_User':
      return { ...state, ...action.data };
    case 'UpDate_User':
      return { ...state, ...action.data };
    case 'Delete_User':
      return initialUserState;
    default:
      return state;
  }
}
