"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
const inversify_1 = require("inversify");
const UserController_1 = require("../Controllers/UserController");
const UserRepository_1 = require("../Repositories/UserRepository");
const UserService_1 = require("../Services/UserService");
const BookController_1 = require("../Controllers/BookController");
const BookRepository_1 = require("../Repositories/BookRepository");
const BookService_1 = require("../Services/BookService");
const ElasticSearchReposiotry_1 = require("../Repositories/ElasticSearchReposiotry");
const container = new inversify_1.Container();
exports.container = container;
// User Bindings
container.bind("UserController").to(UserController_1.UserController);
container.bind("IUserService").to(UserService_1.UserService);
container.bind("IUserRepository").to(UserRepository_1.UserRepository);
// Book Bindings
container.bind("BookController").to(BookController_1.BookController);
container.bind("IBookService").to(BookService_1.BookService);
container.bind("IBookRepository").to(BookRepository_1.BookRepository);
container.bind("IBookSearchRepository").to(ElasticSearchReposiotry_1.BookSearchRepository);
