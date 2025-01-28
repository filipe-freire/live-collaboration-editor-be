import { SQLite } from "@hocuspocus/extension-sqlite";
import { Server } from "@hocuspocus/server";
import "dotenv/config";
import express from "express";
import expressWs from "express-ws";

// Hocuspocus configuration
const server = Server.configure({
	extensions: [
		new SQLite({
			database: process.env.NODE_ENV === "production" ? "prod.db" : "dev.db",
			schema: `
        CREATE TABLE IF NOT EXISTS "documents" (
          "name" varchar(255) NOT NULL,
          "data" blob NOT NULL,
          UNIQUE(name)
        )`,
		}),
	],
});

const { app } = expressWs(express());

// HTTP Route Handlers
app.get("/", (req, res) => {
	res.send("OK");
});

// WebSocket Handlers
app.ws("/live-collaboration", (ws, req) => {
	server.handleConnection(ws, req);
});

const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 1221;
// Server start up
app.listen(PORT, () => {
	console.log(`Listening on http://127.0.0.1:${PORT}`);
});
