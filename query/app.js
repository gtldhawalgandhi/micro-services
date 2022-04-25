import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
app.use(bodyParser.json());
app.use(cors());

const posts = {};
const handleEvents = (type, data) => {
  if (type === "PostCreated") {
    console.log("PostCreated event ");
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  }
  if (type === "CommentCreated") {
    console.log("CommentCreated event ");
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  if (type === "CommentUpdated") {
    console.log("CommentUpdated event ");
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => {
      return comment.id === id;
    });
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/events", (req, res) => {
  const { type, data } = req.body;
  handleEvents(type, data);
  res.send({});
});

const PORT = 4002;
app.listen(PORT, async () => {
  console.log("Query service started on port ", PORT);
  const res = await axios.get("http://eb-svc:4005/events");
  for (let event of res.data) {
    console.log("Processing event:", event.type);
    handleEvents(event.type, event.data);
  }
});
