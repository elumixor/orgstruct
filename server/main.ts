import { green } from "@utils";
import { Api } from "./api";
import { server } from "./server";

const port = process.env["PORT"] || 4000;

// Create an api
const api = new Api();

// Start up the express server
const s = server(api);

s.listen(port, () => {
    console.log(green(`Listening on http://localhost:${port}`));
});
