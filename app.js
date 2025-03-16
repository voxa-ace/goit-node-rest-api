import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import path from "path";
import { fileURLToPath } from "url"; 
import sequelize from "./db/Sequelize.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use("/avatars", express.static(path.join(__dirname, "public", "avatars")));

app.use("/api/contacts", contactsRouter);
app.use("/api/auth", authRouter);
app.use(express.static("public"));

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

sequelize.sync({ alter: true })
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch(console.error);
