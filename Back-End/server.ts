import Database from "./Config/Database";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoutes from "./Routes/UserRoutes";
import express from "express";
const app = express();

dotenv.config();
Database.connectDB();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static('Back-End/public')); 

app.use("/api/users", UserRoutes);

app.listen(port, () => console.log(`Server Is Running On Port http://localhost:${port}/`));
