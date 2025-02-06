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
exports.BookService = void 0;
const inversify_1 = require("inversify");
const Elasticsearch_1 = __importDefault(require("../Config/Elasticsearch"));
let BookService = class BookService {
    constructor(bookRepository) {
        this.bookRepository = bookRepository;
    }
    async createBook(data, filename) {
        const { title, author, publicationYear, isbn, description } = data;
        if (!title || !author || !publicationYear || !isbn || !filename) {
            throw new Error("All required fields, including the image filename, must be provided");
        }
        const book = await this.bookRepository.createBook({
            title,
            author,
            publicationYear,
            isbn,
            description,
            image: filename,
        });
        await Elasticsearch_1.default.index({
            index: "books",
            id: book._id.toString(),
            body: {
                title,
                author,
                publicationYear,
                isbn,
                description,
            },
        });
        return book;
    }
    async getAllBooks() {
        return this.bookRepository.getAllBooks();
    }
    async getBookById(id) {
        const book = await this.bookRepository.getBookById(id);
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    }
    async updateBook(id, data, filename) {
        if (filename) {
            data.image = filename;
        }
        const updatedBook = await this.bookRepository.updateBook(id, data);
        if (!updatedBook) {
            throw new Error("Book not found");
        }
        await Elasticsearch_1.default.update({
            index: "books",
            id: id,
            body: {
                doc: data,
            },
        });
        return updatedBook;
    }
    async deleteBook(id) {
        const deletedBook = await this.bookRepository.deleteBook(id);
        if (!deletedBook) {
            throw new Error("Book not found");
        }
        await Elasticsearch_1.default.delete({
            index: "books",
            id: id,
        });
        return deletedBook;
    }
};
exports.BookService = BookService;
exports.BookService = BookService = __decorate([
    (0, inversify_1.injectable)(),
    __param(0, (0, inversify_1.inject)("IBookRepository")),
    __metadata("design:paramtypes", [Object])
], BookService);
