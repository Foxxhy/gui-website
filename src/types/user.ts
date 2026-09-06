import type { IMedia } from './media'

export enum IRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  BLOCKED = 'blocked',
}

export interface IUser {
  id: string
  name: string
  email: string
  pseudonym: string
  role: IRole
  avatar?: IMedia
  createdAt: string
  updatedAt: string
}

export interface IUserCredentials {
  userId: string
  login: string
  passwordHash: string
}

export interface IUserRepository {
  findUserById: (id: string) => Promise<IUser | undefined>
  findUsers: () => Promise<IUser[]>
  findAccountByLogin: (login: string) => Promise<IUserCredentials | undefined>
  findAccountByUserId: (userId: string) => Promise<IUserCredentials | undefined>
  updatePasswordHash: (userId: string, passwordHash: string) => Promise<boolean>
  createUser: (user: IUser) => Promise<IUser>
  updateUser: (id: string, values: Partial<IUser>) => Promise<IUser | undefined>
  deleteUser: (id: string) => Promise<boolean>
}
