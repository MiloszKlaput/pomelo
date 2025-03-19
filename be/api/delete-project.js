const axios = require('axios');
require('dotenv').config();

const apiRestUrl = process.env.API_REST_URL;

async function deleteProject(req, res) {
  try {
    const projectKey = req.body.projectKey;
    const url = `${req.body.jiraBaseUrl}${apiRestUrl}/project/${projectKey}`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.body.userName,
        password: req.body.apiKey
      }
    };

    const response = await axios.delete(url, config);
    return res.json({ data: response.data });

  } catch (error) {
    let errorMessage = '';
    if (error.response) {
      errorMessage = error.response.data.errors ?? error.response.data.errorMessages;
      console.error("Error response: ", errorMessage);
    } else if (error.request) {
      errorMessage = 'Wystąpił nieznany błąd.'
      console.error("No response received: ", error.request);
    } else {
      errorMessage = 'Wystąpił nieznany błąd.'
      console.error("Error during request setup: ", error.message);
    }
    return res.status(500).json(errorMessage);
  }
}

module.exports = deleteProject;
