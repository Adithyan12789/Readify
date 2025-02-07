import { injectable } from "inversify";
import client from "../Config/Elasticsearch";
import type { IBookSearchRepository } from "../Interface/IBookElasticSearch/IRepository";
import type { IBook } from "../Types/UserTypes";

@injectable()
export class BookSearchRepository implements IBookSearchRepository {
  async indexBook(id: string, book: Partial<IBook>): Promise<void> {
    await client.index({
      index: "books",
      id: id,
      body: book,
    });
  }

  async updateBookIndex(id: string, book: Partial<IBook>): Promise<void> {
    await client.update({
      index: "books",
      id: id,
      body: { doc: book },
    });
  }

  async deleteBookIndex(id: string): Promise<void> {
    await client.delete({
      index: "books",
      id: id,
    });
  }
}
