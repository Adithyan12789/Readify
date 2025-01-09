"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BookRepository_1 = __importDefault(require("../Repositories/BookRepository"));
const Elasticsearch_1 = __importDefault(require("../Config/Elasticsearch"));
class BookService {
    async createBook(data, filename) {
        const { title, author, publicationYear, isbn, description } = data;
        if (!title || !author || !publicationYear || !isbn || !filename) {
            throw new Error("All required fields, including the image filename, must be provided");
        }
        const book = await BookRepository_1.default.createBook({
            title,
            author,
            publicationYear,
            isbn,
            description,
            image: filename,
        });
        await Elasticsearch_1.default.index({
            index: "books", // The index to store the book record in
            id: book._id.toString(), // Use the MongoDB _id as Elasticsearch document ID
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
        return BookRepository_1.default.getAllBooks();
    }
    async getBookById(id) {
        const book = await BookRepository_1.default.getBookById(id);
        if (!book) {
            throw new Error("Book not found");
        }
        return book;
    }
    async updateBook(id, data, filename) {
        if (filename) {
            data.image = filename;
        }
        const updatedBook = await BookRepository_1.default.updateBook(id, data);
        if (!updatedBook) {
            throw new Error("Book not found");
        }
        // Update the book in Elasticsearch
        await Elasticsearch_1.default.update({
            index: "books",
            id: id,
            body: {
                doc: data, // Only update fields that have changed
            },
        });
        return updatedBook;
    }
    async deleteBook(id) {
        const deletedBook = await BookRepository_1.default.deleteBook(id);
        if (!deletedBook) {
            throw new Error("Book not found");
        }
        await Elasticsearch_1.default.delete({
            index: "books",
            id: id,
        });
        return deletedBook;
    }
}
exports.default = new BookService();
