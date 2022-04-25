import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

const app = express();
app.use(bodyParser.json());
app.post('/events', async (req, res) => { 
  const { type, data } = req.body;
  console.log('Event Received: ', type);
  if( type === 'CommentCreated' ) {
    const status = data.content.includes('bad') ? 'rejected': 'approved';
    await axios.post('http://eb-svc:4005/events', {
        type: 'CommentModerated',
        data: {
          id: data.id,
          postId: data.postId,
          status,
          content: data.content,
        }
    });
  }
  res.send({});
});

const PORT=4003
app.listen(PORT, () => {
  console.log('Content Filter service listening on port', PORT);
});
