import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import BookService from "../Services/BookService";
import path from "path";

class BookController {
  createBook = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
  
      try {
        const bookData = req.body;
        const image = req.file;
  
        if (!image) {
          throw new Error("Image is required");
        }

        let filename = image.filename;
  
        const book = await BookService.createBook(bookData, filename);
  
        res.status(201).json(book);
      } catch (error) {
        res.status(400).json({ message: error });
      }
    }
  );  
  
  getAllBooks = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        const books = await BookService.getAllBooks();
        res.status(200).json(books);
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
    }
  );

  getBookById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        let bookId = req.params.id;

        const book = await BookService.getBookById(bookId);
        res.status(200).json(book);
      } catch (error) {
        res.status(404).json({ message: error });
      }
    }
  );

  updateBook = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {

      try {
        const bookId = req.params.id;
        const data = req.body;
        const image = req.file;
        const filename = image?.filename;
  
        const updatedBook = await BookService.updateBook(bookId, data, filename);
        if (!updatedBook) {
          res.status(404).json({ message: "Book not found" });
          return;
        }
  
        res.status(200).json(updatedBook);
      } catch (error) {
        res.status(500).json({ message: "Failed to update book", error });
      }
    }
  );  

  deleteBook = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      try {
        await BookService.deleteBook(req.params.id);
        res.status(200).json({ message: "Book deleted successfully" });
      } catch (error) {
        res.status(404).json({ message: error });
      }
    }
  );
}

export default new BookController();
