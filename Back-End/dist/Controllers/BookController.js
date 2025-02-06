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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookController = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const inversify_1 = require("inversify");
let BookController = class BookController {
    constructor(bookService) {
        this.bookService = bookService;
        this.createBook = (0, express_async_handler_1.default)(async (req, res) => {
            try {
                const bookData = req.body;
                const image = req.file;
                if (!image) {
                    throw new Error("Image is required");
                }
                const filename = image.filename;
                const book = await this.bookService.createBook(bookData, filename);
                res.status(201).json(book);
            }
            catch (error) {
                res.status(400).json({ message: error });
            }
        });
        this.getAllBooks = (0, express_async_handler_1.default)(async (req, res) => {
            try {
                const books = await this.bookService.getAllBooks();
                res.status(200).json(books);
            }
            catch (error) {
                res.status(500).json({ message: "Internal server error" });
            }
        });
        this.getBookById = (0, express_async_handler_1.default)(async (req, res) => {
            try {
                const bookId = req.params.id;
                const book = await this.bookService.getBookById(bookId);
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
                const updatedBook = await this.bookService.updateBook(bookId, data, filename);
                res.status(200).json(updatedBook);
            }
            catch (error) {
                res.status(500).json({ message: "Failed to update book", error });
            }
        });
        this.deleteBook = (0, express_async_handler_1.default)(async (req, res) => {
            try {
                await this.bookService.deleteBook(req.params.id);
                res.status(200).json({ message: "Book deleted successfully" });
            }
            catch (error) {
                res.status(404).json({ message: error });
            }
        });
    }
};
exports.BookController = BookController;
exports.BookController = BookController = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IBookService")),
    __metadata("design:paramtypes", [Object])
], BookController);
