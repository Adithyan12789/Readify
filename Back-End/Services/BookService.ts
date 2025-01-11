import BookRepository from "../Repositories/BookRepository";
import client from "../Config/Elasticsearch";

class BookService {
  async createBook(data: any, filename: string) {
    const { title, author, publicationYear, isbn, description } = data;
  
    if (!title || !author || !publicationYear || !isbn || !filename) {
      throw new Error("All required fields, including the image filename, must be provided");
    }

    const book = await BookRepository.createBook({
      title,
      author,
      publicationYear,
      isbn,
      description,
      image: filename,
    });

    await client.index({
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
    return BookRepository.getAllBooks();
  }

  async getBookById(id: string) {
    const book = await BookRepository.getBookById(id);
    if (!book) {
      throw new Error("Book not found");
    }
    return book;
  }

  async updateBook(id: string, data: any, filename?: string) {
    if (filename) {
      data.image = filename;
    }

    const updatedBook = await BookRepository.updateBook(id, data);
    if (!updatedBook) {
      throw new Error("Book not found");
    }

    // Update the book in Elasticsearch
    let result = await client.update({
      index: "books",
      id: id,
      body: {
        doc: data,  // Only update fields that have changed
      },
    });

    console.log("result: ", result);

    return updatedBook;
  }

  async deleteBook(id: string) {
    const deletedBook = await BookRepository.deleteBook(id);
    if (!deletedBook) {
      throw new Error("Book not found");
    }
    
    await client.delete({
      index: "books",
      id: id,
    });

    return deletedBook;
  }
}

export default new BookService();
