import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

const app = express();
const PORT = process.env.PORT || 4000;
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { dbName: "taskmanager" })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => console.error("Connection failed:", err));

app.get("/", (req, res) => {
  res.send("Hi there!");
});
