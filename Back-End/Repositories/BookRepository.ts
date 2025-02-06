import { injectable } from "inversify"
import { BaseRepository } from "./Base/BaseRepository"
import type { IBook } from "../Types/UserTypes"
import type { IBookRepository } from "../Interface/IBook/IRepository"
import Book from "../Models/BookModel"

@injectable()
export class BookRepository extends BaseRepository<IBook> implements IBookRepository {
  constructor() {
    super(Book)
  }

  async createBook(data: any): Promise<IBook> {
    return Book.create(data)
  }

  async getAllBooks(): Promise<IBook[]> {
    return Book.find()
  }

  async getBookById(id: string): Promise<IBook | null> {
    return Book.findById(id)
  }

  async updateBook(id: string, data: any): Promise<IBook | null> {
    return Book.findByIdAndUpdate(id, { $set: data }, { new: true, runValidators: true })
  }

  async deleteBook(id: string): Promise<IBook | null> {
    return Book.findByIdAndDelete(id)
  }
}

