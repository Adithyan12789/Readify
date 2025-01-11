import { Client } from "@elastic/elasticsearch";
import * as dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || "https://localhost:9200",
  auth: {
    username: process.env.ELASTIC_USERNAME || "elastic",
    password: process.env.ELASTIC_PASSWORD || "metasploit.123",
  },
  tls: {
    ca: fs.readFileSync("../certs/http_ca.crt", "utf-8"),
    rejectUnauthorized: false,
  },
});

export default client;
