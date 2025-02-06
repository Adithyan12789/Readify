import type { IUser } from "../../Types/UserTypes"

export interface IUserRepository {
  findUserByEmail(email: string): Promise<IUser | null>
  findUserById(userId: string): Promise<IUser | null>
  saveUser(userData: IUser): Promise<IUser | null>
  findUserByResetToken(resetToken: string): Promise<IUser | null>
  updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null>
  createUser(userData: Partial<IUser>): Promise<IUser>
}
