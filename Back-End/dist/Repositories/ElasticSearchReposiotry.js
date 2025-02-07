"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookSearchRepository = void 0;
const inversify_1 = require("inversify");
const Elasticsearch_1 = __importDefault(require("../Config/Elasticsearch"));
let BookSearchRepository = class BookSearchRepository {
    async indexBook(id, book) {
        await Elasticsearch_1.default.index({
            index: "books",
            id: id,
            body: book,
        });
    }
    async updateBookIndex(id, book) {
        await Elasticsearch_1.default.update({
            index: "books",
            id: id,
            body: { doc: book },
        });
    }
    async deleteBookIndex(id) {
        await Elasticsearch_1.default.delete({
            index: "books",
            id: id,
        });
    }
};
exports.BookSearchRepository = BookSearchRepository;
exports.BookSearchRepository = BookSearchRepository = __decorate([
    (0, inversify_1.injectable)()
], BookSearchRepository);
