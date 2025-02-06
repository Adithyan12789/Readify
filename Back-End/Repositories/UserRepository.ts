import User from "../Models/UserModel"
import type { IUser } from "../Types/UserTypes"
import { injectable } from "inversify"
import type { IUserRepository } from "../Interface/IUser/IRepository"
import { BaseRepository } from "./Base/BaseRepository";

@injectable()
export class UserRepository
  extends BaseRepository<IUser>
  implements IUserRepository
{
  private readonly userModel = User;

  constructor() {
    super(User);
  }
  
  public async findUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email })
  }

  public async findUserById(userId: string): Promise<IUser | null> {
    return await User.findById(userId)
  }

  public async saveUser(userData: IUser): Promise<IUser | null> {
    if (userData._id) {
      return await User.findByIdAndUpdate(userData._id, userData, { new: true })
    } else {
      const user = new User(userData)
      return await user.save()
    }
  }

  public async findUserByResetToken(resetToken: string): Promise<IUser | null> {
    return await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpires: { $gt: Date.now() },
    })
  }

  public async updateUser(userId: string, updates: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(userId, updates, { new: true })
  }

  public async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData)
    return await user.save()
  }
}

