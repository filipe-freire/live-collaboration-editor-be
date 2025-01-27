import { SQLite } from "@hocuspocus/extension-sqlite";
import { Server } from "@hocuspocus/server";
import express from "express";
import expressWs from "express-ws";

// Hocuspocus configuration
const server = Server.configure({
	extensions: [
		new SQLite({
			database: "test.db",
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
	const ctx = {
		user: {
			id: 1234,
			name: "John Doe",
		},
	};

	server.handleConnection(ws, req, ctx);
});

// Server start up
app.listen(1234, () => {
	console.log("Listening on ws://127.0.0.1:1234");
});
