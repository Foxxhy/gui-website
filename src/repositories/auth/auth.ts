import type { IAccount, IUser } from '@/types'

export interface IAuthRepository {
    findAccountByLogin(login: string): IAccount | undefined
    findUserById(id: string): IUser | undefined
}
