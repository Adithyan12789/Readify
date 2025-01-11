"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Database_1 = __importDefault(require("./Config/Database"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const UserRoutes_1 = __importDefault(require("./Routes/UserRoutes"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const ElasticsearchMiddleware_1 = require("./Middlewares/ElasticsearchMiddleware");
const app = (0, express_1.default)();
dotenv_1.default.config();
Database_1.default.connectDB();
const port = process.env.PORT || 5000;
(0, ElasticsearchMiddleware_1.createBookIndex)();
const allowedOrigins = [
    "https://readify.space/",
    "https://www.readify.space/",
    'http://localhost:3001'
];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// Configure cookie settings for cross-origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});
app.use(express_1.default.static('Back-End/public'));
app.use("/api/users", UserRoutes_1.default);
app.listen(port, () => console.log(`Server Is Running On Port http://localhost:${port}/`));
