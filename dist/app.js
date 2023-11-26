"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./Config/db"));
const app = (0, express_1.default)();
app.get("/", (req, res) => {
    res.send("Hello World!");
});
// Database connection
db_1.default.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
// Start the Express server
app.listen(3000, () => {
    console.log("Server started on port 3000!");
});
