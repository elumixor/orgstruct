import { APP_BASE_HREF } from "@angular/common";
import { CommonEngine } from "@angular/ssr";
import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import bootstrap from "../src/main.server";

export interface ServerHandler {
    registerConnections(server: express.Express): void;
}

// The Express app is exported so that it can be used by serverless Functions.
export function server(...handlers: ServerHandler[]) {
    const server = express();
    const serverDistFolder = dirname(fileURLToPath(import.meta.url));
    const browserDistFolder = resolve(serverDistFolder, "../browser");
    const indexHtml = join(serverDistFolder, "index.server.html");

    const commonEngine = new CommonEngine();

    server.set("view engine", "html");
    server.set("views", browserDistFolder);

    server.use(express.json());

    // Example Express Rest API endpoints
    for (const handler of handlers) handler.registerConnections(server);

    // Serve static files from /browser
    server.get(
        "*.*",
        express.static(browserDistFolder, {
            maxAge: "1y",
        })
    );

    // All regular routes use the Angular engine
    server.get("*", (req, res, next) => {
        const { protocol, originalUrl, baseUrl, headers } = req;

        commonEngine
            .render({
                bootstrap,
                documentFilePath: indexHtml,
                url: `${protocol}://${headers.host}${originalUrl}`,
                publicPath: browserDistFolder,
                providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
            })
            .then((html) => res.send(html))
            .catch((err) => next(err));
    });

    return server;
}
