import type { IBook } from "../../Types/UserTypes"

export interface IBookService {
  createBook(data: any, filename: string): Promise<IBook>
  getAllBooks(): Promise<IBook[]>
  getBookById(id: string): Promise<IBook>
  updateBook(id: string, data: any, filename?: string): Promise<IBook>
  deleteBook(id: string): Promise<IBook>
}

