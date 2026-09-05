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
