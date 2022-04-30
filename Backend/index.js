const express = require("express");
const dotenv = require("dotenv");
const connectToMongo = require("./db");
const cors = require("cors");

dotenv.config();
connectToMongo();

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.json());
app.use(cors());

app.use("/api/products", require("./routes/products"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/messages", require("./routes/messages"));
app.use("/newsletter", require("./routes/newsletter"));
app.use("/orders", require("./routes/orders"));

app.listen(process.env.PORT, () => {
    console.log(`listning on port http://localhost:${process.env.PORT}`);
});
