"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserModel_1 = __importDefault(require("../Models/UserModel"));
class UserRepository {
    async findUserByEmail(email) {
        return await UserModel_1.default.findOne({ email });
    }
    async saveUser(userData) {
        const user = new UserModel_1.default(userData);
        return await user.save();
    }
    async findUserByResetToken(resetToken) {
        return await UserModel_1.default.findOne({
            resetPasswordToken: resetToken,
            resetPasswordExpires: { $gt: Date.now() },
        });
    }
    async updateUser(userId, updates) {
        return await UserModel_1.default.findByIdAndUpdate(userId, updates, { new: true });
    }
    async findUserById(userId) {
        return await UserModel_1.default.findById(userId);
    }
}
exports.default = new UserRepository();
