import { IBook } from "../../Types/UserTypes";

export interface IBookSearchRepository {
    indexBook(id: string, book: Partial<IBook>): Promise<void>;
    updateBookIndex(id: string, book: Partial<IBook>): Promise<void>;
    deleteBookIndex(id: string): Promise<void>;
}
  