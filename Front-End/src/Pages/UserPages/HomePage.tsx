'use client';

import React, { useState, useEffect } from "react";
import Footer from "../../Components/UserComponents/Footer";
import CreateBookModal from "../../Components/UserComponents/CreateBook";
import { useCreateBookMutation, useGetBooksQuery } from "../../Slices/UserApiSlice";
import { BookData } from "../../Types/UserTypes";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BOOK_IMAGE_DIR_PATH = "https://api.animexz.shop/bookImages/";

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createBook] = useCreateBookMutation();
  const { data: books, isLoading, refetch } = useGetBooksQuery({});
  const [isBookCreated, setIsBookCreated] = useState(false); // Track book creation state

  const navigate = useNavigate();

  useEffect(() => {
    // Refetch the books data whenever a book is created
    if (isBookCreated) {
      refetch(); // Trigger re-fetching of books list
      setIsBookCreated(false); // Reset the state
    }
  }, [isBookCreated, refetch]);

  if (isLoading) return <Loader />;

  return (
    <div
      className={`flex flex-col min-h-screen bg-gray-50 ${isModalOpen ? "opacity-50" : ""}`}
    >
      <main>
        {/* Header Section */}
        <div className="bg-white shadow-md">
          <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl sm:px-8">
            <h1 className="text-2xl font-bold text-gray-800">BookStore</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Create New Book
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="text-white bg-gradient-to-r from-indigo-500 to-purple-500">
          <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="md:flex md:items-center md:justify-between">
              <div className="md:w-1/2">
                <h1 className="text-5xl font-extrabold">Discover Your Next Favorite Book</h1>
                <p className="mt-4 text-lg">
                  Dive into our curated collection of books across all genres.
                  Whether you're seeking thrilling adventures or heartwarming tales, we've got you covered.
                </p>
                <div className="mt-6">
                  <a
                    href="/allBooks"
                    className="px-6 py-3 text-lg font-medium text-indigo-600 bg-white rounded-md hover:bg-gray-100"
                  >
                    Browse Books
                  </a>
                </div>
              </div>
              <div className="mt-8 md:mt-0 md:w-1/2">
                <img
                  className="object-cover w-full h-auto rounded-lg shadow-lg"
                  src="/34b114ac2bf9820c74cffdf33c157fb7.jpg"
                  alt="Stack of colorful books"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Featured Books Section */}
        <section className="py-12 bg-gray-100">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h2 className="mb-8 text-3xl font-extrabold text-gray-800">Featured Books</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {books.map((book: BookData) => (
                <div
                  key={book._id}
                  onClick={() => navigate(`/book/${book._id}`)}
                  className="p-4 bg-white rounded-lg shadow-md cursor-pointer group hover:shadow-lg"
                >
                  <div className="overflow-hidden rounded-lg aspect-w-3 aspect-h-4">
                    <img
                      src={book.image ? `${BOOK_IMAGE_DIR_PATH}${book.image}` : ""}
                      alt={book.title}
                      className="object-cover object-center w-full h-full transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                    {book.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">{book.author}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <a
                href="/allBooks"
                className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                View All Books
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CreateBookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} createBook={createBook} />
    </div>
  );
};

export default HomePage;
