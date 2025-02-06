import type { IBook } from "../../Types/UserTypes"

export interface IBookRepository {
  createBook(data: any): Promise<IBook>
  getAllBooks(): Promise<IBook[]>
  getBookById(id: string): Promise<IBook | null>
  updateBook(id: string, data: any): Promise<IBook | null>
  deleteBook(id: string): Promise<IBook | null>
}

