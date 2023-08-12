const express = require("express");
require("dotenv").config();
const cors = require("cors"); // Import modul cors

const router = require("./src/routes");

const app = express();
app.use(cors());
const port = 5000;

app.use(express.json());

app.use("/api/v2/", router);
app.listen(port, () => console.log(`Listening on port ${port}!`));
