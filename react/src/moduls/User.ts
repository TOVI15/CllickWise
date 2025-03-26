export type typeUser = {
  id?: number,
  firstName?: string,
  lastName?: string,
  email?: string,
  password?: string,
  phone?: string,
  address?: string
}

export type Action = {
  type: 'Create_User',
  data: Omit<typeUser, 'id'>
} | {
  type: 'Delete_User',
  id: number
} | {
  type: 'UpDate_User',
  data: Partial<typeUser>
}

export default (state: typeUser, action: Action): typeUser => {
  switch (action.type) {
    case 'Create_User':
      (action.data)
      return { ...state, ...action.data }
    case 'UpDate_User':
      return { ...state, ...action.data };
    case 'Delete_User':
      return {} as typeUser;
    default:
      return state
  }
}


