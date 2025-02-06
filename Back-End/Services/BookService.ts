import { inject, injectable } from "inversify"
import type { IBookService } from "../Interface/IBook/IService"
import type { IBookRepository } from "../Interface/IBook/IRepository"
import client from "../Config/Elasticsearch"
import type { IBook } from "../Types/UserTypes"

@injectable()
export class BookService implements IBookService {
  constructor(
    @inject("IBookRepository") private bookRepository: IBookRepository
  ) {}

  async createBook(data: any, filename: string): Promise<IBook> {
    const { title, author, publicationYear, isbn, description } = data

    if (!title || !author || !publicationYear || !isbn || !filename) {
      throw new Error("All required fields, including the image filename, must be provided")
    }

    const book = await this.bookRepository.createBook({
      title,
      author,
      publicationYear,
      isbn,
      description,
      image: filename,
    })

    await client.index({
      index: "books",
      id: book._id.toString(),
      body: {
        title,
        author,
        publicationYear,
        isbn,
        description,
      },
    })

    return book
  }

  async getAllBooks(): Promise<IBook[]> {
    return this.bookRepository.getAllBooks()
  }

  async getBookById(id: string): Promise<IBook> {
    const book = await this.bookRepository.getBookById(id)
    if (!book) {
      throw new Error("Book not found")
    }
    return book
  }

  async updateBook(id: string, data: any, filename?: string): Promise<IBook> {
    if (filename) {
      data.image = filename
    }

    const updatedBook = await this.bookRepository.updateBook(id, data)
    if (!updatedBook) {
      throw new Error("Book not found")
    }

    await client.update({
      index: "books",
      id: id,
      body: {
        doc: data,
      },
    })

    return updatedBook
  }

  async deleteBook(id: string): Promise<IBook> {
    const deletedBook = await this.bookRepository.deleteBook(id)
    if (!deletedBook) {
      throw new Error("Book not found")
    }

    await client.delete({
      index: "books",
      id: id,
    })

    return deletedBook
  }
}

