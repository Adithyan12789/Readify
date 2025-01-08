import Book from "../Models/BookModel";

class BookRepository {
  createBook(data: any) {
    return Book.create(data);
  }  

  getAllBooks() {
    return Book.find();
  }

  getBookById(id: string) {
    return Book.findById(id);
  }

  updateBook(id: string, data: any) {
    return Book.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  deleteBook(id: string) {
    return Book.findByIdAndDelete(id);
  }
}

export default new BookRepository();
