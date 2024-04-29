import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { run } from "@elumixor/angular-server";
import { Api } from "./api";

const handler = new Api();

void run(handler, {
    useWslIp: true,
    prodPort: 4200,
    devPort: 4000,
    angular: {
        serverDistFolder: dirname(fileURLToPath(import.meta.url)),
        bootstrapLoader: () => import("../client/main.server"),
    },
});
