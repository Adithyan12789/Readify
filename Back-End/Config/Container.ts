import { Container } from "inversify";
import { UserController } from "../Controllers/UserController";
import { IUserService } from "../Interface/IUser/IService";
import { IUserRepository } from "../Interface/IUser/IRepository";
import { UserRepository } from "../Repositories/UserRepository";
import { UserService } from "../Services/UserService";
import { BookController } from "../Controllers/BookController";
import { BookRepository } from "../Repositories/BookRepository";
import { BookService } from "../Services/BookService";
import { IBookRepository } from "../Interface/IBook/IRepository";
import { IBookService } from "../Interface/IBook/IService";
import { BookSearchRepository } from "../Repositories/ElasticSearchReposiotry";
import { IBookSearchRepository } from "../Interface/IBookElasticSearch/IRepository";

const container = new Container();

// User Bindings

container.bind<UserController>("UserController").to(UserController);
container.bind<IUserService>("IUserService").to(UserService);
container.bind<IUserRepository>("IUserRepository").to(UserRepository);


// Book Bindings

container.bind<BookController>("BookController").to(BookController);
container.bind<IBookService>("IBookService").to(BookService);
container.bind<IBookRepository>("IBookRepository").to(BookRepository);
container.bind<IBookSearchRepository>("IBookSearchRepository").to(BookSearchRepository);


export { container };