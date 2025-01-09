"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const BookService_1 = __importDefault(require("../Services/BookService"));
class BookController {
    constructor() {
        this.createBook = (0, express_async_handler_1.default)(async (req, res) => {
            try {
                const bookData = req.body;
                const image = req.file;
                if (!image) {
                    throw new Error("Image is required");
                }
                let filename = image.filename;
                const book = await BookService_1.default.createBook(bookData, filename);
                res.status(201).json(book);
            }
            catch (error) {
                res.status(400).json({ message: error });
            }
        });
        this.getAllBooks = (0, express_async_handler_1.default)(async (req, res) => {
            try {
                const books = await BookService_1.default.getAllBooks();
                res.status(200).json(books);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
        this.getBookById = (0, express_async_handler_1.default)(async (req, res) => {
            try {
                let bookId = req.params.id;
                const book = await BookService_1.default.getBookById(bookId);
                res.status(200).json(book);
            }
            catch (error) {
                res.status(404).json({ message: error });
            }
        });
        this.updateBook = (0, express_async_handler_1.default)(async (req, res) => {
            try {
                const bookId = req.params.id;
                const data = req.body;
                const image = req.file;
                const filename = image?.filename;
                console.log("bookId: ", bookId);
                console.log("data: ", data);
                console.log("image: ", image);
                console.log("filename: ", filename);
                const updatedBook = await BookService_1.default.updateBook(bookId, data, filename);
                if (!updatedBook) {
                    res.status(404).json({ message: "Book not found" });
                    return;
                }
                res.status(200).json(updatedBook);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to update book", error });
            }
        });
        this.deleteBook = (0, express_async_handler_1.default)(async (req, res) => {
            try {
                await BookService_1.default.deleteBook(req.params.id);
                res.status(200).json({ message: "Book deleted successfully" });
            }
            catch (error) {
                res.status(404).json({ message: error });
            }
        });
    }
}
exports.default = new BookController();
