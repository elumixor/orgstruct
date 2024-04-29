import fs from "fs";

export const connectionParams = JSON.parse(fs.readFileSync("secret/sql.json", "utf-8")) as {
    host: string;
    user: string;
    password: string;
    database: string;
};
