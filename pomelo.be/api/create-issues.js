const axios = require('axios');
require('dotenv').config();

const apiBaseUrl = process.env.API_BASE_URL;
const apiRestUrl = apiBaseUrl + process.env.API_REST_URL;
const apiUserName = process.env.API_USER_NAME;
const apiKeyValue = process.env.API_KEY_VALUE;

const auth = {
  username: apiUserName,
  password: apiKeyValue
};

async function createIssues(req, res) {
  try {
    const url = `${apiRestUrl}/issue/bulk`;
    const data = { issueUpdates: req.body };
    const config = {
      headers: { 'Content-Type': 'application/json' },
      auth: auth
    };

    const response = await axios.post(url, data, config);
    return res.json({ data: response.data });

  } catch (error) {
    console.log(error.response.data.errors);
    return res.status(500).json(error.response.data.errors);
  }
}

module.exports = createIssues;