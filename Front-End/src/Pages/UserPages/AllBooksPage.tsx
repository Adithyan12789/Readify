'use client';

import React, { useState } from "react";
import Footer from "../../Components/UserComponents/Footer";
import { useGetBooksQuery } from "../../Slices/UserApiSlice";
import { BookData } from "../../Types/UserTypes";
import { Loader } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BOOK_IMAGE_DIR_PATH = "https://api.readify.space/bookImages/";

const AllBooksPage: React.FC = () => {
  const { data: books, isLoading } = useGetBooksQuery({});
  const [searchQuery, setSearchQuery] = useState("");
  const [filterByAuthor, setFilterByAuthor] = useState("");
  const [sortOption, setSortOption] = useState("title"); // Default sort by title

  const navigate = useNavigate();

  // Handle search, filter, and sort
  const filteredBooks = books
    ? books
        .filter((book: BookData) =>
          book.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .filter((book: BookData) =>
          filterByAuthor ? book.author.toLowerCase().includes(filterByAuthor.toLowerCase()) : true
        )
        .sort((a: BookData, b: BookData) => {
          if (sortOption === "title") {
            return a.title.localeCompare(b.title);
          } else if (sortOption === "author") {
            return a.author.localeCompare(b.author);
          } else if (sortOption === "date") {
            return new Date(b.publicationYear).getTime() - new Date(a.publicationYear).getTime();
          }
          return 0;
        })
    : [];

  if (isLoading) return <Loader />;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main>
        {/* Header Section */}
        <div className="bg-white shadow-md">
          <div className="flex flex-col items-center justify-between px-6 py-4 mx-auto max-w-7xl sm:flex-row sm:px-8">
            <h1 className="text-2xl font-bold text-gray-800">All Books</h1>
            <div className="flex flex-col mt-4 space-y-2 sm:mt-0 sm:flex-row sm:space-y-0 sm:space-x-4">
              <input
                type="text"
                placeholder="Search by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <input
                type="text"
                placeholder="Filter by author..."
                value={filterByAuthor}
                onChange={(e) => setFilterByAuthor(e.target.value)}
                className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              />
              <select
                title="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="title">Sort by Title</option>
                <option value="author">Sort by Author</option>
                <option value="date">Sort by Date</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books Section */}
        <section className="py-12 bg-gray-100">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            {filteredBooks.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                {filteredBooks.map((book: BookData) => (
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
            ) : (
              <p className="text-center text-gray-600">No books found matching your criteria.</p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AllBooksPage;
