"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const UserModel_1 = __importDefault(require("../Models/UserModel"));
const inversify_1 = require("inversify");
const BaseRepository_1 = require("./Base/BaseRepository");
let UserRepository = class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(UserModel_1.default);
        this.userModel = UserModel_1.default;
    }
    async findUserByEmail(email) {
        return await UserModel_1.default.findOne({ email });
    }
    async findUserById(userId) {
        return await UserModel_1.default.findById(userId);
    }
    async saveUser(userData) {
        if (userData._id) {
            return await UserModel_1.default.findByIdAndUpdate(userData._id, userData, { new: true });
        }
        else {
            const user = new UserModel_1.default(userData);
            return await user.save();
        }
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
    async createUser(userData) {
        const user = new UserModel_1.default(userData);
        return await user.save();
    }
};
exports.UserRepository = UserRepository;
exports.UserRepository = UserRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], UserRepository);
