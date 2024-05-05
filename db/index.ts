import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// connect to database
// for query purposes
const sql = postgres({
  host: process.env.DB_HOST, // Postgres ip address[s] or domain name[s]
  port: 5432, // Postgres server port[s]
  database: process.env.DB_NAME, // Name of database to connect to
  username: process.env.DB_USER, // Username of database user
  password: process.env.DB_PASSWORD, // Password of database user
  ssl: "require", // Password of database user
});
export const db = drizzle(sql);

// console.log(db);
