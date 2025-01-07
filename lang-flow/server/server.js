const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/message', (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).send({ error: 'Message is required' });
  }

  const command = `node scripts/chal.js "${userMessage}" "chat" "chat" false`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Exec error: ${error}`);
      return res.status(500).send({ error: 'Internal server error' });
    }

    if (stderr) {
      console.error(`Error: ${stderr}`);
    }

    res.send({ response: stdout.trim() });
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
