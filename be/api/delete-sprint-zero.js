const axios = require('axios');
require('dotenv').config();

const apiAgileUrl = process.env.API_AGILE_URL;

async function deleteSprintZero(req, res) {
  try {
    const allSprintsUrl = `${req.query.jiraBaseUrl}${apiAgileUrl}/board/${req.query.boardId}/sprint`;
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: {
        username: req.query.userName,
        password: req.query.apiKey
      }
    };

    const allSprintsResponse = await axios.get(allSprintsUrl, config);
    const sprintZeroId = allSprintsResponse.data.values[0].id;
    const sprintZeroUrl = `${req.query.jiraBaseUrl}${apiAgileUrl}/sprint/${sprintZeroId}`;

    const response = await axios.delete(sprintZeroUrl, config);

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

module.exports = deleteSprintZero;
