import express from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
