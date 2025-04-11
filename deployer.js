const express = require('express');
const { exec } = require('child_process');
const app = express();

app.use(express.json());

app.post('/deploy', (req, res) => {
  exec('/root/projects/luna/deploy.sh', (error, stdout, stderr) => {
    if (error) {
      console.error(`Deployment error: ${error}`);
      return res.status(500).send("Deployment failed");
    }
    console.log(stdout);
    res.send("Deployment succeeded");
  });
});

app.listen(3000, () => console.log("Webhook listener started on port 3000"));
