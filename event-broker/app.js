import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
const app = express();
app.use(bodyParser.json());

const events = [];

app.get('/events', (req, res) => {
  res.send(events);
});

app.post("/events", async (req, res) => {
  const event = req.body;
  console.log(`New Event in EB: ${JSON.stringify(event, null, 2)}`)
  events.push(event);
  const promises = [
    axios.post("http://posts-svc:4000/events", event),
    axios.post("http://comments-svc:4001/events", event),
    axios.post("http://query-svc:4002/events", event),
    axios.post("http://cf-svc:4003/events", event),
  ];

  await Promise.allSettled(promises);

  res.send({ status: "OK" });
});

const PORT = 4005;
app.listen(PORT, console.log("Event broker service started on port ", PORT));
