import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import { randomBytes } from "crypto";
import cors from "cors";

const app = express();
app.use(bodyParser.json());
app.use(cors());
const posts = {};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  console.log(`Event: ${req.body.type}`);
  res.send("ok");
});

app.post("/posts", async (req, res) => {
  const id = randomBytes(5).toString("hex");
  const { title } = req.body;

  posts[id] = { id, title };
  await axios.post("http://eb-svc:4005/events", {
    type: "PostCreated",
    data: { id, title },
  });

  res.status(201).send(posts[id]);
});

const PORT = 4000;
app.listen(
  PORT,
  console.log("Posts service started on port ", PORT)
);

