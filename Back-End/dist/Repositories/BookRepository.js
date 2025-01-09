"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BookModel_1 = __importDefault(require("../Models/BookModel"));
class BookRepository {
    createBook(data) {
        return BookModel_1.default.create(data);
    }
    getAllBooks() {
        return BookModel_1.default.find();
    }
    getBookById(id) {
        return BookModel_1.default.findById(id);
    }
    updateBook(id, data) {
        return BookModel_1.default.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true });
    }
    deleteBook(id) {
        return BookModel_1.default.findByIdAndDelete(id);
    }
}
exports.default = new BookRepository();
