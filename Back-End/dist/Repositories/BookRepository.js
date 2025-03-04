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
exports.BookRepository = void 0;
const inversify_1 = require("inversify");
const BaseRepository_1 = require("./Base/BaseRepository");
const BookModel_1 = __importDefault(require("../Models/BookModel"));
let BookRepository = class BookRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(BookModel_1.default);
    }
    async createBook(data) {
        return BookModel_1.default.create(data);
    }
    async getAllBooks() {
        return BookModel_1.default.find();
    }
    async getBookById(id) {
        return BookModel_1.default.findById(id);
    }
    async updateBook(id, data) {
        return BookModel_1.default.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    }
    async deleteBook(id) {
        return BookModel_1.default.findByIdAndDelete(id);
    }
};
exports.BookRepository = BookRepository;
exports.BookRepository = BookRepository = __decorate([
    (0, inversify_1.injectable)(),
    __metadata("design:paramtypes", [])
], BookRepository);
