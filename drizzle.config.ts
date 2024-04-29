import "dotenv/config";
import type { Config } from "drizzle-kit";
import { connectionParams } from "./src/server/db";

export default {
    schema: "./src/server/db/schema.ts",
    out: "./drizzle",
    driver: "pg", // 'pg' | 'mysql2' | 'better-sqlite' | 'libsql' | 'turso'
    dbCredentials: {
        ...connectionParams,
    },
} satisfies Config;
