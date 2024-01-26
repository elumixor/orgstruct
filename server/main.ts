import { DB } from "./db/db";
import { server } from "./server";

const port = process.env["PORT"] || 4000;

// Create a database
const db = new DB();

// Start up the Node server
const s = server(db);

s.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
});
