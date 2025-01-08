'use client';

import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetBookByIdQuery } from '../../Slices/UserApiSlice';
import { Loader, Edit3, Trash } from 'lucide-react';

const BOOK_IMAGE_DIR_PATH = "http://localhost:5000/bookImages/";

const BookDetailPage: React.FC = () => {
  const { bookId } = useParams<{ bookId: string }>();
  
  if (!bookId) {
    return <p>Invalid book ID.</p>;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data: book, isLoading } = useGetBookByIdQuery(bookId);

  if (isLoading) return <div className="flex items-center justify-center h-screen"><Loader className="animate-spin" size={48} /></div>;
  if (!book) return <p>Book not found.</p>;

  return (
    <div className="container py-12 mx-auto">
      <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row">
          <img
            src={book.image ? `${BOOK_IMAGE_DIR_PATH}${book.image}` : ''}
            alt={book.title}
            className="object-cover w-full h-full md:w-1/3"
          />
          <div className="p-6 md:w-2/3">
            <h1 className="mb-4 text-4xl font-bold text-gray-800">{book.title}</h1>
            <p className="mb-4 text-lg text-gray-600">
              <span className="font-semibold">Author:</span> {book.author}
            </p>
            <p className="mb-6 text-lg text-gray-600">
              <span className="font-semibold">Description:</span> {book.description}
            </p>
            <div className="flex space-x-4 justify-content-center">
              <button
                className="flex items-center px-4 py-2 text-white transition bg-blue-500 rounded-lg hover:bg-blue-600"
                onClick={() => console.log('Edit book', bookId)}
              >
                <Edit3 className="mr-2" size={18} />
                Edit
              </button>
              <button
                className="flex items-center px-4 py-2 text-white transition bg-red-500 rounded-lg hover:bg-red-600"
                onClick={() => console.log('Delete book', bookId)}
              >
                <Trash className="mr-2" size={18} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
