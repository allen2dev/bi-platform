export interface User {
  id: string
  name: string
  avatar?: string
}

export interface Permission {
  id: string
  code: string
}

export interface LoginCredentials {
  username: string
  password: string
}
