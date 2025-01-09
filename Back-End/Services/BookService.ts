import BookRepository from "../Repositories/BookRepository";

class BookService {
  async createBook(data: any, filename: string) {
    const { title, author, publicationYear, isbn, description } = data;
  
    if (!title || !author || !publicationYear || !isbn || !filename) {
      throw new Error("All required fields, including the image filename, must be provided");
    }
  
    const result = BookRepository.createBook({
      title,
      author,
      publicationYear,
      isbn,
      description,
      image: filename,
    });

    return result;
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
    return updatedBook;
  }  

  async deleteBook(id: string) {
    const deletedBook = await BookRepository.deleteBook(id);
    if (!deletedBook) {
      throw new Error("Book not found");
    }
    return deletedBook;
  }
}

export default new BookService();
