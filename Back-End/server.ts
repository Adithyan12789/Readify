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

const allowedOrigins = [
    "https://readify.space/",
    "https://www.readify.space/",
    'http://localhost:3001'
  ];
  
  app.use(cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  }));
  

  app.use(morgan('dev')); 
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  
  // Configure cookie settings for cross-origin
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
app.use(express.static('Back-End/public')); 

app.use("/api/users", UserRoutes);

app.listen(port, () => console.log(`Server Is Running On Port http://localhost:${port}/`));
