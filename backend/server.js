import express from "express";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello from the backend!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Hola desde backend!" });
});

app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
