import type { IActionResult, IUser } from '@/types'

export interface IUserRepository {
    findAll(): IUser[]
    findById(id: string): IUser | undefined
    create(values: Partial<IUser>): IActionResult<IUser>
    update(id: string, values: Partial<IUser>): IActionResult<IUser>
    delete(id: string): IActionResult
}
