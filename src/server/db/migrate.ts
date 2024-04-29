import { log } from "../logger";
import chalk from "chalk";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import { connectionParams } from "./connection";

async function run() {
    const migrationClient = postgres({ ...connectionParams, max: 1 });
    await migrate(drizzle(migrationClient), {
        migrationsFolder: "./drizzle",
    });

    log.info(chalk.green("Migrations ran successfully!"));

    await migrationClient.end();
}

void run();
