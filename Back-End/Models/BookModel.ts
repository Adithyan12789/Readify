import mongoose, { Schema, Model } from "mongoose";
import { IBook } from "../Types/UserTypes";

const bookSchema: Schema<IBook> = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    publicationYear: { type: Number, required: true },
    isbn: { type: String, required: true, unique: true },
    description: { type: String, required: false },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

const Book: Model<IBook> = mongoose.model<IBook>("Book", bookSchema);

export default Book;
