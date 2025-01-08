import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { BookData } from '../../Types/UserTypes';
import { X } from 'lucide-react';

interface CreateBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createBook: (bookData: BookData) => Promise<{ data: BookData } | { error: any }>;
}

const CreateBookModal: React.FC<CreateBookModalProps> = ({ isOpen, onClose, createBook }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<BookData>({
    title: '',
    author: '',
    publicationYear: new Date().getFullYear(),
    isbn: '',
    description: '',
    image: ''
  });
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: name === 'publicationYear' ? parseInt(value, 10) || '' : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!formData.title || !formData.author || !formData.publicationYear || !formData.isbn) {
      toast.error('Please fill in all required fields!');
      return;
    }
  
    if (isNaN(formData.publicationYear) || formData.publicationYear < 0) {
      toast.error('Publication year must be a valid number!');
      return;
    }
  
    if (!image) {
      toast.error('Please upload an image!');
      return;
    }
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('publicationYear', formData.publicationYear.toString());
      formDataToSend.append('isbn', formData.isbn);
      formDataToSend.append('description', formData.description || '');
      formDataToSend.append('bookImage', image);
  
      const result = await createBook(formDataToSend as unknown as BookData);
      
      console.log("result: ", result);

        toast.success('Book added successfully!');
        navigate('/');
        setFormData({
          title: '',
          author: '',
          publicationYear: new Date().getFullYear(),
          isbn: '',
          description: '',
          image: ''
        });
        setImage(null);
        setPreview(null);
        onClose();
    } catch (error) {
      toast.error('Failed to add book');
      console.error('Failed to add book:', error);
    }
  };   
  
  console.log("book image: ", image);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="flex items-center justify-center min-h-screen bg-black/50">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="relative w-full max-w-lg p-8 transition-all bg-white rounded-lg shadow-lg dark:bg-gray-800">
              <div className="flex items-center justify-between">
                <Dialog.Title className="text-2xl font-semibold text-gray-900 dark:text-white">
                  Create New Book
                </Dialog.Title>
                <button
                  title='add'
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 dark:text-[rgb(124,124,124)]"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 mt-1 text-sm bg-transparent border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="author"
                    className="block text-sm font-medium text-gray-700 dark:text-[rgb(124,124,124)]"
                  >
                    Author
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 mt-1 text-sm bg-transparent border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="publicationYear"
                    className="block text-sm font-medium text-gray-700 dark:text-[rgb(124,124,124)]"
                  >
                    Publication Year
                  </label>
                  <input
                    type="number"
                    id="publicationYear"
                    name="publicationYear"
                    value={formData.publicationYear}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 mt-1 text-sm bg-transparent border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="isbn"
                    className="block text-sm font-medium text-gray-700 dark:text-[rgb(124,124,124)]"
                  >
                    ISBN
                  </label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 mt-1 text-sm bg-transparent border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                <label
                    htmlFor="image"
                    className="block text-sm font-medium text-gray-700 dark:text-[rgb(124,124,124)]"
                  >
                    Book Cover
                  </label>
                  <div className="flex items-center mt-2">
                    <label
                      htmlFor="image"
                      className="px-4 py-2 text-sm font-medium text-white transition-all bg-indigo-500 rounded-md shadow-md cursor-pointer hover:bg-indigo-600"
                    >
                      Upload Image
                    </label>
                    <input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      value={formData.image}
                    />
                    {preview && (
                      <img
                        src={preview}
                        alt="Preview"
                        className="object-cover w-16 h-16 ml-4 rounded-md shadow-md"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 dark:text-[rgb(124,124,124)]"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 mt-1 text-sm bg-transparent border border-gray-300 rounded-md dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  ></textarea>
                </div>
                <div className="flex items-center justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CreateBookModal;
