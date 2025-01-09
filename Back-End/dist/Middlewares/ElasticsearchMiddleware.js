"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBookIndex = void 0;
const Elasticsearch_1 = __importDefault(require("../Config/Elasticsearch"));
const createBookIndex = async () => {
    try {
        const exists = await Elasticsearch_1.default.indices.exists({ index: "books" });
        if (!exists) {
            await Elasticsearch_1.default.indices.create({
                index: "books",
                body: {
                    mappings: {
                        properties: {
                            title: { type: "text" },
                            author: { type: "text" },
                            description: { type: "text" },
                            publicationYear: { type: "date" },
                        },
                    },
                },
            });
            console.log("Books index created successfully!");
        }
        else {
            console.log("Books index already exists.");
        }
    }
    catch (error) {
        console.error("Error creating books index:", error);
    }
};
exports.createBookIndex = createBookIndex;
