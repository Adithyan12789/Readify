import Database from "./Config/Database";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import UserRoutes from "./Routes/UserRoutes";
import express from "express";
import cors from "cors"; 
import morgan from "morgan";
import { createBookIndex } from "./Middlewares/ElasticsearchMiddleware";
const app = express();

dotenv.config();
Database.connectDB();

const port = process.env.PORT || 5000;

createBookIndex();

const allowedOrigins = ['https://readify.space', 'https://www.readify.space'];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies or credentials
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allow specific methods
}));

  app.use(morgan('dev')); 
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://www.readify.space');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
  // Configure cookie settings for cross-origin
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
app.use(express.static('Back-End/public')); 

app.use("/api/users", UserRoutes);

app.listen(port, () => console.log(`Server Is Running On Port http://localhost:${port}/`));
