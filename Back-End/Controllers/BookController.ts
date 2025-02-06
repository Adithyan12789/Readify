import asyncHandler from "express-async-handler"
import type { Request, Response } from "express"
import { inject, injectable } from "inversify"
import type { IBookService } from "../Interface/IBook/IService"

@injectable()
export class BookController {
  constructor(
    @inject("IBookService") private readonly bookService: IBookService
  ) {}

  createBook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const bookData = req.body
      const image = req.file

      if (!image) {
        throw new Error("Image is required")
      }

      const filename = image.filename

      const book = await this.bookService.createBook(bookData, filename)

      res.status(201).json(book)
    } catch (error) {
      res.status(400).json({ message: error })
    }
  })

  getAllBooks = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const books = await this.bookService.getAllBooks()
      res.status(200).json(books)
    } catch (error) {
      res.status(500).json({ message: "Internal server error" })
    }
  })

  getBookById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const bookId = req.params.id

      const book = await this.bookService.getBookById(bookId)
      res.status(200).json(book)
    } catch (error) {
      res.status(404).json({ message: error })
    }
  })

  updateBook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const bookId = req.params.id
      const data = req.body
      const image = req.file
      const filename = image?.filename

      const updatedBook = await this.bookService.updateBook(bookId, data, filename)
      res.status(200).json(updatedBook)
    } catch (error) {
      res.status(500).json({ message: "Failed to update book", error })
    }
  })

  deleteBook = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      await this.bookService.deleteBook(req.params.id)
      res.status(200).json({ message: "Book deleted successfully" })
    } catch (error) {
      res.status(404).json({ message: error })
    }
  })
}

