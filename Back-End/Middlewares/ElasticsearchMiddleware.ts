import client from "../Config/Elasticsearch";

export const createBookIndex = async () => {
  try {
    const exists = await client.indices.exists({ index: "books" });

    if (!exists) {
      await client.indices.create({
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
    } else {
      console.log("Books index already exists.");
    }
  } catch (error) {
    console.error("Error creating books index:", error);
  }
};
